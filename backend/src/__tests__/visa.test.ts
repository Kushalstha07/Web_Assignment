import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../app";
import { SECRET_KEY } from "../configs/constant";
import { ApplicationModel } from "../models/application.model";
import { CounsellorModel } from "../models/counsellor.model";
import { NotificationModel } from "../models/notification.model";

const studentId = new mongoose.Types.ObjectId().toString();
const otherStudentId = new mongoose.Types.ObjectId().toString();
const studentToken = jwt.sign({ id: studentId, role: "student", email: "visa-student@test.com" }, SECRET_KEY);
const otherStudentToken = jwt.sign({ id: otherStudentId, role: "student", email: "other-visa@test.com" }, SECRET_KEY);
const adminToken = jwt.sign({ id: "visa-admin", role: "admin", email: "visa-admin@test.com" }, SECRET_KEY);
const counsellorToken = jwt.sign({ id: "visa-counsellor-user", role: "counsellor", email: "visa-counsellor@test.com" }, SECRET_KEY);
const otherCounsellorToken = jwt.sign({ id: "other-visa-counsellor-user", role: "counsellor", email: "other-visa-counsellor@test.com" }, SECRET_KEY);

let applicationId: string;
let visaCaseId: string;
let counsellorId: string;
let otherCounsellorId: string;

beforeAll(async () => {
  const counsellor = await CounsellorModel.create({
    userId: "visa-counsellor-user",
    fullName: "Visa Counsellor",
    email: "visa-counsellor@test.com",
    phoneNumber: "9800000031",
    specialties: ["visa-guidance"],
  });
  const otherCounsellor = await CounsellorModel.create({
    userId: "other-visa-counsellor-user",
    fullName: "Other Visa Counsellor",
    email: "other-visa-counsellor@test.com",
    phoneNumber: "9800000032",
    specialties: ["visa-guidance"],
  });
  counsellorId = counsellor._id.toString();
  otherCounsellorId = otherCounsellor._id.toString();

  const application = await ApplicationModel.create({
    studentId,
    counsellorId,
    universityId: new mongoose.Types.ObjectId().toString(),
    program: "MSc International Business",
    status: "accepted",
    stage: "decision-made",
    documents: [],
  });
  applicationId = application._id.toString();
});

describe("Visa case API", () => {
  it("requires authentication", async () => {
    expect((await request(app).get("/api/v1/visa")).status).toBe(401);
  });

  it("lets a student start one case for an accepted application", async () => {
    const response = await request(app)
      .post("/api/v1/visa")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ applicationId, country: "Canada", visaType: "Study permit" });

    expect(response.status).toBe(201);
    expect(response.body.data.studentId).toBe(studentId);
    expect(response.body.data.counsellorId).toBe(counsellorId);
    expect(response.body.data.status).toBe("documents-preparing");
    visaCaseId = response.body.data.id;
    expect(await NotificationModel.exists({ userId: "visa-counsellor-user", category: "visa" })).toBeTruthy();

    const duplicate = await request(app)
      .post("/api/v1/visa")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ applicationId, country: "Canada", visaType: "Study permit" });
    expect(duplicate.status).toBe(409);
  });

  it("scopes student and counsellor reads", async () => {
    const mine = await request(app).get("/api/v1/visa").set("Authorization", `Bearer ${studentToken}`);
    expect(mine.body.data).toHaveLength(1);

    const otherStudent = await request(app).get("/api/v1/visa").set("Authorization", `Bearer ${otherStudentToken}`);
    expect(otherStudent.body.data).toHaveLength(0);
    expect((await request(app).get(`/api/v1/visa/${visaCaseId}`).set("Authorization", `Bearer ${otherStudentToken}`)).status).toBe(403);

    const assigned = await request(app).get("/api/v1/visa").set("Authorization", `Bearer ${counsellorToken}`);
    expect(assigned.body.data).toHaveLength(1);
    const unassigned = await request(app).get("/api/v1/visa").set("Authorization", `Bearer ${otherCounsellorToken}`);
    expect(unassigned.body.data).toHaveLength(0);
  });

  it("lets assigned staff update progress but blocks students", async () => {
    const update = await request(app)
      .patch(`/api/v1/visa/${visaCaseId}`)
      .set("Authorization", `Bearer ${counsellorToken}`)
      .send({ status: "submitted", referenceNumber: "CAN-2026-001", submissionDate: "2026-07-20" });
    expect(update.status).toBe(200);
    expect(update.body.data.status).toBe("submitted");
    expect(await NotificationModel.exists({ userId: studentId, category: "visa" })).toBeTruthy();

    const studentUpdate = await request(app)
      .patch(`/api/v1/visa/${visaCaseId}`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ status: "approved" });
    expect(studentUpdate.status).toBe(403);
  });

  it("lets an admin reassign and delete cases", async () => {
    const reassign = await request(app)
      .patch(`/api/v1/visa/${visaCaseId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ counsellorId: otherCounsellorId });
    expect(reassign.status).toBe(200);
    expect(reassign.body.data.counsellorId).toBe(otherCounsellorId);

    const assigned = await request(app).get("/api/v1/visa").set("Authorization", `Bearer ${otherCounsellorToken}`);
    expect(assigned.body.data).toHaveLength(1);
    const all = await request(app).get("/api/v1/visa").set("Authorization", `Bearer ${adminToken}`);
    expect(all.body.data).toHaveLength(1);

    expect((await request(app).delete(`/api/v1/visa/${visaCaseId}`).set("Authorization", `Bearer ${adminToken}`)).status).toBe(200);
    expect((await request(app).get("/api/v1/visa").set("Authorization", `Bearer ${adminToken}`)).body.data).toHaveLength(0);
  });
});
