import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { AcademicProfileService } from "../services/academic-profile.service";
import { AcademicProfileType } from "../types/academic-profile.type";
import { UpdateAcademicProfileDTO, Step1PersonalDTO, Step2AcademicDTO, Step3PreferencesDTO } from "../dtos/academic-profile.dto";

const academicProfileService = new AcademicProfileService();

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
      const profile = await academicProfileService.createProfile(userId, req.body as unknown as AcademicProfileType);
      return ApiResponseHelper.success(res, profile, "Profile created successfully", 201);
    } catch (error) {
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
      const profile = await academicProfileService.updateProfile(userId, req.body as UpdateAcademicProfileDTO);
      return ApiResponseHelper.success(res, profile, "Profile updated successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message);
    }
  }

  async saveStep1(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }
      const profile = await academicProfileService.saveStep1(userId, req.body as Step1PersonalDTO);
      return ApiResponseHelper.success(res, profile, "Step 1 saved");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message);
    }
  }

  async saveStep2(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }
      const profile = await academicProfileService.saveStep2(userId, req.body as Step2AcademicDTO);
      return ApiResponseHelper.success(res, profile, "Step 2 saved");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message);
    }
  }

  async saveStep3(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }
      const profile = await academicProfileService.saveStep3(userId, req.body as Step3PreferencesDTO);
      return ApiResponseHelper.success(res, profile, "Step 3 saved");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message);
    }
  }
}