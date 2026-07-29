import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import { SECRET_KEY } from "../configs/constant";
import { UserModel, IUser } from "../models/user.model";
import { MessageModel } from "../models/message.model";
import { NotificationModel } from "../models/notification.model";

const userData = (suffix: string, role: "student" | "counsellor" = "student") => ({
  fullName: `Message ${suffix}`,
  username: `message-${suffix.toLowerCase()}`,
  email: `message-${suffix.toLowerCase()}@test.com`,
  phoneNumber: "9800000041",
  studyLevel: "undergraduate" as const,
  destination: "canada" as const,
  fieldOfStudy: "Computer Science",
  intake: "fall" as const,
  budget: "20k-35k" as const,
  password: "password123",
  role,
});

const tokenFor = (user: IUser) => jwt.sign(
  { id: user._id.toString(), role: user.role, email: user.email },
  SECRET_KEY,
);

let student: IUser;
let counsellor: IUser;
let outsider: IUser;
let studentToken: string;
let counsellorToken: string;
let outsiderToken: string;
let conversationId: string;

beforeAll(async () => {
  [student, counsellor, outsider] = await UserModel.create([
    userData("Student"),
    userData("Counsellor", "counsellor"),
    userData("Outsider"),
  ]);
  studentToken = tokenFor(student);
  counsellorToken = tokenFor(counsellor);
  outsiderToken = tokenFor(outsider);
});

describe("Messaging API", () => {
  it("requires authentication and validates real conversation participants", async () => {
    expect((await request(app).get("/api/v1/messages/conversations")).status).toBe(401);

    const missing = await request(app)
      .post("/api/v1/messages/conversations")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ participantIds: ["0123456789abcdef01234567"], title: "Missing user" });
    expect(missing.status).toBe(400);

    const selfOnly = await request(app)
      .post("/api/v1/messages/conversations")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ participantIds: [student._id.toString()] });
    expect(selfOnly.status).toBe(400);
  });

  it("creates a one-to-one conversation", async () => {
    const response = await request(app)
      .post("/api/v1/messages/conversations")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ participantIds: [counsellor._id.toString()], title: "Application guidance" });

    expect(response.status).toBe(201);
    expect(response.body.data.participants).toEqual(expect.arrayContaining([
      student._id.toString(),
      counsellor._id.toString(),
    ]));
    conversationId = response.body.data.id;
  });

  it("lets participants send messages and notifies the recipient", async () => {
    const response = await request(app)
      .post("/api/v1/messages/send")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ conversationId, content: "  Could you review my application?  " });

    expect(response.status).toBe(201);
    expect(response.body.data.content).toBe("Could you review my application?");
    expect(await NotificationModel.exists({
      userId: counsellor._id.toString(),
      category: "message",
      "metadata.conversationId": conversationId,
    })).toBeTruthy();
  });

  it("prevents non-participants from reading or sending to a conversation", async () => {
    expect((await request(app)
      .get(`/api/v1/messages/conversations/${conversationId}/messages`)
      .set("Authorization", `Bearer ${outsiderToken}`)).status).toBe(403);

    expect((await request(app)
      .post("/api/v1/messages/send")
      .set("Authorization", `Bearer ${outsiderToken}`)
      .send({ conversationId, content: "Unauthorized" })).status).toBe(403);
  });

  it("only marks messages as read inside the reader's conversations", async () => {
    const message = await MessageModel.findOne({ conversationId });
    expect(message).toBeTruthy();

    await request(app)
      .patch("/api/v1/messages/read")
      .set("Authorization", `Bearer ${outsiderToken}`)
      .send({ messageIds: [message!._id.toString()] })
      .expect(200);
    expect((await MessageModel.findById(message!._id))?.status).toBe("sent");

    await request(app)
      .patch("/api/v1/messages/read")
      .set("Authorization", `Bearer ${counsellorToken}`)
      .send({ messageIds: [message!._id.toString()] })
      .expect(200);
    expect((await MessageModel.findById(message!._id))?.status).toBe("read");
  });
});
