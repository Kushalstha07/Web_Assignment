import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { UserModel } from "../models/user.model";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  sessionVersion?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(";");
      for (const cookie of cookies) {
        const [key, value] = cookie.trim().split("=");
        if (key === "token") {
          token = value;
          break;
        }
      }
    }

    if (!token) {
      return ApiResponseHelper.error(res, "Authentication required. No token provided.", 401);
    }

    const payload = jwt.verify(token, SECRET_KEY) as JwtPayload;
    if (payload.sessionVersion !== undefined) {
      const user = await UserModel.findById(payload.id).select("+sessionVersion").lean();
      if (!user || (user.sessionVersion || 0) !== payload.sessionVersion) {
        return ApiResponseHelper.error(res, "Invalid or expired token.", 401);
      }
    }
    req.user = payload;
    next();
  } catch {
    return ApiResponseHelper.error(res, "Invalid or expired token.", 401);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ApiResponseHelper.error(res, "Authentication required.", 401);
    }
    if (!roles.includes(req.user.role)) {
      return ApiResponseHelper.error(res, "Forbidden: insufficient permissions.", 403);
    }
    next();
  };
};
