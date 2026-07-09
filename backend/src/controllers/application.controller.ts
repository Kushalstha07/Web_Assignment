import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { applicationService } from "../services/application.service";
import { CreateApplicationDTO, UpdateApplicationDTO, SubmitApplicationDTO } from "../dtos/application.dto";
import { HttpException } from "../exceptions/http-exception";

export class ApplicationController {
  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      const parsed = CreateApplicationDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }

      const app = await applicationService.create(parsed.data, userId);
      return ApiResponseHelper.success(res, app, "Application created", 201);
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const role = req.user?.role || "student";
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      const app = await applicationService.getById(req.params.id as string, userId, role);
      return ApiResponseHelper.success(res, app, "Application fetched");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getMyApplications(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      const apps = await applicationService.getMyApplications(userId);
      return ApiResponseHelper.success(res, apps, "Applications fetched");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(String(req.query.page || "1"), 10);
      const limit = parseInt(String(req.query.limit || "10"), 10);
      const search = req.query.search as string | undefined;

      const result = await applicationService.getAll(page, limit, search);
      return ApiResponseHelper.success(res, result.data, "Applications fetched", 200, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const role = req.user?.role || "student";
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      const parsed = UpdateApplicationDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }

      const app = await applicationService.update(req.params.id as string, parsed.data, userId, role);
      return ApiResponseHelper.success(res, app, "Application updated");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async submit(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      const parsed = SubmitApplicationDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }

      const app = await applicationService.submit(req.params.id as string, parsed.data, userId);
      return ApiResponseHelper.success(res, app, "Application submitted");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const role = req.user?.role || "student";
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      await applicationService.delete(req.params.id as string, userId, role);
      return ApiResponseHelper.success(res, null, "Application deleted");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }
}