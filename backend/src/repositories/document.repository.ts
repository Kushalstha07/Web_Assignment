import { DocumentModel, IDocument } from "../models/document.model";
import { DocumentType } from "../types/document.type";
import { UpdateDocumentDTOType } from "../dtos/document.dto";

export interface IDocumentRepository {
  create(data: DocumentType): Promise<IDocument>;
  getById(id: string): Promise<IDocument | null>;
  getByUserId(userId: string): Promise<IDocument[]>;
  getByStatus(status: string): Promise<IDocument[]>;
  getByCategory(category: string): Promise<IDocument[]>;
  getAll(): Promise<IDocument[]>;
  update(id: string, data: UpdateDocumentDTOType): Promise<IDocument | null>;
  delete(id: string): Promise<boolean>;
  getAllPaginated(page: number, limit: number, search?: string): Promise<{ data: IDocument[]; total: number }>;
}

export class DocumentMongoRepository implements IDocumentRepository {
  async create(data: DocumentType): Promise<IDocument> {
    const created = await DocumentModel.create(data);
    return created.toObject() as IDocument;
  }

  async getById(id: string): Promise<IDocument | null> {
    const doc = await DocumentModel.findById(id);
    return doc ? (doc.toObject() as IDocument) : null;
  }

  async getByUserId(userId: string): Promise<IDocument[]> {
    const docs = await DocumentModel.find({ userId }).sort({ createdAt: -1 });
    return docs.map((d) => d.toObject() as IDocument);
  }

  async getByStatus(status: string): Promise<IDocument[]> {
    const docs = await DocumentModel.find({ status: status as any }).sort({ createdAt: -1 });
    return docs.map((d) => d.toObject() as IDocument);
  }

  async getByCategory(category: string): Promise<IDocument[]> {
    const docs = await DocumentModel.find({ category: category as any }).sort({ createdAt: -1 });
    return docs.map((d) => d.toObject() as IDocument);
  }

  async getAll(): Promise<IDocument[]> {
    const docs = await DocumentModel.find().sort({ createdAt: -1 });
    return docs.map((d) => d.toObject() as IDocument);
  }

  async update(id: string, data: UpdateDocumentDTOType): Promise<IDocument | null> {
    const updated = await DocumentModel.findByIdAndUpdate(id, { $set: data }, { returnDocument: "after" });
    return updated ? (updated.toObject() as IDocument) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await DocumentModel.findByIdAndDelete(id);
    return result !== null;
  }

  async getAllPaginated(page: number, limit: number, search?: string): Promise<{ data: IDocument[]; total: number }> {
    const query: Record<string, any> = {};
    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }
    const [data, total] = await Promise.all([
      DocumentModel.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      DocumentModel.countDocuments(query),
    ]);
    return { data: data.map((d) => d.toObject() as IDocument), total };
  }
}
