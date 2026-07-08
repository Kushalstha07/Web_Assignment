import request from "supertest";
import app from "../app";
import jsonwebtoken from "jsonwebtoken";
import mongoose from "mongoose";

const testUserId = new mongoose.Types.ObjectId().toString();
const secretKey = process.env.SECRET_KEY || "edu-global-jwt-secret-key-2024-v1";
const token = jsonwebtoken.sign({ id: testUserId, role: "admin" }, secretKey, { expiresIn: "1h" });
const studentToken = jsonwebtoken.sign({ id: testUserId, role: "student" }, secretKey, { expiresIn: "1h" });

describe("University API", () => {
  describe("GET /api/v1/universities", () => {
    it("should return empty list or universities", async () => {
      const res = await request(app).get("/api/v1/universities");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should accept filter params", async () => {
      const res = await request(app).get("/api/v1/universities?country=usa");
      expect(res.status).toBe(200);
    });

    it("should paginate correctly", async () => {
      const res = await request(app).get("/api/v1/universities?page=1&limit=5");
      expect(res.status).toBe(200);
      expect(res.body.meta).toBeDefined();
    });
  });

  describe("Auth required for write operations", () => {
    it("POST /api/v1/universities requires auth", async () => {
      const res = await request(app).post("/api/v1/universities").send({ name: "Test" });
      expect(res.status).toBe(401);
    });

    it("POST /api/v1/universities validates input", async () => {
      const res = await request(app)
        .post("/api/v1/universities")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Test" });
      expect(res.status).toBe(400);
    });

    it("PUT /api/v1/universities/:id requires auth", async () => {
      const res = await request(app).put("/api/v1/universities/abc123").send({ name: "Test" });
      expect(res.status).toBe(401);
    });

    it("DELETE /api/v1/universities/:id requires auth", async () => {
      const res = await request(app).delete("/api/v1/universities/abc123");
      expect(res.status).toBe(401);
    });
  });

  describe("Public endpoints", () => {
    it("GET /api/v1/universities/country/:country", async () => {
      const res = await request(app).get("/api/v1/universities/country/usa");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("GET /api/v1/universities/:id handles missing id", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/api/v1/universities/${fakeId}`);
      expect(res.status).toBe(500);
    });
  });
});