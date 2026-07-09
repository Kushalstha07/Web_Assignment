import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { ApplicationModel } from "../models/application.model";
import { UserModel } from "../models/user.model";

let studentToken: string;
let adminToken: string;
let applicationId: string;

beforeAll(async () => {
  // Connect to test DB
  const testUri = process.env.MONGODB_URI || "mongodb://localhost:27017/edu-global-test";
  await mongoose.connect(testUri);

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

  // Register + login admin
  await request(app).post("/api/v1/auth/register").send({
    fullName: "Test Admin",
    username: "testadmin",
    email: "admin@test.com",
    phoneNumber: "1234567890",
    studyLevel: "postgraduate",
    destination: "usa",
    fieldOfStudy: "Admin",
    intake: "fall",
    budget: "20k-35k",
    password: "password123",
    role: "admin",
  });

  const adminRes = await request(app).post("/api/v1/auth/login").send({
    email: "admin@test.com",
    password: "password123",
  });
  adminToken = adminRes.body.data.token;
});

afterAll(async () => {
  await ApplicationModel.deleteMany({});
  await UserModel.deleteMany({ email: { $in: ["student@test.com", "admin@test.com"] } });
  await mongoose.disconnect();
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

  // Submit application
  it("should submit a draft application", async () => {
    const res = await request(app)
      .post(`/api/v1/applications/${applicationId}/submit`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ submittedDate: new Date().toISOString() });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("submitted");
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