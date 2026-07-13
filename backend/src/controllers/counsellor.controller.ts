import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { counsellorService } from "../services/counsellor.service";
import { CreateCounsellorDTO, UpdateCounsellorDTO } from "../dtos/counsellor.dto";
import { HttpException } from "../exceptions/http-exception";

export class CounsellorController {
  async create(req: Request, res: Response) {
    try {
      const parsed = CreateCounsellorDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }
      const counsellor = await counsellorService.create(parsed.data);
      return ApiResponseHelper.success(res, counsellor, "Counsellor created", 201);
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const counsellor = await counsellorService.getById(req.params.id as string);
      return ApiResponseHelper.success(res, counsellor, "Counsellor fetched");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const counsellor = await counsellorService.getByUserId(userId);
      return ApiResponseHelper.success(res, counsellor, "Counsellor fetched");
    } catch (error) {
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status);
      }
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getMyStudents(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const students = await counsellorService.getAssignedStudents(
        userId,
        req.query.search as string | undefined,
      );
      return ApiResponseHelper.success(res, students, "Assigned students fetched");
    } catch (error) {
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status);
      }
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const available = req.query.available === "true" ? true : req.query.available === "false" ? false : undefined;
      const specialty = req.query.specialty as string | undefined;
      const counsellors = await counsellorService.getAll(available, specialty);
      return ApiResponseHelper.success(res, counsellors, "Counsellors fetched");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getAllPaginated(req: Request, res: Response) {
    try {
      const page = parseInt(String(req.query.page || "1"), 10);
      const limit = parseInt(String(req.query.limit || "10"), 10);
      const search = req.query.search as string | undefined;
      const result = await counsellorService.getAllPaginated(page, limit, search);
      return ApiResponseHelper.success(res, result.data, "Counsellors fetched", 200, {
        page, limit, total: result.total, totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const parsed = UpdateCounsellorDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }
      const counsellor = await counsellorService.update(req.params.id as string, parsed.data);
      return ApiResponseHelper.success(res, counsellor, "Counsellor updated");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async updateMe(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const parsed = UpdateCounsellorDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }
      const counsellor = await counsellorService.updateOwn(userId, parsed.data);
      return ApiResponseHelper.success(res, counsellor, "Counsellor updated");
    } catch (error) {
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status);
      }
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await counsellorService.delete(req.params.id as string);
      return ApiResponseHelper.success(res, null, "Counsellor deleted");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }
}
