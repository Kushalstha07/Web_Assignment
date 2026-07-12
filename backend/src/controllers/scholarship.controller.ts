import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { scholarshipService } from "../services/scholarship.service";
import { CreateScholarshipDTO, UpdateScholarshipDTO, ScholarshipFilterDTO } from "../dtos/scholarship.dto";
import { HttpException } from "../exceptions/http-exception";

export class ScholarshipController {
  async create(req: Request, res: Response) {
    try {
      const parsed = CreateScholarshipDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }
      const scholarship = await scholarshipService.create(parsed.data);
      return ApiResponseHelper.success(res, scholarship, "Scholarship created", 201);
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const scholarship = await scholarshipService.getById(req.params.id as string);
      return ApiResponseHelper.success(res, scholarship, "Scholarship fetched");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const parsed = ScholarshipFilterDTO.safeParse(req.query);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Filter error: ${errors}`, 400);
      }
      const result = await scholarshipService.getAll(parsed.data);
      return ApiResponseHelper.success(res, result.data, "Scholarships fetched", 200, {
        page: parsed.data.page,
        limit: parsed.data.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / parsed.data.limit),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const parsed = UpdateScholarshipDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }
      const scholarship = await scholarshipService.update(req.params.id as string, parsed.data);
      return ApiResponseHelper.success(res, scholarship, "Scholarship updated");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await scholarshipService.delete(req.params.id as string);
      return ApiResponseHelper.success(res, null, "Scholarship deleted");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }
}