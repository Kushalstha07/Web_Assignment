import { UserService } from "../services/user.service";
import { z } from "zod";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO, ChangePasswordDTO } from "../dtos/user.dto";
import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const userData = CreateUserDTO.safeParse(req.body);

      if (!userData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(userData.error),
          400,
        );
      }

      const user = await userService.createUser(userData.data);

      return ApiResponseHelper.success(
        res,
        user,
        "User created successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const parsedData = LoginUserDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const { user, token } = await userService.loginUser(parsedData.data);

      return ApiResponseHelper.success(
        res,
        { user, token },
        "Login successful",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async whoami(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return ApiResponseHelper.error(res, "Not authenticated", 401);
      }

      const user = await userService.getUserById(userId);

      return ApiResponseHelper.success(res, user, "User details fetched successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return ApiResponseHelper.error(res, "Not authenticated", 401);
      }

      const parsedData = UpdateUserDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;

      const user = await userService.updateUser(
        userId,
        parsedData.data,
        profileImage,
      );

      return ApiResponseHelper.success(res, user, "Profile updated successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return ApiResponseHelper.error(res, "Not authenticated", 401);
      }

      const parsedData = ChangePasswordDTO.safeParse(req.body);

      if (!parsedData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(parsedData.error),
          400,
        );
      }

      await userService.changePassword(userId, parsedData.data);

      return ApiResponseHelper.success(res, null, "Password changed successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }
}
