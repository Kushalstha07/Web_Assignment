import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import { SECRET_KEY } from "../configs/constant";

let adminToken: string;
let counsellorId: string;

beforeAll(async () => {
  adminToken = jwt.sign(
    { id: "counsellor-admin", email: "counsadmin@test.com", role: "admin" },
    SECRET_KEY,
  );
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
