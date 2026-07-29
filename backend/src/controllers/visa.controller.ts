import { Request, Response } from "express";
import { CreateVisaCaseDTO, UpdateVisaCaseDTO } from "../dtos/visa.dto";
import { visaService } from "../services/visa.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { HttpException } from "../exceptions/http-exception";

function validationMessage(issues: { path: PropertyKey[]; message: string }[]) {
  return issues.map((issue) => `${issue.path.join(".") || "request"}: ${issue.message}`).join(", ");
}

export class VisaController {
  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const parsed = CreateVisaCaseDTO.safeParse(req.body);
      if (!parsed.success) return ApiResponseHelper.error(res, `Validation error: ${validationMessage(parsed.error.issues)}`, 400);
      const visaCase = await visaService.create(parsed.data, userId);
      return ApiResponseHelper.success(res, visaCase, "Visa case created", 201);
    } catch (error) { return this.handleError(res, error); }
  }

  async list(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const cases = await visaService.list(userId, req.user?.role || "student");
      return ApiResponseHelper.success(res, cases, "Visa cases fetched");
    } catch (error) { return this.handleError(res, error); }
  }

  async getById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const visaCase = await visaService.getById(req.params.id as string, userId, req.user?.role || "student");
      return ApiResponseHelper.success(res, visaCase, "Visa case fetched");
    } catch (error) { return this.handleError(res, error); }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const parsed = UpdateVisaCaseDTO.safeParse(req.body);
      if (!parsed.success) return ApiResponseHelper.error(res, `Validation error: ${validationMessage(parsed.error.issues)}`, 400);
      const visaCase = await visaService.update(req.params.id as string, parsed.data, userId, req.user?.role || "student");
      return ApiResponseHelper.success(res, visaCase, "Visa case updated");
    } catch (error) { return this.handleError(res, error); }
  }

  async delete(req: Request, res: Response) {
    try {
      await visaService.delete(req.params.id as string);
      return ApiResponseHelper.success(res, null, "Visa case deleted");
    } catch (error) { return this.handleError(res, error); }
  }

  private handleError(res: Response, error: unknown) {
    if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
    return ApiResponseHelper.error(res, error instanceof Error ? error.message : "Something went wrong", 500);
  }
}
