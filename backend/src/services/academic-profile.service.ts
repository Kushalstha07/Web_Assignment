import { AcademicProfileMongoRepository } from "../repositories/academic-profile.repository";
import { AcademicProfileType } from "../types/academic-profile.type";
import { CreateAcademicProfileDTO, UpdateAcademicProfileDTO, Step1PersonalDTO, Step2AcademicDTO, Step3PreferencesDTO } from "../dtos/academic-profile.dto";
import { HttpException } from "../exceptions/http-exception";
import { IAcademicProfile } from "../models/academic-profile.model";

const profileRepo = new AcademicProfileMongoRepository();

export type SafeAcademicProfile = {
  id: string;
  userId: string;
  highestQualification: string;
  institution: string;
  graduationYear: number;
  gpa?: number;
  fieldOfStudy: string;
  testType?: string;
  testScore?: number;
  preferredCountries: string[];
  tuitionBudget?: string;
  bio?: string;
  profileStrength: number;
  createdAt: string;
  updatedAt: string;
};

function toSafeProfile(profile: IAcademicProfile): SafeAcademicProfile {
  return {
    id: profile._id.toString(),
    userId: profile.userId,
    highestQualification: profile.highestQualification,
    institution: profile.institution,
    graduationYear: profile.graduationYear,
    gpa: profile.gpa,
    fieldOfStudy: profile.fieldOfStudy,
    testType: profile.testType,
    testScore: profile.testScore,
    preferredCountries: profile.preferredCountries || [],
    tuitionBudget: profile.tuitionBudget,
    bio: profile.bio,
    profileStrength: profile.profileStrength || 0,
    createdAt: profile.createdAt?.toISOString?.() || String(profile.createdAt),
    updatedAt: profile.updatedAt?.toISOString?.() || String(profile.updatedAt),
  };
}

export class AcademicProfileService {
  async getByUserId(userId: string): Promise<SafeAcademicProfile> {
    const profile = await profileRepo.getByUserId(userId);
    if (!profile) {
      throw new HttpException(404, "Academic profile not found. Please complete your profile.");
    }
    return toSafeProfile(profile);
  }

  async createProfile(userId: string, data: AcademicProfileType): Promise<SafeAcademicProfile> {
    const existing = await profileRepo.getByUserId(userId);
    if (existing) {
      throw new HttpException(400, "Profile already exists. Use update instead.");
    }
    const created = await profileRepo.createProfile({ ...data, userId } as unknown as AcademicProfileType);
    return toSafeProfile(created);
  }

  async updateProfile(userId: string, update: UpdateAcademicProfileDTO): Promise<SafeAcademicProfile> {
    const updated = await profileRepo.updateProfile(userId, update);
    if (!updated) {
      throw new HttpException(404, "Profile not found");
    }
    return toSafeProfile(updated);
  }

  async upsertProfile(userId: string, data: AcademicProfileType): Promise<SafeAcademicProfile> {
    const upserted = await profileRepo.upsertProfile(userId, data);
    return toSafeProfile(upserted);
  }

  async saveStep1(userId: string, stepData: Step1PersonalDTO): Promise<SafeAcademicProfile> {
    return this.upsertProfile(userId, { userId, ...stepData } as unknown as AcademicProfileType);
  }

  async saveStep2(userId: string, stepData: Step2AcademicDTO): Promise<SafeAcademicProfile> {
    const existing = await profileRepo.getByUserId(userId);
    if (!existing) {
      throw new HttpException(404, "Please complete Step 1 first");
    }
    return this.upsertProfile(userId, { ...existing, ...stepData });
  }

  async saveStep3(userId: string, stepData: Step3PreferencesDTO): Promise<SafeAcademicProfile> {
    const existing = await profileRepo.getByUserId(userId);
    if (!existing) {
      throw new HttpException(404, "Please complete previous steps first");
    }
    return this.upsertProfile(userId, { ...existing, ...stepData });
  }

  calculateProfileStrength(profile: Partial<IAcademicProfile>): number {
    let score = 0;
    if (profile.highestQualification) score += 25;
    if (profile.institution) score += 15;
    if (profile.graduationYear) score += 10;
    if (profile.gpa && profile.gpa > 0) score += 15;
    if (profile.fieldOfStudy) score += 10;
    if (profile.testType && profile.testScore) score += 15;
    if (profile.preferredCountries && profile.preferredCountries.length > 0) score += 10;
    return Math.min(100, score);
  }
}