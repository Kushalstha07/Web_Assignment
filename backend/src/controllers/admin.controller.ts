import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AdminCreateUserDTO, AdminUpdateUserDTO } from "../dtos/admin.dto";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { z } from "zod";

const userService = new UserService();

export class AdminController {
  async listUsers(req: Request, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
      const search = (req.query.search as string) || undefined;
      const role = (req.query.role as string) || undefined;

      const result = await userService.getAllUsers(page, limit, search, role);
      return ApiResponseHelper.success(res, result.data, "Users fetched successfully", 200, result.meta);
    } catch (err: any) {
      return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const user = await userService.getUserByIdAdmin(id);
      return ApiResponseHelper.success(res, user, "User fetched successfully");
    } catch (err: any) {
      return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const result = AdminCreateUserDTO.safeParse(req.body);
      if (!result.success) {
        return ApiResponseHelper.error(res, z.prettifyError(result.error), 400);
      }

      const user = await userService.createUserByAdmin(result.data);
      return ApiResponseHelper.success(res, user, "User created successfully", 201);
    } catch (err: any) {
      return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const result = AdminUpdateUserDTO.safeParse(req.body);
      if (!result.success) {
        return ApiResponseHelper.error(res, z.prettifyError(result.error), 400);
      }
      if (id === req.user?.id && result.data.role && result.data.role !== "admin") {
        return ApiResponseHelper.error(res, "You cannot remove your own administrator role", 400);
      }

      const user = await userService.updateUserByAdmin(id, result.data);
      return ApiResponseHelper.success(res, user, "User updated successfully");
    } catch (err: any) {
      return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      if (id === req.user?.id) {
        return ApiResponseHelper.error(res, "You cannot delete your own administrator account", 400);
      }
      await userService.deleteUserByAdmin(id);
      return ApiResponseHelper.success(res, null, "User deleted successfully");
    } catch (err: any) {
      return ApiResponseHelper.error(res, err.message || "Internal Server Error", err.status || 500);
    }
  }
}
