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
  onboardingStep: number;
  onboardingCompletedAt?: string;
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
    onboardingStep: profile.onboardingStep || 1,
    onboardingCompletedAt: profile.onboardingCompletedAt?.toISOString(),
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

  async createProfile(userId: string, data: CreateAcademicProfileDTO): Promise<SafeAcademicProfile> {
    const existing = await profileRepo.getByUserId(userId);
    if (existing) {
      throw new HttpException(400, "Profile already exists. Use update instead.");
    }
    const values = { ...data, userId } as AcademicProfileType;
    const created = await profileRepo.createProfile({
      ...values,
      profileStrength: this.calculateProfileStrength(values),
      onboardingStep: 2,
    });
    return toSafeProfile(created);
  }

  async updateProfile(userId: string, update: UpdateAcademicProfileDTO): Promise<SafeAcademicProfile> {
    const existing = await profileRepo.getByUserId(userId);
    if (!existing) {
      throw new HttpException(404, "Profile not found");
    }
    const values = { ...existing, ...update };
    const updated = await profileRepo.updateProfile(userId, {
      ...update,
      profileStrength: this.calculateProfileStrength(values),
    });
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
    const existing = await profileRepo.getByUserId(userId);
    const values = { ...existing, ...stepData };
    return this.upsertProfile(userId, {
      userId,
      ...stepData,
      profileStrength: this.calculateProfileStrength(values),
      onboardingStep: Math.max(existing?.onboardingStep || 1, 2),
      ...(existing?.onboardingCompletedAt ? { onboardingCompletedAt: existing.onboardingCompletedAt } : {}),
    } as AcademicProfileType);
  }

  async saveStep2(userId: string, stepData: Step2AcademicDTO): Promise<SafeAcademicProfile> {
    const existing = await profileRepo.getByUserId(userId);
    if (!existing) {
      throw new HttpException(404, "Please complete Step 1 first");
    }
    const values = { ...existing, ...stepData };
    const updated = await profileRepo.updateProfile(userId, {
      ...stepData,
      profileStrength: this.calculateProfileStrength(values),
      onboardingStep: Math.max(existing.onboardingStep || 1, 3),
    });
    if (!updated) throw new HttpException(404, "Academic profile not found");
    return toSafeProfile(updated);
  }

  async saveStep3(userId: string, stepData: Step3PreferencesDTO): Promise<SafeAcademicProfile> {
    const existing = await profileRepo.getByUserId(userId);
    if (!existing) {
      throw new HttpException(404, "Please complete previous steps first");
    }
    const values = { ...existing, ...stepData };
    const updated = await profileRepo.updateProfile(userId, {
      ...stepData,
      profileStrength: this.calculateProfileStrength(values),
      onboardingStep: Math.max(existing.onboardingStep || 1, 4),
    });
    if (!updated) throw new HttpException(404, "Academic profile not found");
    return toSafeProfile(updated);
  }

  async completeOnboarding(userId: string): Promise<SafeAcademicProfile> {
    const existing = await profileRepo.getByUserId(userId);
    if (!existing) throw new HttpException(404, "Please complete Step 1 first");
    if (existing.onboardingCompletedAt) return toSafeProfile(existing);
    if ((existing.onboardingStep || 1) < 4) {
      throw new HttpException(400, "Please complete all onboarding steps before submitting");
    }
    const updated = await profileRepo.updateProfile(userId, {
      onboardingStep: 5,
      onboardingCompletedAt: new Date(),
      profileStrength: this.calculateProfileStrength(existing),
    });
    if (!updated) throw new HttpException(404, "Academic profile not found");
    return toSafeProfile(updated);
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
