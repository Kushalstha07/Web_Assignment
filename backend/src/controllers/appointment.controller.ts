import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { appointmentService } from "../services/appointment.service";
import { CreateAppointmentDTO, UpdateAppointmentDTO, CancelAppointmentDTO } from "../dtos/appointment.dto";
import { HttpException } from "../exceptions/http-exception";

export class AppointmentController {
  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      const parsed = CreateAppointmentDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }

      const app = await appointmentService.create(parsed.data, userId);
      return ApiResponseHelper.success(res, app, "Appointment created", 201);
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

      const app = await appointmentService.getById(req.params.id as string, userId, role);
      return ApiResponseHelper.success(res, app, "Appointment fetched");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getMyAppointments(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      const apps = await appointmentService.getMyAppointments(userId);
      return ApiResponseHelper.success(res, apps, "Appointments fetched");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getByCounsellor(req: Request, res: Response) {
    try {
      const apps = await appointmentService.getByCounsellor(req.params.counsellorId as string);
      return ApiResponseHelper.success(res, apps, "Appointments fetched");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getByDateRange(req: Request, res: Response) {
    try {
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      if (!startDate || !endDate) return ApiResponseHelper.error(res, "startDate and endDate are required", 400);

      const apps = await appointmentService.getByDateRange(startDate, endDate);
      return ApiResponseHelper.success(res, apps, "Appointments fetched");
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

      const result = await appointmentService.getAll(page, limit, search);
      return ApiResponseHelper.success(res, result.data, "Appointments fetched", 200, {
        page, limit, total: result.total, totalPages: Math.ceil(result.total / limit),
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

      const parsed = UpdateAppointmentDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }

      const app = await appointmentService.update(req.params.id as string, parsed.data, userId, role);
      return ApiResponseHelper.success(res, app, "Appointment updated");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const role = req.user?.role || "student";
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      const parsed = CancelAppointmentDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }

      const app = await appointmentService.cancel(req.params.id as string, parsed.data, userId, role);
      return ApiResponseHelper.success(res, app, "Appointment cancelled");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }
}