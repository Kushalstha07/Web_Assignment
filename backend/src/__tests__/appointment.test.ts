import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import { SECRET_KEY } from "../configs/constant";
import { CounsellorModel } from "../models/counsellor.model";

let studentToken: string;
let counsellorToken: string;
let counsellorId: string;
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

  const counsellor = await CounsellorModel.create({
    userId: "appt-counsellor-user",
    fullName: "Appointment Counsellor",
    email: "appt-counsellor@test.com",
    phoneNumber: "9800000010",
    specialties: ["university-admissions"],
  });
  counsellorId = counsellor._id.toString();
  counsellorToken = jwt.sign(
    { id: "appt-counsellor-user", email: "appt-counsellor@test.com", role: "counsellor" },
    SECRET_KEY,
  );
});

describe("Appointment API", () => {
  it("should create an appointment", async () => {
    const res = await request(app)
      .post("/api/v1/appointments")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        counsellorId,
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

  it("should reject an appointment for an unknown counsellor", async () => {
    const res = await request(app)
      .post("/api/v1/appointments")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        counsellorId: "507f1f77bcf86cd799439099",
        date: "2026-07-16",
        startTime: "10:00",
        endTime: "11:00",
      });

    expect(res.status).toBe(404);
  });

  it("should return 401 without auth", async () => {
    const res = await request(app)
      .post("/api/v1/appointments")
      .send({ counsellorId: "test", date: "2026-07-15", startTime: "10:00", endTime: "11:00" });
    expect(res.status).toBe(401);
  });

  it("should return assigned appointments to the counsellor", async () => {
    const list = await request(app)
      .get("/api/v1/appointments")
      .set("Authorization", `Bearer ${counsellorToken}`);
    expect(list.status).toBe(200);
    expect(list.body.data.some((item: { id: string }) => item.id === appointmentId)).toBe(true);

    const detail = await request(app)
      .get(`/api/v1/appointments/${appointmentId}`)
      .set("Authorization", `Bearer ${counsellorToken}`);
    expect(detail.status).toBe(200);
  });

  it("should let the assigned counsellor update an appointment", async () => {
    const res = await request(app)
      .patch(`/api/v1/appointments/${appointmentId}`)
      .set("Authorization", `Bearer ${counsellorToken}`)
      .send({ notes: "Counsellor confirmed the preparation notes" });

    expect(res.status).toBe(200);
    expect(res.body.data.notes).toBe("Counsellor confirmed the preparation notes");
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
