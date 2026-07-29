import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import { SECRET_KEY } from "../configs/constant";
import { UserModel } from "../models/user.model";
import { University } from "../models/university.model";
import { ApplicationModel } from "../models/application.model";

const token = jwt.sign({ id: "analytics-admin", email: "analytics@test.com", role: "admin" }, SECRET_KEY);

beforeEach(async () => {
  await UserModel.create({ fullName: "Analytics Student", username: "analytics-student", email: "analytics-student@test.com", phoneNumber: "9800000099", studyLevel: "undergraduate", destination: "canada", fieldOfStudy: "Computer Science", intake: "fall", budget: "20k-35k", password: "hashed-password", role: "student" });
  const university = await University.create({ name: "Analytics University", country: "canada", city: "Toronto", ranking: "top-100", courseType: "undergraduate", tuitionFee: 25000, budgetRange: "20k-35k", programs: ["Computer Science"], isActive: true });
  await ApplicationModel.create({ studentId: "analytics-student", universityId: university._id.toString(), program: "Computer Science", status: "accepted", stage: "decision-made" });
});

afterEach(async () => {
  await Promise.all([
    UserModel.deleteMany({ email: "analytics-student@test.com" }),
    University.deleteMany({ name: "Analytics University" }),
    ApplicationModel.deleteMany({ studentId: "analytics-student" }),
  ]);
});

describe("Analytics API", () => {
  it("returns totals, regional distribution, growth, top universities, and success rate", async () => {
    const paths = ["totals", "regional", "monthly-growth", "top-universities", "success-rate"];
    const responses = await Promise.all(paths.map((path) => request(app).get(`/api/v1/analytics/${path}`).set("Authorization", `Bearer ${token}`)));
    responses.forEach((response) => expect(response.status).toBe(200));
    expect(responses[0].body.data.totalApplications).toBeGreaterThanOrEqual(1);
    expect(responses[1].body.data.some((item: { country: string }) => item.country === "canada")).toBe(true);
    expect(responses[3].body.data[0].applicationCount).toBeGreaterThanOrEqual(1);
    expect(responses[4].body.data.rate).toBeGreaterThanOrEqual(0);
  });

  it("rejects unauthenticated analytics requests", async () => {
    expect((await request(app).get("/api/v1/analytics/totals")).status).toBe(401);
  });
});
