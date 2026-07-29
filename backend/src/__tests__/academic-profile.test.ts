import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";

const testUserId = new mongoose.Types.ObjectId().toString();
const secretKey = process.env.SECRET_KEY || "edu-global-jwt-secret-key-2024-v1";
const token = jsonwebtoken.sign({ id: testUserId, role: "student" }, secretKey, { expiresIn: "1h" });
const onboardingUserId = new mongoose.Types.ObjectId().toString();
const onboardingToken = jsonwebtoken.sign({ id: onboardingUserId, role: "student" }, secretKey, { expiresIn: "1h" });

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
      expect(res.status).toBe(400);
    });
  });

  describe("Persisted onboarding progression", () => {
    it("validates step data before writing", async () => {
      const res = await request(app)
        .put("/api/v1/academic-profile/step-1")
        .set("Authorization", `Bearer ${onboardingToken}`)
        .send({ highestQualification: "invalid", institution: "", graduationYear: 1900 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("persists each step and blocks premature completion", async () => {
      const step1 = await request(app)
        .put("/api/v1/academic-profile/step-1")
        .set("Authorization", `Bearer ${onboardingToken}`)
        .send({
          highestQualification: "bachelor",
          institution: "Progress University",
          graduationYear: 2025,
          fieldOfStudy: "Software Engineering",
        });

      expect(step1.status).toBe(200);
      expect(step1.body.data.onboardingStep).toBe(2);

      const premature = await request(app)
        .post("/api/v1/academic-profile/complete")
        .set("Authorization", `Bearer ${onboardingToken}`);
      expect(premature.status).toBe(400);

      const invalidScore = await request(app)
        .put("/api/v1/academic-profile/step-2")
        .set("Authorization", `Bearer ${onboardingToken}`)
        .send({ testType: "IELTS", testScore: 10 });
      expect(invalidScore.status).toBe(400);

      const step2 = await request(app)
        .put("/api/v1/academic-profile/step-2")
        .set("Authorization", `Bearer ${onboardingToken}`)
        .send({ gpa: 3.7, testType: "GRE", testScore: 320 });
      expect(step2.status).toBe(200);
      expect(step2.body.data.onboardingStep).toBe(3);

      const invalidPreferences = await request(app)
        .put("/api/v1/academic-profile/step-3")
        .set("Authorization", `Bearer ${onboardingToken}`)
        .send({ preferredCountries: [], tuitionBudget: "unknown" });
      expect(invalidPreferences.status).toBe(400);

      const step3 = await request(app)
        .put("/api/v1/academic-profile/step-3")
        .set("Authorization", `Bearer ${onboardingToken}`)
        .send({ preferredCountries: ["canada", "uk"], tuitionBudget: "20k-35k" });
      expect(step3.status).toBe(200);
      expect(step3.body.data.onboardingStep).toBe(4);

      const complete = await request(app)
        .post("/api/v1/academic-profile/complete")
        .set("Authorization", `Bearer ${onboardingToken}`);
      expect(complete.status).toBe(200);
      expect(complete.body.data.onboardingStep).toBe(5);
      expect(complete.body.data.onboardingCompletedAt).toEqual(expect.any(String));

      const persisted = await request(app)
        .get("/api/v1/academic-profile")
        .set("Authorization", `Bearer ${onboardingToken}`);
      expect(persisted.body.data.institution).toBe("Progress University");
      expect(persisted.body.data.preferredCountries).toEqual(["canada", "uk"]);
      expect(persisted.body.data.profileStrength).toBeGreaterThan(0);
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
