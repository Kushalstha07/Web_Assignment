import { IUniversityRepository, UniversityMongoRepository } from "../repositories/university.repository";
import { UniversityFilterDTOType } from "../dtos/university.dto";
import { UniversityType } from "../types/university.type";
import { HttpException } from "../exceptions/http-exception";
import { IUniversity } from "../models/university.model";
import { AcademicProfileMongoRepository } from "../repositories/academic-profile.repository";
import { IAcademicProfile } from "../models/academic-profile.model";

const universityRepo = new UniversityMongoRepository();
const profileRepo = new AcademicProfileMongoRepository();

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

export type RecommendedUniversity = SafeUniversity & { score: number; reasons: string[] };

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

  private scoreUniversity(university: IUniversity, profile: IAcademicProfile): { score: number; reasons: string[] } {
    let score = 10;
    const reasons: string[] = [];
    const normalizedField = profile.fieldOfStudy.toLowerCase();
    const programMatch = (university.programs || []).some((program) => {
      const normalizedProgram = program.toLowerCase();
      return normalizedProgram.includes(normalizedField) || normalizedField.includes(normalizedProgram);
    });
    const suitableCourseTypes: Record<string, string[]> = {
      "high-school": ["undergraduate", "diploma"],
      diploma: ["undergraduate"],
      bachelor: ["postgraduate"],
      master: ["postgraduate", "research"],
      doctorate: ["research"],
    };

    if (profile.preferredCountries?.includes(university.country)) {
      score += 25;
      reasons.push("Preferred destination");
    }
    if (profile.tuitionBudget && profile.tuitionBudget === university.budgetRange) {
      score += 20;
      reasons.push("Within your tuition budget");
    }
    if (programMatch) {
      score += 25;
      reasons.push("Offers your study field");
    }
    if (suitableCourseTypes[profile.highestQualification]?.includes(university.courseType)) {
      score += 10;
      reasons.push("Suitable study level");
    }

    const gpaThresholds: Record<string, number> = {
      "top-10": 3.7,
      "top-50": 3.4,
      "top-100": 3,
      "top-200": 2.5,
      regional: 0,
    };
    if (profile.gpa === undefined || profile.gpa >= gpaThresholds[university.ranking]) {
      score += profile.gpa === undefined ? 5 : 15;
      reasons.push(profile.gpa === undefined ? "Academic requirements need review" : "Academic profile aligns");
    }

    if (!reasons.length) reasons.push("Explore as an alternative option");
    return { score: Math.min(100, score), reasons };
  }

  async getRecommendations(userId: string, limit: number): Promise<RecommendedUniversity[]> {
    const profile = await profileRepo.getByUserId(userId);
    if (!profile) throw new HttpException(404, "Complete your academic profile to receive recommendations");
    const universities = await universityRepo.getAll();
    return universities
      .map((university) => ({ ...toSafeUniversity(university), ...this.scoreUniversity(university, profile) }))
      .sort((left, right) => right.score - left.score || (left.worldRanking || Number.MAX_SAFE_INTEGER) - (right.worldRanking || Number.MAX_SAFE_INTEGER))
      .slice(0, limit);
  }

  async getByCountry(country: string): Promise<SafeUniversity[]> {
    const universities = await universityRepo.getByCountry(country);
    return universities.map(toSafeUniversity);
  }
}
