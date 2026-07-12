import { ScholarshipMongoRepository } from "../repositories/scholarship.repository";
import { ScholarshipType } from "../types/scholarship.type";
import { CreateScholarshipDTOType, UpdateScholarshipDTOType, ScholarshipFilterDTOType } from "../dtos/scholarship.dto";
import { HttpException } from "../exceptions/http-exception";
import { IScholarship } from "../models/scholarship.model";

const scholarshipRepo = new ScholarshipMongoRepository();

export type SafeScholarship = {
  id: string;
  name: string;
  provider: string;
  type: string;
  amount: number;
  currency: string;
  description?: string;
  eligibility?: string;
  requirements: string[];
  countries: string[];
  universities: string[];
  deadline?: string;
  status: string;
  applicationUrl?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

function toSafeScholarship(s: IScholarship): SafeScholarship {
  const d = s as IScholarship & { createdAt?: Date; updatedAt?: Date };
  return {
    id: s._id.toString(),
    name: s.name,
    provider: s.provider,
    type: s.type,
    amount: s.amount,
    currency: s.currency || "USD",
    description: s.description,
    eligibility: s.eligibility,
    requirements: s.requirements || [],
    countries: s.countries || [],
    universities: s.universities || [],
    deadline: s.deadline,
    status: s.status,
    applicationUrl: s.applicationUrl,
    imageUrl: s.imageUrl,
    createdAt: d.createdAt?.toISOString?.() || String(d.createdAt),
    updatedAt: d.updatedAt?.toISOString?.() || String(d.updatedAt),
  };
}

export class ScholarshipService {
  async create(data: CreateScholarshipDTOType): Promise<SafeScholarship> {
    const created = await scholarshipRepo.create(data as ScholarshipType);
    return toSafeScholarship(created);
  }

  async getById(id: string): Promise<SafeScholarship> {
    const s = await scholarshipRepo.getById(id);
    if (!s) throw new HttpException(404, "Scholarship not found");
    return toSafeScholarship(s);
  }

  async getAll(filter: ScholarshipFilterDTOType): Promise<{ data: SafeScholarship[]; total: number }> {
    const result = await scholarshipRepo.getAll(filter);
    return { data: result.data.map(toSafeScholarship), total: result.total };
  }

  async update(id: string, data: UpdateScholarshipDTOType): Promise<SafeScholarship> {
    const updated = await scholarshipRepo.update(id, data);
    if (!updated) throw new HttpException(404, "Scholarship not found");
    return toSafeScholarship(updated);
  }

  async delete(id: string): Promise<boolean> {
    return scholarshipRepo.delete(id);
  }
}

export const scholarshipService = new ScholarshipService();