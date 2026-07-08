import { IUniversity, University } from "../models/university.model";
import { UniversityFilterDTOType } from "../dtos/university.dto";
import { UniversityType } from "../types/university.type";

export interface IUniversityRepository {
  create(data: UniversityType): Promise<IUniversity>;
  getById(id: string): Promise<IUniversity | null>;
  getAll(): Promise<IUniversity[]>;
  update(id: string, data: Partial<UniversityType>): Promise<IUniversity | null>;
  delete(id: string): Promise<IUniversity | null>;
  getAllPaginated(filter: UniversityFilterDTOType): Promise<{ data: IUniversity[]; total: number; page: number; limit: number }>;
  getByCountry(country: string): Promise<IUniversity[]>;
  getByBudgetRange(budgetRange: string): Promise<IUniversity[]>;
  getByCourseType(courseType: string): Promise<IUniversity[]>;
}

export class UniversityMongoRepository implements IUniversityRepository {
  async create(data: UniversityType): Promise<IUniversity> {
    return University.create(data);
  }

  async getById(id: string): Promise<IUniversity | null> {
    return University.findById(id);
  }

  async getAll(): Promise<IUniversity[]> {
    return University.find({ isActive: true }).sort({ worldRanking: 1 });
  }

  async update(id: string, data: Partial<UniversityType>): Promise<IUniversity | null> {
    return University.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IUniversity | null> {
    return University.findByIdAndDelete(id);
  }

  async getAllPaginated(filter: UniversityFilterDTOType): Promise<{ data: IUniversity[]; total: number; page: number; limit: number }> {
    const query: any = { isActive: true };

    if (filter.country) query.country = filter.country;
    if (filter.courseType) query.courseType = filter.courseType;
    if (filter.budgetRange) query.budgetRange = filter.budgetRange;
    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: "i" } },
        { description: { $regex: filter.search, $options: "i" } },
        { city: { $regex: filter.search, $options: "i" } },
      ];
    }

    const skip = (filter.page - 1) * filter.limit;
    const [data, total] = await Promise.all([
      University.find(query).sort({ worldRanking: 1 }).skip(skip).limit(filter.limit),
      University.countDocuments(query),
    ]);

    return { data, total, page: filter.page, limit: filter.limit };
  }

  async getByCountry(country: string): Promise<IUniversity[]> {
    return University.find({ country, isActive: true }).sort({ worldRanking: 1 });
  }

  async getByBudgetRange(budgetRange: string): Promise<IUniversity[]> {
    return University.find({ budgetRange, isActive: true }).sort({ tuitionFee: 1 });
  }

  async getByCourseType(courseType: string): Promise<IUniversity[]> {
    return University.find({ courseType, isActive: true }).sort({ worldRanking: 1 });
  }
}