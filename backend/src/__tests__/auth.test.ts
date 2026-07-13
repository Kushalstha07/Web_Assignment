import request from "supertest";
import app from "../app";
import { UserModel } from "../models/user.model";

const credentials = {
  email: "auth-session@test.com",
  password: "password123",
};

const registration = {
  fullName: "Auth Session User",
  username: "authsessionuser",
  email: credentials.email,
  phoneNumber: "9800000001",
  studyLevel: "undergraduate",
  destination: "canada",
  fieldOfStudy: "Computer Science",
  intake: "fall",
  budget: "20k-35k",
  password: credentials.password,
};

beforeEach(async () => {
  await UserModel.deleteMany({ email: credentials.email });
});

afterEach(async () => {
  await UserModel.deleteMany({ email: credentials.email });
});

describe("Authentication sessions", () => {
  it("authenticates whoami through an HTTP-only cookie and clears it on logout", async () => {
    const agent = request.agent(app);
    await agent.post("/api/v1/auth/register").send(registration).expect(200);

    const login = await agent.post("/api/v1/auth/login").send(credentials).expect(200);
    const cookies = login.headers["set-cookie"] as unknown as string[];
    expect(cookies?.some((cookie) => cookie.includes("token=") && cookie.includes("HttpOnly"))).toBe(true);

    const whoami = await agent.get("/api/v1/auth/whoami").expect(200);
    expect(whoami.body.data.email).toBe(credentials.email);

    await agent.post("/api/v1/auth/logout").expect(200);
    await agent.get("/api/v1/auth/whoami").expect(401);
  });

  it("uses the same generic response for unknown emails and wrong passwords", async () => {
    await request(app).post("/api/v1/auth/register").send(registration).expect(200);

    const unknown = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "unknown@test.com", password: credentials.password });
    const wrongPassword = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: credentials.email, password: "wrong-password" });

    expect(unknown.status).toBe(401);
    expect(wrongPassword.status).toBe(401);
    expect(unknown.body.message).toBe("Invalid email or password");
    expect(wrongPassword.body.message).toBe(unknown.body.message);
  });

  it("only returns CORS credentials headers for configured origins", async () => {
    const allowed = await request(app).get("/").set("Origin", "http://localhost:3000");
    const denied = await request(app).get("/").set("Origin", "https://untrusted.example");

    expect(allowed.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
    expect(allowed.headers["access-control-allow-credentials"]).toBe("true");
    expect(denied.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
