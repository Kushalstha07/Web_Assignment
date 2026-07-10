import { CounsellorModel, ICounsellor } from "../models/counsellor.model";
import { CounsellorType } from "../types/counsellor.type";
import { UpdateCounsellorDTOType } from "../dtos/counsellor.dto";

export interface ICounsellorRepository {
  create(data: CounsellorType): Promise<ICounsellor>;
  getById(id: string): Promise<ICounsellor | null>;
  getByUserId(userId: string): Promise<ICounsellor | null>;
  getAll(available?: boolean, specialty?: string): Promise<ICounsellor[]>;
  getAllPaginated(page: number, limit: number, search?: string): Promise<{ data: ICounsellor[]; total: number }>;
  update(id: string, data: UpdateCounsellorDTOType): Promise<ICounsellor | null>;
  delete(id: string): Promise<boolean>;
}

export class CounsellorMongoRepository implements ICounsellorRepository {
  async create(data: CounsellorType): Promise<ICounsellor> {
    const created = await CounsellorModel.create(data);
    return created.toObject() as ICounsellor;
  }

  async getById(id: string): Promise<ICounsellor | null> {
    const doc = await CounsellorModel.findById(id);
    return doc ? (doc.toObject() as ICounsellor) : null;
  }

  async getByUserId(userId: string): Promise<ICounsellor | null> {
    const doc = await CounsellorModel.findOne({ userId });
    return doc ? (doc.toObject() as ICounsellor) : null;
  }

  async getAll(available?: boolean, specialty?: string): Promise<ICounsellor[]> {
    const query: Record<string, any> = {};
    if (available !== undefined) query.available = available;
    if (specialty) query.specialties = specialty;
    const docs = await CounsellorModel.find(query).sort({ rating: -1 });
    return docs.map((d) => d.toObject() as ICounsellor);
  }

  async getAllPaginated(page: number, limit: number, search?: string): Promise<{ data: ICounsellor[]; total: number }> {
    const query: Record<string, any> = {};
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const [data, total] = await Promise.all([
      CounsellorModel.find(query).sort({ rating: -1 }).skip((page - 1) * limit).limit(limit),
      CounsellorModel.countDocuments(query),
    ]);
    return { data: data.map((d) => d.toObject() as ICounsellor), total };
  }

  async update(id: string, data: UpdateCounsellorDTOType): Promise<ICounsellor | null> {
    const updated = await CounsellorModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    return updated ? (updated.toObject() as ICounsellor) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await CounsellorModel.findByIdAndDelete(id);
    return result !== null;
  }
}