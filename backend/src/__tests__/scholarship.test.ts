import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import { SECRET_KEY } from "../configs/constant";

let adminToken: string;
let studentToken: string;
let scholarshipId: string;
let scholarshipApplicationId: string;

beforeAll(async () => {
  adminToken = jwt.sign(
    { id: "scholarship-admin", email: "scholadmin@test.com", role: "admin" },
    SECRET_KEY,
  );
  studentToken = jwt.sign(
    { id: "scholarship-student", email: "scholstudent@test.com", role: "student" },
    SECRET_KEY,
  );
});

describe("Scholarship API", () => {
  it("should create a scholarship", async () => {
    const res = await request(app)
      .post("/api/v1/scholarships")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Global Excellence Scholarship",
        provider: "World Education Fund",
        type: "merit-based",
        amount: 25000,
        countries: ["USA", "Canada"],
        deadline: "2026-12-31",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Global Excellence Scholarship");
    scholarshipId = res.body.data.id;
  });

  it("should get all scholarships", async () => {
    const res = await request(app).get("/api/v1/scholarships");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should filter scholarships by type", async () => {
    const res = await request(app).get("/api/v1/scholarships?type=merit-based");
    expect(res.status).toBe(200);
    expect(res.body.data.every((s: any) => s.type === "merit-based")).toBe(true);
  });

  it("should get scholarship by id", async () => {
    const res = await request(app).get(`/api/v1/scholarships/${scholarshipId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Global Excellence Scholarship");
  });

  it("should return 400 for missing required fields", async () => {
    const res = await request(app)
      .post("/api/v1/scholarships")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it("should return 401 without auth", async () => {
    const res = await request(app)
      .post("/api/v1/scholarships")
      .send({ name: "Test", provider: "Test", type: "merit-based", amount: 1000 });
    expect(res.status).toBe(401);
  });

  it("should let a student apply inside the system", async () => {
    const res = await request(app)
      .post(`/api/v1/scholarships/${scholarshipId}/apply`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        statement: "I am a strong candidate because of my academic record and leadership experience.",
        academicSummary: "GPA 3.8 with strong test scores.",
        financialNeed: "I need funding support for tuition.",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.scholarshipId).toBe(scholarshipId);
    expect(res.body.data.status).toBe("submitted");
    scholarshipApplicationId = res.body.data.id;
  });

  it("should prevent duplicate scholarship applications", async () => {
    const res = await request(app)
      .post(`/api/v1/scholarships/${scholarshipId}/apply`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ statement: "Trying to apply again should not be allowed." });

    expect(res.status).toBe(409);
  });

  it("should let admin review scholarship applications", async () => {
    const res = await request(app)
      .patch(`/api/v1/scholarships/applications/${scholarshipApplicationId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "approved", notes: "Strong fit." });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("approved");
    expect(res.body.data.notes).toBe("Strong fit.");
  });
});
