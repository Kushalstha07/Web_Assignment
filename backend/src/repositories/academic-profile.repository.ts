import { AcademicProfileModel } from "../models/academic-profile.model";
import { IAcademicProfile } from "../models/academic-profile.model";
import { AcademicProfileType } from "../types/academic-profile.type";

export interface IAcademicProfileRepository {
  createProfile(profile: AcademicProfileType): Promise<IAcademicProfile>;
  getByUserId(userId: string): Promise<IAcademicProfile | null>;
  updateProfile(userId: string, update: Partial<AcademicProfileType>): Promise<IAcademicProfile | null>;
  upsertProfile(userId: string, data: AcademicProfileType): Promise<IAcademicProfile>;
}

export class AcademicProfileMongoRepository implements IAcademicProfileRepository {
  async createProfile(profile: AcademicProfileType): Promise<IAcademicProfile> {
    const created = await AcademicProfileModel.create(profile);
    return created.toObject() as IAcademicProfile;
  }

  async getByUserId(userId: string): Promise<IAcademicProfile | null> {
    const profile = await AcademicProfileModel.findOne({ userId });
    return profile ? (profile.toObject() as IAcademicProfile) : null;
  }

  async updateProfile(userId: string, update: Partial<AcademicProfileType>): Promise<IAcademicProfile | null> {
    const updated = await AcademicProfileModel.findOneAndUpdate(
      { userId },
      { $set: update },
      { returnDocument: "after", runValidators: true },
    );
    return updated ? (updated.toObject() as IAcademicProfile) : null;
  }

  async upsertProfile(userId: string, data: AcademicProfileType): Promise<IAcademicProfile> {
    const upserted = await AcademicProfileModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { returnDocument: "after", upsert: true, runValidators: true },
    );
    return upserted.toObject() as IAcademicProfile;
  }
}
