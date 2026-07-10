import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { CounsellorModel } from "../models/counsellor.model";
import { UserModel } from "../models/user.model";

let adminToken: string;
let counsellorId: string;

beforeAll(async () => {
  const testUri = process.env.MONGODB_URI || "mongodb://localhost:27017/edu-global-test";
  await mongoose.connect(testUri);

  await request(app).post("/api/v1/auth/register").send({
    fullName: "Couns Test Admin",
    username: "counsadmin",
    email: "counsadmin@test.com",
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
    email: "counsadmin@test.com",
    password: "password123",
  });
  adminToken = adminRes.body.data.token;
});

afterAll(async () => {
  await CounsellorModel.deleteMany({});
  await UserModel.deleteMany({ email: "counsadmin@test.com" });
  await mongoose.disconnect();
});

describe("Counsellor API", () => {
  it("should create a counsellor", async () => {
    const res = await request(app)
      .post("/api/v1/counsellors")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        userId: "507f1f77bcf86cd799439011",
        fullName: "Dr. Jane Smith",
        email: "jane@example.com",
        phoneNumber: "1234567890",
        specialties: ["university-admissions", "visa-guidance"],
        yearsOfExperience: 8,
        hourlyRate: 50,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.fullName).toBe("Dr. Jane Smith");
    counsellorId = res.body.data.id;
  });

  it("should get all counsellors", async () => {
    const res = await request(app).get("/api/v1/counsellors");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get counsellor by id", async () => {
    const res = await request(app).get(`/api/v1/counsellors/${counsellorId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.fullName).toBe("Dr. Jane Smith");
  });

  it("should return 400 for missing required fields", async () => {
    const res = await request(app)
      .post("/api/v1/counsellors")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it("should return 401 without auth", async () => {
    const res = await request(app)
      .post("/api/v1/counsellors")
      .send({ fullName: "Test" });
    expect(res.status).toBe(401);
  });
});