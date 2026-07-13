import express from "express";
import request from "supertest";
import app from "../app";
import { createRateLimiter } from "../middlewares/rate-limit.middleware";

describe("API security middleware", () => {
  it("sets defensive response headers and hides the framework header", async () => {
    const response = await request(app).get("/");

    expect(response.headers["x-powered-by"]).toBeUndefined();
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("DENY");
    expect(response.headers["referrer-policy"]).toBe("no-referrer");
  });

  it("marks authentication responses as non-cacheable", async () => {
    const response = await request(app).get("/api/v1/auth/whoami");
    expect(response.headers["cache-control"]).toBe("no-store");
  });

  it("returns 429 after the configured number of attempts", async () => {
    const limitedApp = express();
    limitedApp.use(
      createRateLimiter({
        windowMs: 60_000,
        maxRequests: 2,
        key: () => "rate-limit-test",
      }),
    );
    limitedApp.post("/login", (_req, res) => res.status(204).end());

    const first = await request(limitedApp).post("/login");
    const second = await request(limitedApp).post("/login");
    const blocked = await request(limitedApp).post("/login");

    expect(first.status).toBe(204);
    expect(second.status).toBe(204);
    expect(blocked.status).toBe(429);
    expect(blocked.headers["retry-after"]).toBeDefined();
    expect(blocked.body.message).toBe(
      "Too many login attempts. Please try again later.",
    );
  });
});
