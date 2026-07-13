import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { UniversityService } from "../services/university.service";
import { CreateUniversityDTO, UpdateUniversityDTO, UniversityFilterDTO, RecommendationQueryDTO } from "../dtos/university.dto";
import { HttpException } from "../exceptions/http-exception";

const universityService = new UniversityService();

export class UniversityController {
  async getRecommendations(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const parsed = RecommendationQueryDTO.safeParse(req.query);
      if (!parsed.success) return ApiResponseHelper.error(res, parsed.error.message, 400);
      const recommendations = await universityService.getRecommendations(userId, parsed.data.limit);
      return ApiResponseHelper.success(res, recommendations, "Recommendations generated");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const parsed = CreateUniversityDTO.safeParse(req.body);
      if (!parsed.success) return ApiResponseHelper.error(res, parsed.error.message, 400);
      const university = await universityService.create(parsed.data);
      return ApiResponseHelper.success(res, university, "University created", 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const university = await universityService.getById(id);
      return ApiResponseHelper.success(res, university, "University fetched");
    } catch (error) {
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status);
      }
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getAllPaginated(req: Request, res: Response) {
    try {
      const parsed = UniversityFilterDTO.safeParse(req.query);
      if (!parsed.success) return ApiResponseHelper.error(res, parsed.error.message, 400);
      const result = await universityService.getAllPaginated(parsed.data);
      return ApiResponseHelper.success(res, result.data, "Universities fetched", 200, {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      });
    } catch (error) {
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status);
      }
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const id = req.params.id as string;
      const parsed = UpdateUniversityDTO.safeParse(req.body);
      if (!parsed.success) return ApiResponseHelper.error(res, parsed.error.message, 400);
      const university = await universityService.update(id, parsed.data);
      return ApiResponseHelper.success(res, university, "University updated");
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
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const id = req.params.id as string;
      await universityService.delete(id);
      return ApiResponseHelper.success(res, null, "University deleted");
    } catch (error) {
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status);
      }
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getByCountry(req: Request, res: Response) {
    try {
      const country = req.params.country as string;
      const universities = await universityService.getByCountry(country);
      return ApiResponseHelper.success(res, universities, "Universities by country");
    } catch (error) {
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status);
      }
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }
}
