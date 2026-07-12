import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import { SECRET_KEY } from "../configs/constant";
import { NotificationModel } from "../models/notification.model";

const userId = "notification-test-user";
const token = jwt.sign({ id: userId, email: "notifications@test.com", role: "student" }, SECRET_KEY);

afterEach(async () => {
  await NotificationModel.deleteMany({ userId });
});

describe("Notification API", () => {
  it("lists only the authenticated user's notifications with pagination", async () => {
    await NotificationModel.create([
      { userId, title: "Application update", message: "Your application was reviewed", category: "application" },
      { userId: "someone-else", title: "Private", message: "Not visible" },
    ]);

    const response = await request(app).get("/api/v1/notifications?page=1&limit=10").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta.total).toBe(1);
  });

  it("returns unread count and supports read, read-all, and delete actions", async () => {
    const notifications = await NotificationModel.create([
      { userId, title: "One", message: "First" },
      { userId, title: "Two", message: "Second" },
    ]);

    const unread = await request(app).get("/api/v1/notifications/unread-count").set("Authorization", `Bearer ${token}`);
    expect(unread.body.data.count).toBe(2);

    const markOne = await request(app).patch("/api/v1/notifications/read").set("Authorization", `Bearer ${token}`).send({ notificationIds: [notifications[0]._id.toString()] });
    expect(markOne.status).toBe(200);

    const markAll = await request(app).patch("/api/v1/notifications/read-all").set("Authorization", `Bearer ${token}`);
    expect(markAll.status).toBe(200);

    const remove = await request(app).delete(`/api/v1/notifications/${notifications[1]._id}`).set("Authorization", `Bearer ${token}`);
    expect(remove.status).toBe(200);
    expect(await NotificationModel.countDocuments({ userId })).toBe(1);
  });

  it("rejects requests without authentication", async () => {
    expect((await request(app).get("/api/v1/notifications")).status).toBe(401);
  });
});
