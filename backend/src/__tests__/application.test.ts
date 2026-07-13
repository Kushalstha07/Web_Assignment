import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import { SECRET_KEY } from "../configs/constant";
import { CounsellorModel } from "../models/counsellor.model";
import { NotificationModel } from "../models/notification.model";

let studentToken: string;
let adminToken: string;
let counsellorToken: string;
let counsellorId: string;
let applicationId: string;
let studentId: string;

beforeAll(async () => {
  // Register a student
  await request(app).post("/api/v1/auth/register").send({
    fullName: "Test Student",
    username: "teststudent",
    email: "student@test.com",
    phoneNumber: "1234567890",
    studyLevel: "undergraduate",
    destination: "usa",
    fieldOfStudy: "Computer Science",
    intake: "fall",
    budget: "10k-20k",
    password: "password123",
  });

  // Login as student
  const studentRes = await request(app).post("/api/v1/auth/login").send({
    email: "student@test.com",
    password: "password123",
  });
  studentToken = studentRes.body.data.token;
  studentId = (jwt.decode(studentToken) as { id: string }).id;

  adminToken = jwt.sign(
    { id: "application-admin", email: "admin@test.com", role: "admin" },
    SECRET_KEY,
  );
  const counsellor = await CounsellorModel.create({
    userId: "application-counsellor-user",
    fullName: "Application Counsellor",
    email: "application-counsellor@test.com",
    phoneNumber: "9800000011",
    specialties: ["university-admissions"],
  });
  counsellorId = counsellor._id.toString();
  counsellorToken = jwt.sign(
    {
      id: "application-counsellor-user",
      email: "application-counsellor@test.com",
      role: "counsellor",
    },
    SECRET_KEY,
  );
});

describe("Application API", () => {
  // Happy path: create application
  it("should create a new application", async () => {
    const res = await request(app)
      .post("/api/v1/applications")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        universityId: "507f1f77bcf86cd799439011",
        program: "MSc Computer Science",
        notes: "Test application",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.program).toBe("MSc Computer Science");
    expect(res.body.data.status).toBe("draft");
    applicationId = res.body.data.id;
  });

  // Validation error
  it("should return 400 for missing required fields", async () => {
    const res = await request(app)
      .post("/api/v1/applications")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // Auth required
  it("should return 401 without auth token", async () => {
    const res = await request(app)
      .post("/api/v1/applications")
      .send({
        universityId: "507f1f77bcf86cd799439011",
        program: "MSc CS",
      });

    expect(res.status).toBe(401);
  });

  // Get my applications
  it("should get my applications", async () => {
    const res = await request(app)
      .get("/api/v1/applications")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should let an admin assign a counsellor", async () => {
    const res = await request(app)
      .patch(`/api/v1/applications/${applicationId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ counsellorId });

    expect(res.status).toBe(200);
    expect(res.body.data.counsellorId).toBe(counsellorId);
    expect(await NotificationModel.exists({ userId: "application-counsellor-user", category: "application" })).toBeTruthy();
    expect(await NotificationModel.exists({ userId: studentId, title: "Counsellor assigned" })).toBeTruthy();
  });

  it("should return only assigned applications to a counsellor", async () => {
    const res = await request(app)
      .get("/api/v1/applications/assigned")
      .set("Authorization", `Bearer ${counsellorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe(applicationId);
    expect(res.body.data[0].studentName).toBe("Test Student");
  });

  it("should return only assigned student records to a counsellor", async () => {
    const res = await request(app)
      .get("/api/v1/counsellors/me/students")
      .set("Authorization", `Bearer ${counsellorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].fullName).toBe("Test Student");
    expect(res.body.data[0].password).toBeUndefined();
  });

  it("should let an assigned counsellor update workflow stage", async () => {
    const res = await request(app)
      .patch(`/api/v1/applications/${applicationId}`)
      .set("Authorization", `Bearer ${counsellorToken}`)
      .send({ stage: "verified" });

    expect(res.status).toBe(200);
    expect(res.body.data.stage).toBe("verified");
    expect(await NotificationModel.exists({ userId: studentId, title: "Application updated" })).toBeTruthy();
  });

  // Submit application
  it("should submit a draft application", async () => {
    const res = await request(app)
      .post(`/api/v1/applications/${applicationId}/submit`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ submittedDate: new Date().toISOString() });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("submitted");
    expect(await NotificationModel.exists({ userId: studentId, title: "Application submitted" })).toBeTruthy();
  });

  it("should reject student workflow status changes", async () => {
    const res = await request(app)
      .patch(`/api/v1/applications/${applicationId}`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ status: "accepted", stage: "decision-made" });

    expect(res.status).toBe(400);
  });

  // Update application
  it("should update an application", async () => {
    const res = await request(app)
      .patch(`/api/v1/applications/${applicationId}`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ notes: "Updated notes" });

    expect(res.status).toBe(200);
    expect(res.body.data.notes).toBe("Updated notes");
  });

  // Delete application
  it("should delete an application", async () => {
    const res = await request(app)
      .delete(`/api/v1/applications/${applicationId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
