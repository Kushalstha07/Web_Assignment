import { UserService } from "../services/user.service";
import { z } from "zod";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO, ChangePasswordDTO, ForgotPasswordDTO, ResetPasswordDTO } from "../dtos/user.dto";
import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { AUTH_COOKIE_OPTIONS } from "../configs/auth";

declare global {
  namespace Express {
    interface Request {
      file?: any;
    }
  }
}

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const result = CreateUserDTO.safeParse(req.body);
      if (!result.success) {
        return ApiResponseHelper.error(res, z.prettifyError(result.error), 400);
      }

      const user = await userService.createUser(result.data);
      return ApiResponseHelper.success(res, user, "User created successfully");
    } catch (err: any) {
      return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const result = LoginUserDTO.safeParse(req.body);
      if (!result.success) {
        return ApiResponseHelper.error(res, z.prettifyError(result.error), 400);
      }

      const { user, token } = await userService.loginUser(result.data);
      res.cookie("token", token, AUTH_COOKIE_OPTIONS);
      return ApiResponseHelper.success(res, { user, token }, "Login successful");
    } catch (err: any) {
      return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
    }
  }

  async whoami(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Not authenticated", 401);

      const user = await userService.getUserById(userId);
      return ApiResponseHelper.success(res, user, "User details fetched successfully");
    } catch (err: any) {
      return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Not authenticated", 401);

      const result = UpdateUserDTO.safeParse(req.body);
      if (!result.success) {
        return ApiResponseHelper.error(res, z.prettifyError(result.error), 400);
      }

      const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;
      const user = await userService.updateUser(userId, result.data, profileImage);
      return ApiResponseHelper.success(res, user, "Profile updated successfully");
    } catch (err: any) {
      return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Not authenticated", 401);

      const result = ChangePasswordDTO.safeParse(req.body);
      if (!result.success) {
        return ApiResponseHelper.error(res, z.prettifyError(result.error), 400);
      }

      await userService.changePassword(userId, result.data);
      return ApiResponseHelper.success(res, null, "Password changed successfully");
    } catch (err: any) {
      return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
    }
  }

  async forgotPassword(req: Request, res: Response) {
    const result = ForgotPasswordDTO.safeParse(req.body);
    if (!result.success) {
      return ApiResponseHelper.error(res, z.prettifyError(result.error), 400);
    }

    try {
      await userService.requestPasswordReset(result.data);
    } catch (error) {
      console.error("Password reset email could not be sent", error);
    }

    return ApiResponseHelper.success(
      res,
      null,
      "If an account exists for that email, a password reset link has been sent.",
    );
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const result = ResetPasswordDTO.safeParse(req.body);
      if (!result.success) {
        return ApiResponseHelper.error(res, z.prettifyError(result.error), 400);
      }
      await userService.resetPassword(result.data);
      res.clearCookie("token", { ...AUTH_COOKIE_OPTIONS, maxAge: undefined });
      return ApiResponseHelper.success(res, null, "Password reset successfully");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Internal Server Error";
      const status = typeof error === "object" && error && "status" in error
        ? Number((error as { status: unknown }).status) || 500
        : 500;
      return ApiResponseHelper.error(res, message, status);
    }
  }
}
