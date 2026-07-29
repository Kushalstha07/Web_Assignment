import request from "supertest";
import app from "../app";
import jsonwebtoken from "jsonwebtoken";
import mongoose from "mongoose";
import { SECRET_KEY } from "../configs/constant";
import { AcademicProfileModel } from "../models/academic-profile.model";
import { University } from "../models/university.model";

const testUserId = new mongoose.Types.ObjectId().toString();
const secretKey = process.env.SECRET_KEY || "edu-global-jwt-secret-key-2024-v1";
const token = jsonwebtoken.sign({ id: testUserId, role: "admin" }, secretKey, { expiresIn: "1h" });
const studentId = new mongoose.Types.ObjectId().toString();
const studentToken = jsonwebtoken.sign({ id: studentId, role: "student" }, SECRET_KEY, { expiresIn: "1h" });

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

    it("GET /api/v1/universities/:id returns 404 for missing id", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/api/v1/universities/${fakeId}`);
      expect(res.status).toBe(404);
    });
  });

  describe("Profile recommendations", () => {
    beforeAll(async () => {
      await AcademicProfileModel.create({
        userId: studentId,
        highestQualification: "bachelor",
        institution: "Recommendation College",
        graduationYear: 2025,
        gpa: 3.6,
        fieldOfStudy: "Computer Science",
        preferredCountries: ["canada"],
        tuitionBudget: "20k-35k",
      });
      await University.create([
        {
          name: "Recommendation Best Match",
          country: "canada",
          city: "Toronto",
          ranking: "top-50",
          worldRanking: 30,
          courseType: "postgraduate",
          tuitionFee: 25000,
          budgetRange: "20k-35k",
          programs: ["Computer Science"],
        },
        {
          name: "Recommendation Alternative",
          country: "uk",
          city: "London",
          ranking: "top-10",
          worldRanking: 8,
          courseType: "undergraduate",
          tuitionFee: 45000,
          budgetRange: "35k-plus",
          programs: ["Fine Arts"],
        },
      ]);
    });

    it("requires a student session and saved profile", async () => {
      expect((await request(app).get("/api/v1/universities/recommendations")).status).toBe(401);
      expect((await request(app).get("/api/v1/universities/recommendations").set("Authorization", `Bearer ${token}`)).status).toBe(403);
      const noProfileToken = jsonwebtoken.sign({ id: new mongoose.Types.ObjectId().toString(), role: "student" }, SECRET_KEY);
      expect((await request(app).get("/api/v1/universities/recommendations").set("Authorization", `Bearer ${noProfileToken}`)).status).toBe(404);
    });

    it("returns ranked, explainable matches from the saved profile", async () => {
      const response = await request(app)
        .get("/api/v1/universities/recommendations?limit=2")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].name).toBe("Recommendation Best Match");
      expect(response.body.data[0].score).toBe(100);
      expect(response.body.data[0].reasons).toEqual(expect.arrayContaining([
        "Preferred destination",
        "Within your tuition budget",
        "Offers your study field",
      ]));
      expect(response.body.data[1].score).toBeLessThan(response.body.data[0].score);
    });
  });
});
