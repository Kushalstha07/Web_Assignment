import { Request, Response } from "express";
import { aiService } from "../services/ai.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { HttpException } from "../exceptions/http-exception";
import { AiChatDTO } from "../dtos/ai.dto";

export class AiController {
  async scholarshipAdvice(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }

      const result = await aiService.getScholarshipAdvice(userId);
      return ApiResponseHelper.success(res, result, "Scholarship advice generated");
    } catch (error) {
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status);
      }

      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async chat(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }

      const parsed = AiChatDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }

      const result = await aiService.chat(userId, parsed.data);
      return ApiResponseHelper.success(res, result, "AI reply generated");
    } catch (error) {
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status);
      }

      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }
}
