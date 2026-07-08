import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";

const testUserId = new mongoose.Types.ObjectId().toString();
const secretKey = process.env.SECRET_KEY || "edu-global-jwt-secret-key-2024-v1";
const token = jsonwebtoken.sign({ id: testUserId, role: "student" }, secretKey, { expiresIn: "1h" });

describe("Academic Profile API", () => {
  describe("GET /api/v1/academic-profile", () => {
    it("should return 401 without auth token", async () => {
      const res = await request(app).get("/api/v1/academic-profile");
      expect(res.status).toBe(401);
    });

    it("should return 404 when no profile exists", async () => {
      const res = await request(app)
        .get("/api/v1/academic-profile")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
    });

    it("should return profile successfully after creation", async () => {
      const createRes = await request(app)
        .post("/api/v1/academic-profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          highestQualification: "bachelor",
          institution: "Test University",
          graduationYear: 2024,
          fieldOfStudy: "Computer Science",
        });
      expect(createRes.status).toBe(201);

      const res = await request(app)
        .get("/api/v1/academic-profile")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.institution).toBe("Test University");
    });
  });

  describe("POST /api/v1/academic-profile", () => {
    it("should require authentication", async () => {
      const res = await request(app)
        .post("/api/v1/academic-profile")
        .send({ institution: "Test" });
      expect(res.status).toBe(401);
    });

    it("should reject invalid data", async () => {
      const res = await request(app)
        .post("/api/v1/academic-profile")
        .set("Authorization", `Bearer ${token}`)
        .send({ institution: "" });
      expect(res.status).toBe(500);
    });
  });

  describe("Auth required on all endpoints", () => {
    it("POST /step-1 requires auth", async () => {
      const res = await request(app)
        .put("/api/v1/academic-profile/step-1");
      expect(res.status).toBe(401);
    });

    it("PUT / requires auth", async () => {
      const res = await request(app)
        .put("/api/v1/academic-profile");
      expect(res.status).toBe(401);
    });
  });
});