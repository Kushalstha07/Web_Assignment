import request from "supertest";
import app from "../app";

let studentToken: string;
let appointmentId: string;

beforeAll(async () => {
  await request(app).post("/api/v1/auth/register").send({
    fullName: "Appt Student",
    username: "apptstudent",
    email: "apptstudent@test.com",
    phoneNumber: "1234567890",
    studyLevel: "undergraduate",
    destination: "usa",
    fieldOfStudy: "CS",
    intake: "fall",
    budget: "10k-20k",
    password: "password123",
  });

  const studentRes = await request(app).post("/api/v1/auth/login").send({
    email: "apptstudent@test.com",
    password: "password123",
  });
  studentToken = studentRes.body.data.token;
});

describe("Appointment API", () => {
  it("should create an appointment", async () => {
    const res = await request(app)
      .post("/api/v1/appointments")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        counsellorId: "507f1f77bcf86cd799439011",
        date: "2026-07-15",
        startTime: "10:00",
        endTime: "11:00",
        notes: "Need help with applications",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("scheduled");
    appointmentId = res.body.data.id;
  });

  it("should get my appointments", async () => {
    const res = await request(app)
      .get("/api/v1/appointments")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return 400 for missing required fields", async () => {
    const res = await request(app)
      .post("/api/v1/appointments")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it("should return 401 without auth", async () => {
    const res = await request(app)
      .post("/api/v1/appointments")
      .send({ counsellorId: "test", date: "2026-07-15", startTime: "10:00", endTime: "11:00" });
    expect(res.status).toBe(401);
  });

  it("should cancel an appointment", async () => {
    const res = await request(app)
      .post(`/api/v1/appointments/${appointmentId}/cancel`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ cancellationReason: "Schedule conflict" });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("cancelled");
  });
});
