import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import { SECRET_KEY } from "../configs/constant";

let adminToken: string;
let scholarshipId: string;

beforeAll(async () => {
  adminToken = jwt.sign(
    { id: "scholarship-admin", email: "scholadmin@test.com", role: "admin" },
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
});
