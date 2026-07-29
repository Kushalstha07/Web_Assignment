import { Request, Response } from "express";
import { ApplyScholarshipDTO, UpdateScholarshipApplicationDTO } from "../dtos/scholarship-application.dto";
import { scholarshipApplicationService } from "../services/scholarship-application.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { HttpException } from "../exceptions/http-exception";

function validationMessage(issues: { path: PropertyKey[]; message: string }[]) {
  return issues.map((issue) => `${issue.path.join(".") || "request"}: ${issue.message}`).join(", ");
}

export class ScholarshipApplicationController {
  async apply(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const parsed = ApplyScholarshipDTO.safeParse(req.body);
      if (!parsed.success) return ApiResponseHelper.error(res, `Validation error: ${validationMessage(parsed.error.issues)}`, 400);

      const result = await scholarshipApplicationService.apply(req.params.id as string, userId, parsed.data);
      return ApiResponseHelper.success(res, result, "Scholarship application submitted", 201);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async list(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const result = await scholarshipApplicationService.list(userId, req.user?.role || "student");
      return ApiResponseHelper.success(res, result, "Scholarship applications fetched");
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const parsed = UpdateScholarshipApplicationDTO.safeParse(req.body);
      if (!parsed.success) return ApiResponseHelper.error(res, `Validation error: ${validationMessage(parsed.error.issues)}`, 400);

      const result = await scholarshipApplicationService.update(req.params.id as string, parsed.data);
      return ApiResponseHelper.success(res, result, "Scholarship application updated");
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: unknown) {
    if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
    return ApiResponseHelper.error(res, error instanceof Error ? error.message : "Something went wrong", 500);
  }
}
