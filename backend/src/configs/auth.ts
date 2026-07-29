import type { CookieOptions } from "express";
import { NODE_ENV } from "./constant";

export const AUTH_COOKIE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "lax",
  maxAge: AUTH_COOKIE_MAX_AGE_MS,
  path: "/",
};
