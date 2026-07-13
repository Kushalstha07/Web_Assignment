import request from "supertest";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import app from "../app";
import { SECRET_KEY } from "../configs/constant";
import { DOCUMENT_UPLOAD_DIRECTORY } from "../configs/storage";

let studentToken: string;
let adminToken: string;
let otherStudentToken: string;
let documentId: string;
let documentFileName: string;

beforeAll(async () => {
  // Register student
  await request(app).post("/api/v1/auth/register").send({
    fullName: "Doc Student",
    username: "docstudent",
    email: "docstudent@test.com",
    phoneNumber: "1234567890",
    studyLevel: "undergraduate",
    destination: "usa",
    fieldOfStudy: "CS",
    intake: "fall",
    budget: "10k-20k",
    password: "password123",
  });

  const studentRes = await request(app).post("/api/v1/auth/login").send({
    email: "docstudent@test.com",
    password: "password123",
  });
  studentToken = studentRes.body.data.token;

  adminToken = jwt.sign(
    { id: "document-admin", email: "docadmin@test.com", role: "admin" },
    SECRET_KEY,
  );
  otherStudentToken = jwt.sign(
    { id: "other-document-student", email: "other-doc@test.com", role: "student" },
    SECRET_KEY,
  );
});

describe("Document API", () => {
  // Create a temp file for upload
  const tempFilePath = path.join(__dirname, "temp-test-file.txt");
  beforeAll(() => {
    fs.writeFileSync(tempFilePath, "Test document content");
  });

  afterAll(() => {
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
  });

  // Happy path: upload document
  it("should upload a document", async () => {
    const res = await request(app)
      .post("/api/v1/documents/upload")
      .set("Authorization", `Bearer ${studentToken}`)
      .field("category", "transcript")
      .field("notes", "Test upload")
      .attach("document", tempFilePath);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.category).toBe("transcript");
    expect(res.body.data.status).toBe("pending");
    documentId = res.body.data.id;
    documentFileName = res.body.data.fileName;
    expect(res.body.data.url).toBe(`/api/v1/documents/${documentId}/download`);
    expect(fs.existsSync(path.join(DOCUMENT_UPLOAD_DIRECTORY, documentFileName))).toBe(true);
  });

  // Validation error
  it("should return 400 for missing category", async () => {
    const res = await request(app)
      .post("/api/v1/documents/upload")
      .set("Authorization", `Bearer ${studentToken}`)
      .attach("document", tempFilePath);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // Auth required
  it("should return 401 without auth", async () => {
    const res = await request(app)
      .post("/api/v1/documents/upload")
      .attach("document", tempFilePath);

    expect(res.status).toBe(401);
  });

  // Get my documents
  it("should get my documents", async () => {
    const res = await request(app)
      .get("/api/v1/documents")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should not allow a student to verify a document", async () => {
    const res = await request(app)
      .patch(`/api/v1/documents/${documentId}/verify`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ status: "verified" });

    expect(res.status).toBe(403);
  });

  it("should download a document for its owner", async () => {
    const res = await request(app)
      .get(`/api/v1/documents/${documentId}/download`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.headers["content-disposition"]).toContain("attachment");
    expect(res.text).toBe("Test document content");
  });

  it("should reject unauthenticated document downloads", async () => {
    const res = await request(app).get(`/api/v1/documents/${documentId}/download`);
    expect(res.status).toBe(401);
  });

  it("should reject document downloads by another student", async () => {
    const res = await request(app)
      .get(`/api/v1/documents/${documentId}/download`)
      .set("Authorization", `Bearer ${otherStudentToken}`);

    expect(res.status).toBe(403);
  });

  it("should allow an admin to download a document", async () => {
    const res = await request(app)
      .get(`/api/v1/documents/${documentId}/download`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.text).toBe("Test document content");
  });

  // Verify document
  it("should verify a document as admin", async () => {
    const res = await request(app)
      .patch(`/api/v1/documents/${documentId}/verify`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "verified", notes: "Looks good" });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("verified");
  });

  // Delete document
  it("should delete a document", async () => {
    const res = await request(app)
      .delete(`/api/v1/documents/${documentId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(fs.existsSync(path.join(DOCUMENT_UPLOAD_DIRECTORY, documentFileName))).toBe(false);
  });
});
