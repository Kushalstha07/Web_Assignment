import { Request, Response } from "express";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { documentService } from "../services/document.service";
import { CreateDocumentDTO, VerifyDocumentDTO } from "../dtos/document.dto";
import { HttpException } from "../exceptions/http-exception";
import { unlink } from "fs/promises";

export class DocumentController {
  async upload(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      if (!req.file) return ApiResponseHelper.error(res, "File is required", 400);

      const parsed = CreateDocumentDTO.safeParse(req.body);
      if (!parsed.success) {
        await unlink(req.file.path).catch(() => undefined);
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }

      const doc = await documentService.upload(parsed.data, userId, req.file);
      return ApiResponseHelper.success(res, doc, "Document uploaded", 201);
    } catch (error) {
      if (req.file) await unlink(req.file.path).catch(() => undefined);
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async download(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const role = req.user?.role || "student";
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      const file = await documentService.getDownload(
        req.params.id as string,
        userId,
        role,
      );
      res.setHeader("Content-Type", file.mimeType);
      const disposition = role === "counsellor" ? "inline" : "attachment";
      res.setHeader(
        "Content-Disposition",
        `${disposition}; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
      );
      return res.sendFile(file.path);
    } catch (error) {
      if (error instanceof HttpException) {
        return ApiResponseHelper.error(res, error.message, error.status);
      }
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const role = req.user?.role || "student";
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      const doc = await documentService.getById(req.params.id as string, userId, role);
      return ApiResponseHelper.success(res, doc, "Document fetched");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getMyDocuments(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      const docs = await documentService.getMyDocuments(userId);
      return ApiResponseHelper.success(res, docs, "Documents fetched");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getStudentDocuments(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const role = req.user?.role || "student";
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      const docs = await documentService.getStudentDocuments(
        req.params.studentId as string,
        userId,
        role,
      );
      return ApiResponseHelper.success(res, docs, "Student documents fetched");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(String(req.query.page || "1"), 10);
      const limit = parseInt(String(req.query.limit || "10"), 10);
      const search = req.query.search as string | undefined;
      const status = req.query.status as string | undefined;

      const result = await documentService.getAll(page, limit, search, status);
      return ApiResponseHelper.success(res, result.data, "Documents fetched", 200, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      const parsed = VerifyDocumentDTO.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return ApiResponseHelper.error(res, `Validation error: ${errors}`, 400);
      }

      const doc = await documentService.verify(req.params.id as string, parsed.data, userId);
      return ApiResponseHelper.success(res, doc, "Document verified");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const role = req.user?.role || "student";
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      await documentService.delete(req.params.id as string, userId, role);
      return ApiResponseHelper.success(res, null, "Document deleted");
    } catch (error) {
      if (error instanceof HttpException) return ApiResponseHelper.error(res, error.message, error.status);
      const message = error instanceof Error ? error.message : "Something went wrong";
      return ApiResponseHelper.error(res, message, 500);
    }
  }
}
