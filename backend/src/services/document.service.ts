import { DocumentMongoRepository } from "../repositories/document.repository";
import { DocumentType } from "../types/document.type";
import { CreateDocumentDTOType, UpdateDocumentDTOType, VerifyDocumentDTOType } from "../dtos/document.dto";
import { HttpException } from "../exceptions/http-exception";
import { IDocument } from "../models/document.model";
import { unlink } from "fs/promises";
import path from "path";
import { access } from "fs/promises";
import { DOCUMENT_UPLOAD_DIRECTORY } from "../configs/storage";

const docRepo = new DocumentMongoRepository();

export type SafeDocument = {
  id: string;
  userId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  category: string;
  status: string;
  url: string;
  notes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
};

function toSafeDocument(d: IDocument): SafeDocument {
  const doc = d as IDocument & { createdAt?: Date; updatedAt?: Date };
  return {
    id: d._id.toString(),
    userId: d.userId,
    fileName: d.fileName,
    originalName: d.originalName,
    mimeType: d.mimeType,
    size: d.size,
    category: d.category,
    status: d.status,
    url: `/api/v1/documents/${d._id.toString()}/download`,
    notes: d.notes,
    verifiedBy: d.verifiedBy,
    verifiedAt: d.verifiedAt,
    createdAt: doc.createdAt?.toISOString?.() || String(doc.createdAt),
    updatedAt: doc.updatedAt?.toISOString?.() || String(doc.updatedAt),
  };
}

export class DocumentService {
  async upload(data: CreateDocumentDTOType, userId: string, file: Express.Multer.File): Promise<SafeDocument> {
    const docData: DocumentType = {
      userId,
      fileName: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      category: data.category,
      status: "pending",
      url: "private",
      notes: data.notes,
    };
    const created = await docRepo.create(docData);
    return toSafeDocument(created);
  }

  async getById(id: string, userId: string, role: string): Promise<SafeDocument> {
    const doc = await docRepo.getById(id);
    if (!doc) throw new HttpException(404, "Document not found");
    if (role !== "admin" && doc.userId !== userId) {
      throw new HttpException(403, "You can only access your own documents");
    }
    return toSafeDocument(doc);
  }

  async getDownload(
    id: string,
    userId: string,
    role: string,
  ): Promise<{ path: string; mimeType: string; originalName: string }> {
    const doc = await docRepo.getById(id);
    if (!doc) throw new HttpException(404, "Document not found");
    if (role !== "admin" && doc.userId !== userId) {
      throw new HttpException(403, "You can only download your own documents");
    }

    const filePath = path.join(
      DOCUMENT_UPLOAD_DIRECTORY,
      path.basename(doc.fileName),
    );
    try {
      await access(filePath);
    } catch {
      throw new HttpException(404, "Stored document file not found");
    }

    return {
      path: filePath,
      mimeType: doc.mimeType,
      originalName: path.basename(doc.originalName),
    };
  }

  async getMyDocuments(userId: string): Promise<SafeDocument[]> {
    const docs = await docRepo.getByUserId(userId);
    return docs.map(toSafeDocument);
  }

  async getAll(page: number, limit: number, search?: string, status?: string): Promise<{ data: SafeDocument[]; total: number }> {
    if (status) {
      const docs = await docRepo.getByStatus(status);
      return { data: docs.map(toSafeDocument), total: docs.length };
    }
    const result = await docRepo.getAllPaginated(page, limit, search);
    return { data: result.data.map(toSafeDocument), total: result.total };
  }

  async verify(id: string, data: VerifyDocumentDTOType, adminId: string): Promise<SafeDocument> {
    const doc = await docRepo.getById(id);
    if (!doc) throw new HttpException(404, "Document not found");

    const updated = await docRepo.update(id, {
      status: data.status,
      notes: data.notes,
      verifiedBy: adminId,
      verifiedAt: new Date().toISOString(),
    } as any);
    if (!updated) throw new HttpException(500, "Failed to verify document");
    return toSafeDocument(updated);
  }

  async delete(id: string, userId: string, role: string): Promise<boolean> {
    const doc = await docRepo.getById(id);
    if (!doc) throw new HttpException(404, "Document not found");
    if (role !== "admin" && doc.userId !== userId) {
      throw new HttpException(403, "You can only delete your own documents");
    }
    const deleted = await docRepo.delete(id);
    if (deleted) {
      await unlink(
        path.join(DOCUMENT_UPLOAD_DIRECTORY, path.basename(doc.fileName)),
      ).catch(() => undefined);
    }
    return deleted;
  }
}

export const documentService = new DocumentService();
