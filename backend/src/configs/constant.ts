import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

dotenv.config({ quiet: true });

export const NODE_ENV = process.env.NODE_ENV || "development";

const parsedPort = Number(process.env.PORT || 4000);
if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}
export const PORT = parsedPort;

export const MONGODB_URL: string =
  process.env.MONGODB_URL || "mongodb://localhost:27017/consultancy-db";

const configuredSecret =
  process.env.SECRET_KEY ||
  (NODE_ENV === "test" ? "edu-global-test-secret-key-do-not-deploy" : "");

if (!configuredSecret) {
  throw new Error("SECRET_KEY is required");
}
if (NODE_ENV === "production" && configuredSecret.length < 32) {
  throw new Error("SECRET_KEY must be at least 32 characters in production");
}
export const SECRET_KEY = configuredSecret;

export const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ||
  "30d") as SignOptions["expiresIn"];

export const CORS_ORIGINS = (process.env.CORS_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
