import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { analyticsService } from "../services/analytics.service";

export class AnalyticsController {
  async getTotals(req: Request, res: Response) {
    try {
      const totals = await analyticsService.getTotals();
      return ApiResponseHelper.success(res, totals, "Analytics totals fetched");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getRegionalDistribution(req: Request, res: Response) {
    try {
      const data = await analyticsService.getRegionalDistribution();
      return ApiResponseHelper.success(res, data, "Regional distribution fetched");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getTopUniversities(req: Request, res: Response) {
    try {
      const limit = parseInt(String(req.query.limit || "10"), 10);
      const data = await analyticsService.getTopUniversities(limit);
      return ApiResponseHelper.success(res, data, "Top universities fetched");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getMonthlyGrowth(req: Request, res: Response) {
    try {
      const data = await analyticsService.getMonthlyGrowth();
      return ApiResponseHelper.success(res, data, "Monthly growth fetched");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getSuccessRate(req: Request, res: Response) {
    try {
      const data = await analyticsService.getSuccessRate();
      return ApiResponseHelper.success(res, data, "Success rate fetched");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }
}