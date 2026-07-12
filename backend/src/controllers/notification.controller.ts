import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { notificationService } from "../services/notification.service";
import { MarkNotificationReadDTO } from "../dtos/notification.dto";
import { HttpException } from "../exceptions/http-exception";

export class NotificationController {
  async getMyNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const page = parseInt(String(req.query.page || "1"), 10);
      const limit = parseInt(String(req.query.limit || "20"), 10);
      const result = await notificationService.getMyNotifications(userId, page, limit);
      return ApiResponseHelper.success(res, result.data, "Notifications fetched", 200, {
        page, limit, total: result.total, totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const count = await notificationService.getUnreadCount(userId);
      return ApiResponseHelper.success(res, { count }, "Unread count fetched");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const parsed = MarkNotificationReadDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }
      await notificationService.markAsRead(parsed.data.notificationIds, userId);
      return ApiResponseHelper.success(res, null, "Notifications marked as read");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      await notificationService.markAllAsRead(userId);
      return ApiResponseHelper.success(res, null, "All notifications marked as read");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      await notificationService.delete(req.params.id as string, userId);
      return ApiResponseHelper.success(res, null, "Notification deleted");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }
}