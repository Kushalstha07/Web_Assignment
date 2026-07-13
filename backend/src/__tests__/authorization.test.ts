import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";
import { SECRET_KEY } from "../configs/constant";

function tokenFor(role: "student" | "counsellor" | "admin"): string {
  return jwt.sign(
    { id: `${role}-authz-user`, email: `${role}@authz.test`, role },
    SECRET_KEY,
  );
}

const studentToken = tokenFor("student");
const counsellorToken = tokenFor("counsellor");
const adminToken = tokenFor("admin");

describe("Privileged route authorization", () => {
  const restrictedCollectionPaths = [
    "/api/v1/applications/all",
    "/api/v1/appointments/all",
    "/api/v1/documents/all",
    "/api/v1/counsellors/paginated",
  ];

  it.each(restrictedCollectionPaths)("rejects students from GET %s", async (path) => {
    const response = await request(app)
      .get(path)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(response.status).toBe(403);
  });

  it.each(restrictedCollectionPaths)("rejects counsellors from GET %s until assignment access is implemented", async (path) => {
    const response = await request(app)
      .get(path)
      .set("Authorization", `Bearer ${counsellorToken}`);

    expect(response.status).toBe(403);
  });

  it.each(restrictedCollectionPaths)("allows admins through authorization for GET %s", async (path) => {
    const response = await request(app)
      .get(path)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
  });

  const adminMutationPaths = [
    "/api/v1/universities",
    "/api/v1/scholarships",
    "/api/v1/counsellors",
  ];

  it.each(adminMutationPaths)("rejects student POST mutations at %s", async (path) => {
    const response = await request(app)
      .post(path)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({});

    expect(response.status).toBe(403);
  });

  it.each(adminMutationPaths)("rejects counsellor POST mutations at %s", async (path) => {
    const response = await request(app)
      .post(path)
      .set("Authorization", `Bearer ${counsellorToken}`)
      .send({});

    expect(response.status).toBe(403);
  });

  it.each(adminMutationPaths)("allows admins through authorization for POST %s", async (path) => {
    const response = await request(app)
      .post(path)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("protects appointment-wide date and counsellor queries", async () => {
    const paths = [
      "/api/v1/appointments/date-range?startDate=2026-01-01&endDate=2026-12-31",
      "/api/v1/appointments/counsellor/507f1f77bcf86cd799439011",
    ];

    for (const path of paths) {
      const denied = await request(app)
        .get(path)
        .set("Authorization", `Bearer ${studentToken}`);
      const allowed = await request(app)
        .get(path)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(denied.status).toBe(403);
      expect(allowed.status).toBe(200);
    }
  });
});
