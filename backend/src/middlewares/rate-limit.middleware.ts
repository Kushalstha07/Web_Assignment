import type { NextFunction, Request, Response } from "express";
import {
  LOGIN_RATE_LIMIT_MAX,
  LOGIN_RATE_LIMIT_WINDOW_MS,
  PASSWORD_RESET_RATE_LIMIT_MAX,
  PASSWORD_RESET_RATE_LIMIT_WINDOW_MS,
} from "../configs/constant";
import { ApiResponseHelper } from "../uttils/apihelper.util";

type Attempt = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
  key?: (req: Request) => string;
  message?: string;
};

export function createRateLimiter(options: RateLimitOptions) {
  const attempts = new Map<string, Attempt>();
  const keyFor = options.key || ((req: Request) => req.ip || "unknown");

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = keyFor(req);
    const current = attempts.get(key);
    const attempt =
      !current || current.resetAt <= now
        ? { count: 0, resetAt: now + options.windowMs }
        : current;

    attempt.count += 1;
    attempts.set(key, attempt);

    const remaining = Math.max(0, options.maxRequests - attempt.count);
    res.setHeader("RateLimit-Limit", String(options.maxRequests));
    res.setHeader("RateLimit-Remaining", String(remaining));
    res.setHeader("RateLimit-Reset", String(Math.ceil(attempt.resetAt / 1000)));

    if (attempt.count > options.maxRequests) {
      res.setHeader(
        "Retry-After",
        String(Math.max(1, Math.ceil((attempt.resetAt - now) / 1000))),
      );
      return ApiResponseHelper.error(
        res,
        options.message || "Too many login attempts. Please try again later.",
        429,
      );
    }

    next();
  };
}

export const loginRateLimiter = createRateLimiter({
  windowMs: LOGIN_RATE_LIMIT_WINDOW_MS,
  maxRequests: LOGIN_RATE_LIMIT_MAX,
  message: "Too many login attempts. Please try again later.",
});

export const passwordResetRateLimiter = createRateLimiter({
  windowMs: PASSWORD_RESET_RATE_LIMIT_WINDOW_MS,
  maxRequests: PASSWORD_RESET_RATE_LIMIT_MAX,
  message: "Too many password reset requests. Please try again later.",
  key: (req) => `${req.ip || "unknown"}:${String(req.body?.email || "").trim().toLowerCase()}`,
});
