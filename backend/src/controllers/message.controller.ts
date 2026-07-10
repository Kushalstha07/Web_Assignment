import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { messageService } from "../services/message.service";
import { CreateConversationDTO, SendMessageDTO, MarkReadDTO } from "../dtos/message.dto";
import { HttpException } from "../exceptions/http-exception";

export class MessageController {
  async createConversation(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const parsed = CreateConversationDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }
      const conv = await messageService.createConversation(parsed.data, userId);
      return ApiResponseHelper.success(res, conv, "Conversation created", 201);
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getMyConversations(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const convs = await messageService.getMyConversations(userId);
      return ApiResponseHelper.success(res, convs, "Conversations fetched");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getConversationById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const conv = await messageService.getConversationById(req.params.id as string, userId);
      return ApiResponseHelper.success(res, conv, "Conversation fetched");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const parsed = SendMessageDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }
      const msg = await messageService.sendMessage(parsed.data, userId);
      return ApiResponseHelper.success(res, msg, "Message sent", 201);
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getMessages(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const conversationId = req.params.conversationId as string;
      const page = parseInt(String(req.query.page || "1"), 10);
      const limit = parseInt(String(req.query.limit || "50"), 10);
      const result = await messageService.getMessages(conversationId, userId, page, limit);
      return ApiResponseHelper.success(res, result.data, "Messages fetched", 200, { page, limit, total: result.total, totalPages: Math.ceil(result.total / limit) });
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const parsed = MarkReadDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }
      await messageService.markAsRead(parsed.data, userId);
      return ApiResponseHelper.success(res, null, "Messages marked as read");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }
}