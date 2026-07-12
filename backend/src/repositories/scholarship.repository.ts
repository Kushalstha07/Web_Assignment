import { ScholarshipModel, IScholarship } from "../models/scholarship.model";
import { ScholarshipType } from "../types/scholarship.type";
import { UpdateScholarshipDTOType, ScholarshipFilterDTOType } from "../dtos/scholarship.dto";

export interface IScholarshipRepository {
  create(data: ScholarshipType): Promise<IScholarship>;
  getById(id: string): Promise<IScholarship | null>;
  getAll(filter: ScholarshipFilterDTOType): Promise<{ data: IScholarship[]; total: number }>;
  update(id: string, data: UpdateScholarshipDTOType): Promise<IScholarship | null>;
  delete(id: string): Promise<boolean>;
}

export class ScholarshipMongoRepository implements IScholarshipRepository {
  async create(data: ScholarshipType): Promise<IScholarship> {
    const created = await ScholarshipModel.create(data);
    return created.toObject() as IScholarship;
  }

  async getById(id: string): Promise<IScholarship | null> {
    const doc = await ScholarshipModel.findById(id);
    return doc ? (doc.toObject() as IScholarship) : null;
  }

  async getAll(filter: ScholarshipFilterDTOType): Promise<{ data: IScholarship[]; total: number }> {
    const query: Record<string, any> = {};
    if (filter.type) query.type = filter.type;
    if (filter.country) query.countries = filter.country;
    if (filter.status) query.status = filter.status;
    if (filter.minAmount || filter.maxAmount) {
      query.amount = {};
      if (filter.minAmount) query.amount.$gte = filter.minAmount;
      if (filter.maxAmount) query.amount.$lte = filter.maxAmount;
    }
    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: "i" } },
        { provider: { $regex: filter.search, $options: "i" } },
      ];
    }
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const [data, total] = await Promise.all([
      ScholarshipModel.find(query).sort({ deadline: 1 }).skip((page - 1) * limit).limit(limit),
      ScholarshipModel.countDocuments(query),
    ]);
    return { data: data.map((d) => d.toObject() as IScholarship), total };
  }

  async update(id: string, data: UpdateScholarshipDTOType): Promise<IScholarship | null> {
    const updated = await ScholarshipModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    return updated ? (updated.toObject() as IScholarship) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ScholarshipModel.findByIdAndDelete(id);
    return result !== null;
  }
}