import dotenv from "dotenv";
import path from "path";
import type { SignOptions } from "jsonwebtoken";

dotenv.config({ path: path.resolve(__dirname, "../../.env"), quiet: true });
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

function positiveInteger(name: string, fallback: number): number {
  const value = Number(process.env[name] || fallback);
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return value;
}

export const LOGIN_RATE_LIMIT_WINDOW_MS = positiveInteger(
  "LOGIN_RATE_LIMIT_WINDOW_MS",
  15 * 60 * 1000,
);
export const LOGIN_RATE_LIMIT_MAX = positiveInteger(
  "LOGIN_RATE_LIMIT_MAX",
  NODE_ENV === "test" ? 1000 : 10,
);

export const PASSWORD_RESET_RATE_LIMIT_WINDOW_MS = positiveInteger(
  "PASSWORD_RESET_RATE_LIMIT_WINDOW_MS",
  15 * 60 * 1000,
);
export const PASSWORD_RESET_RATE_LIMIT_MAX = positiveInteger(
  "PASSWORD_RESET_RATE_LIMIT_MAX",
  NODE_ENV === "test" ? 1000 : 5,
);
export const PASSWORD_RESET_TOKEN_TTL_MS = positiveInteger(
  "PASSWORD_RESET_TOKEN_TTL_MS",
  60 * 60 * 1000,
);

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
try {
  new URL(FRONTEND_URL);
} catch {
  throw new Error("FRONTEND_URL must be a valid URL");
}
