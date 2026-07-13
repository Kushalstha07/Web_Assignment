import request from "supertest";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import app from "../app";
import { SECRET_KEY } from "../configs/constant";
import { UserModel } from "../models/user.model";

const baseUser = {
  fullName: "Managed Student",
  username: "managed-student",
  email: "managed-student@test.com",
  phoneNumber: "9800000051",
  studyLevel: "undergraduate" as const,
  destination: "canada" as const,
  fieldOfStudy: "Computer Science",
  intake: "fall" as const,
  budget: "20k-35k" as const,
  password: "password123",
  role: "student" as const,
};

let adminId: string;
let adminToken: string;
let studentToken: string;
let managedId: string;

beforeAll(async () => {
  const [admin, student] = await UserModel.create([
    { ...baseUser, fullName: "System Admin", username: "system-admin", email: "system-admin@test.com", role: "admin", password: await bcryptjs.hash("password123", 10) },
    { ...baseUser, fullName: "Ordinary Student", username: "ordinary-student", email: "ordinary-student@test.com", password: await bcryptjs.hash("password123", 10) },
  ]);
  adminId = admin._id.toString();
  adminToken = jwt.sign({ id: adminId, role: "admin", email: admin.email }, SECRET_KEY);
  studentToken = jwt.sign({ id: student._id.toString(), role: "student", email: student.email }, SECRET_KEY);
});

describe("Admin user management API", () => {
  it("requires an administrator session", async () => {
    expect((await request(app).get("/api/v1/admin/users")).status).toBe(401);
    expect((await request(app).get("/api/v1/admin/users").set("Authorization", `Bearer ${studentToken}`)).status).toBe(403);
  });

  it("creates users safely and never returns password hashes", async () => {
    const response = await request(app)
      .post("/api/v1/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(baseUser);

    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe(baseUser.email);
    expect(response.body.data.password).toBeUndefined();
    managedId = response.body.data.id;
    const stored = await UserModel.findById(managedId);
    expect(stored?.password).not.toBe(baseUser.password);
    expect(await bcryptjs.compare(baseUser.password, stored!.password)).toBe(true);
  });

  it("validates input and enforces email and username uniqueness", async () => {
    expect((await request(app)
      .post("/api/v1/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ email: "invalid" })).status).toBe(400);

    const duplicateEmail = await request(app)
      .post("/api/v1/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...baseUser, username: "different-user" });
    expect(duplicateEmail.status).toBe(400);
    expect(duplicateEmail.body.message).toBe("Email already exists");

    const duplicateUsername = await request(app)
      .post("/api/v1/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...baseUser, email: "different-user@test.com" });
    expect(duplicateUsername.status).toBe(400);
    expect(duplicateUsername.body.message).toBe("Username already exists");
  });

  it("lists, searches, reads, and updates managed users", async () => {
    const list = await request(app)
      .get("/api/v1/admin/users?page=1&limit=2&search=managed")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(list.status).toBe(200);
    expect(list.body.data).toHaveLength(1);
    expect(list.body.meta).toMatchObject({ page: 1, limit: 2, total: 1, totalPages: 1 });

    const detail = await request(app)
      .get(`/api/v1/admin/users/${managedId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(detail.status).toBe(200);

    const update = await request(app)
      .patch(`/api/v1/admin/users/${managedId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ fullName: "Updated Student", password: "newPassword123" });
    expect(update.status).toBe(200);
    expect(update.body.data.fullName).toBe("Updated Student");
    const stored = await UserModel.findById(managedId);
    expect(await bcryptjs.compare("newPassword123", stored!.password)).toBe(true);
  });

  it("prevents administrators from deleting or demoting themselves", async () => {
    expect((await request(app)
      .patch(`/api/v1/admin/users/${adminId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "student" })).status).toBe(400);
    expect((await request(app)
      .delete(`/api/v1/admin/users/${adminId}`)
      .set("Authorization", `Bearer ${adminToken}`)).status).toBe(400);
  });

  it("deletes a managed user and returns 404 afterwards", async () => {
    expect((await request(app)
      .delete(`/api/v1/admin/users/${managedId}`)
      .set("Authorization", `Bearer ${adminToken}`)).status).toBe(200);
    expect((await request(app)
      .get(`/api/v1/admin/users/${managedId}`)
      .set("Authorization", `Bearer ${adminToken}`)).status).toBe(404);
  });
});
