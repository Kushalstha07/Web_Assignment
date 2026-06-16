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
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponseHelper.error(
        res,
        "Authentication required. No token provided.",
        401,
      );
    }

    const token = authHeader.split(" ")[1];

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