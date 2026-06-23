import { UserService } from "../services/user.service";
import { z } from "zod";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO, ChangePasswordDTO } from "../dtos/user.dto";
import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";

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
}
