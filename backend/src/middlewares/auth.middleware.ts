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

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
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

    req.user = jwt.verify(token, SECRET_KEY) as JwtPayload;
    next();
  } catch {
    return ApiResponseHelper.error(res, "Invalid or expired token.", 401);
  }
};
