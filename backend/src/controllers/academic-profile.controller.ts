import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { AcademicProfileService } from "../services/academic-profile.service";
import {
  CreateAcademicProfileSchema,
  UpdateAcademicProfileSchema,
  Step1PersonalSchema,
  Step2AcademicSchema,
  Step3PreferencesSchema,
} from "../dtos/academic-profile.dto";
import { HttpException } from "../exceptions/http-exception";

const academicProfileService = new AcademicProfileService();

function validationError(issues: { path: PropertyKey[]; message: string }[]): string {
  return issues.map((issue) => `${issue.path.join(".") || "request"}: ${issue.message}`).join(", ");
}

export class AcademicProfileController {
  async getMyProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }
      const profile = await academicProfileService.getByUserId(userId);
      return ApiResponseHelper.success(res, profile, "Profile fetched successfully");
    } catch (error) {
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status);
      }
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async createProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }
      const parsed = CreateAcademicProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        return ApiResponseHelper.error(res, `Validation error: ${validationError(parsed.error.issues)}`, 400);
      }
      const profile = await academicProfileService.createProfile(userId, parsed.data);
      return ApiResponseHelper.success(res, profile, "Profile created successfully", 201);
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }
      const parsed = UpdateAcademicProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        return ApiResponseHelper.error(res, `Validation error: ${validationError(parsed.error.issues)}`, 400);
      }
      const profile = await academicProfileService.updateProfile(userId, parsed.data);
      return ApiResponseHelper.success(res, profile, "Profile updated successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async saveStep1(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }
      const parsed = Step1PersonalSchema.safeParse(req.body);
      if (!parsed.success) {
        return ApiResponseHelper.error(res, `Validation error: ${validationError(parsed.error.issues)}`, 400);
      }
      const profile = await academicProfileService.saveStep1(userId, parsed.data);
      return ApiResponseHelper.success(res, profile, "Step 1 saved");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async saveStep2(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }
      const parsed = Step2AcademicSchema.safeParse(req.body);
      if (!parsed.success) {
        return ApiResponseHelper.error(res, `Validation error: ${validationError(parsed.error.issues)}`, 400);
      }
      const profile = await academicProfileService.saveStep2(userId, parsed.data);
      return ApiResponseHelper.success(res, profile, "Step 2 saved");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async saveStep3(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }
      const parsed = Step3PreferencesSchema.safeParse(req.body);
      if (!parsed.success) {
        return ApiResponseHelper.error(res, `Validation error: ${validationError(parsed.error.issues)}`, 400);
      }
      const profile = await academicProfileService.saveStep3(userId, parsed.data);
      return ApiResponseHelper.success(res, profile, "Step 3 saved");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async completeOnboarding(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const profile = await academicProfileService.completeOnboarding(userId);
      return ApiResponseHelper.success(res, profile, "Onboarding completed");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }
}
