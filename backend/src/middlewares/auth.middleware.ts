import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";
import { ApiResponseHelper } from "../uttils/apihelper.util";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Try Authorization header first, then fall back to cookie
    let token: string | undefined;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.headers.cookie) {
      // Parse cookie header to find the token
      const cookies = req.headers.cookie.split(";").reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      );
      token = cookies["token"];
    }

    if (!token) {
      return ApiResponseHelper.error(
        res,
        "Authentication required. No token provided.",
        401,
      );
    }

    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return ApiResponseHelper.error(
      res,
      "Invalid or expired token.",
      401,
    );
  }
};