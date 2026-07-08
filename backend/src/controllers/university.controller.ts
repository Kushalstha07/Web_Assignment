import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { UniversityService } from "../services/university.service";
import { CreateUniversityDTO, UpdateUniversityDTO, UniversityFilterDTO, CreateUniversityDTOType, UpdateUniversityDTOType, UniversityFilterDTOType } from "../dtos/university.dto";

const universityService = new UniversityService();

export class UniversityController {
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
      const { id } = req.params;
      const university = await universityService.getById(id);
      return ApiResponseHelper.success(res, university, "University fetched");
    } catch (error) {
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
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const { id } = req.params;
      const parsed = UpdateUniversityDTO.safeParse(req.body);
      if (!parsed.success) return ApiResponseHelper.error(res, parsed.error.message, 400);
      const university = await universityService.update(id, parsed.data);
      return ApiResponseHelper.success(res, university, "University updated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const { id } = req.params;
      await universityService.delete(id);
      return ApiResponseHelper.success(res, null, "University deleted");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getByCountry(req: Request, res: Response) {
    try {
      const { country } = req.params;
      const universities = await universityService.getByCountry(country);
      return ApiResponseHelper.success(res, universities, "Universities by country");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }
}