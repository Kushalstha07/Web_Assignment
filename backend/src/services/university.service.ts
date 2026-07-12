import { IUniversityRepository, UniversityMongoRepository } from "../repositories/university.repository";
import { UniversityFilterDTOType } from "../dtos/university.dto";
import { UniversityType } from "../types/university.type";
import { HttpException } from "../exceptions/http-exception";
import { IUniversity } from "../models/university.model";

const universityRepo = new UniversityMongoRepository();

export type SafeUniversity = {
  id: string;
  name: string;
  country: string;
  city: string;
  ranking: string;
  worldRanking?: number;
  courseType: string;
  tuitionFee: number;
  budgetRange: string;
  applicationFee?: number;
  description?: string;
  programs: string[];
  rating?: number;
  matchScore?: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

function toSafeUniversity(u: IUniversity): SafeUniversity {
  const doc = u as IUniversity & { createdAt?: Date; updatedAt?: Date };
  return {
    id: u._id.toString(),
    name: u.name,
    country: u.country,
    city: u.city,
    ranking: u.ranking,
    worldRanking: u.worldRanking,
    courseType: u.courseType,
    tuitionFee: u.tuitionFee,
    budgetRange: u.budgetRange,
    applicationFee: u.applicationFee,
    description: u.description,
    programs: u.programs || [],
    rating: u.rating,
    matchScore: u.matchScore,
    imageUrl: u.imageUrl,
    isActive: u.isActive,
    createdAt: doc.createdAt?.toISOString?.() || String(doc.createdAt),
    updatedAt: doc.updatedAt?.toISOString?.() || String(doc.updatedAt),
  };
}

export class UniversityService {
  async create(data: UniversityType): Promise<SafeUniversity> {
    const university = await universityRepo.create(data);
    return toSafeUniversity(university);
  }

  async getById(id: string): Promise<SafeUniversity> {
    const university = await universityRepo.getById(id);
    if (!university) throw new HttpException(404, "University not found");
    return toSafeUniversity(university);
  }

  async getAll(): Promise<SafeUniversity[]> {
    const universities = await universityRepo.getAll();
    return universities.map(toSafeUniversity);
  }

  async update(id: string, data: Partial<UniversityType>): Promise<SafeUniversity> {
    const updated = await universityRepo.update(id, data);
    if (!updated) throw new HttpException(404, "University not found");
    return toSafeUniversity(updated);
  }

  async delete(id: string): Promise<void> {
    const deleted = await universityRepo.delete(id);
    if (!deleted) throw new HttpException(404, "University not found");
  }

  async getAllPaginated(filter: UniversityFilterDTOType): Promise<{ data: SafeUniversity[]; total: number; page: number; limit: number }> {
    const result = await universityRepo.getAllPaginated(filter);
    return {
      data: result.data.map(toSafeUniversity),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  /**
   * Compute a match score (0-100) between a student's academic profile and a university.
   * Factors: budget match, courseType match, country preference, ranking prestige, GPA alignment.
   */
  computeMatchScore(university: IUniversity, profile?: { budgetRange?: string; preferredCountries?: string[]; gpa?: number }): number {
    let score = 50; // baseline

    if (profile) {
      // Budget match (up to 20 pts)
      if (profile.budgetRange && university.budgetRange === profile.budgetRange) {
        score += 20;
      }

      // Country preference match (up to 15 pts)
      if (profile.preferredCountries?.length && profile.preferredCountries.includes(university.country)) {
        score += 15;
      }

      // GPA alignment (up to 10 pts)
      if (profile.gpa && profile.gpa >= 3.5) score += 10;
      else if (profile.gpa && profile.gpa >= 3.0) score += 5;
      else if (profile.gpa && profile.gpa >= 2.5) score += 2;

      // Ranking prestige (up to 5 pts)
      if (university.ranking === "top-10") score += 5;
      else if (university.ranking === "top-50") score += 4;
      else if (university.ranking === "top-100") score += 3;
    }

    return Math.min(100, Math.max(0, score));
  }

  async getByCountry(country: string): Promise<SafeUniversity[]> {
    const universities = await universityRepo.getByCountry(country);
    return universities.map(toSafeUniversity);
  }
}