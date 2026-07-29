import { CounsellorMongoRepository } from "../repositories/counsellor.repository";
import { CounsellorType } from "../types/counsellor.type";
import { CreateCounsellorDTOType, UpdateCounsellorDTOType } from "../dtos/counsellor.dto";
import { HttpException } from "../exceptions/http-exception";
import { ICounsellor } from "../models/counsellor.model";
import { ApplicationModel } from "../models/application.model";
import { UserModel } from "../models/user.model";

const counsellorRepo = new CounsellorMongoRepository();

export type SafeCounsellor = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  bio?: string;
  specialties: string[];
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  available: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type AssignedStudent = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  studyLevel: string;
  destination: string;
  fieldOfStudy: string;
  intake: string;
  budget: string;
  role: "student";
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
};

function toSafeCounsellor(c: ICounsellor): SafeCounsellor {
  const doc = c as ICounsellor & { createdAt?: Date; updatedAt?: Date };
  return {
    id: c._id.toString(),
    userId: c.userId,
    fullName: c.fullName,
    email: c.email,
    phoneNumber: c.phoneNumber,
    bio: c.bio,
    specialties: c.specialties || [],
    yearsOfExperience: c.yearsOfExperience || 0,
    rating: c.rating || 0,
    reviewCount: c.reviewCount || 0,
    hourlyRate: c.hourlyRate || 0,
    available: c.available ?? true,
    imageUrl: c.imageUrl,
    createdAt: doc.createdAt?.toISOString?.() || String(doc.createdAt),
    updatedAt: doc.updatedAt?.toISOString?.() || String(doc.updatedAt),
  };
}

export class CounsellorService {
  async ensureProfileForUserId(userId: string): Promise<SafeCounsellor | null> {
    const existing = await counsellorRepo.getByUserId(userId);
    if (existing) return toSafeCounsellor(existing);

    const user = await UserModel.findById(userId);
    if (!user || user.role !== "counsellor") return null;

    const created = await counsellorRepo.create({
      userId: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      bio: "",
      specialties: [],
      yearsOfExperience: 0,
      rating: 0,
      reviewCount: 0,
      hourlyRate: 0,
      available: true,
      imageUrl: user.profileImage || undefined,
    });

    return toSafeCounsellor(created);
  }

  async create(data: CreateCounsellorDTOType): Promise<SafeCounsellor> {
    const existing = await counsellorRepo.getByUserId(data.userId);
    if (existing) throw new HttpException(409, "Counsellor profile already exists for this user");
    const created = await counsellorRepo.create(data as CounsellorType);
    return toSafeCounsellor(created);
  }

  async getById(id: string): Promise<SafeCounsellor> {
    const c = await counsellorRepo.getById(id);
    if (!c) throw new HttpException(404, "Counsellor not found");
    return toSafeCounsellor(c);
  }

  async getByUserId(userId: string): Promise<SafeCounsellor> {
    const counsellor = await this.ensureProfileForUserId(userId);
    if (!counsellor) throw new HttpException(404, "Counsellor profile not found");
    return counsellor;
  }

  async getAll(available?: boolean, specialty?: string): Promise<SafeCounsellor[]> {
    const cs = await counsellorRepo.getAll(available, specialty);
    return cs.map(toSafeCounsellor);
  }

  async getAssignedStudents(
    userId: string,
    search?: string,
  ): Promise<AssignedStudent[]> {
    const counsellor = await this.ensureProfileForUserId(userId);
    if (!counsellor) throw new HttpException(404, "Counsellor profile not found");
    const studentIds = await ApplicationModel.distinct("studentId", {
      counsellorId: counsellor.id,
    });
    const filter: Record<string, unknown> = { _id: { $in: studentIds }, role: "student" };
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const students = await UserModel.find(filter).sort({ fullName: 1 });
    return students.map((student) => ({
      id: student._id.toString(),
      fullName: student.fullName,
      username: student.username,
      email: student.email,
      phoneNumber: student.phoneNumber,
      studyLevel: student.studyLevel || "",
      destination: student.destination || "",
      fieldOfStudy: student.fieldOfStudy || "",
      intake: student.intake || "",
      budget: student.budget || "",
      role: "student",
      profileImage: student.profileImage || null,
      createdAt: student.createdAt.toISOString(),
      updatedAt: student.updatedAt.toISOString(),
    }));
  }

  async getAllPaginated(page: number, limit: number, search?: string): Promise<{ data: SafeCounsellor[]; total: number }> {
    const result = await counsellorRepo.getAllPaginated(page, limit, search);
    return { data: result.data.map(toSafeCounsellor), total: result.total };
  }

  async update(id: string, data: UpdateCounsellorDTOType): Promise<SafeCounsellor> {
    const updated = await counsellorRepo.update(id, data);
    if (!updated) throw new HttpException(500, "Failed to update counsellor");
    return toSafeCounsellor(updated);
  }

  async updateOwn(
    userId: string,
    data: UpdateCounsellorDTOType,
  ): Promise<SafeCounsellor> {
    const counsellor = await this.ensureProfileForUserId(userId);
    if (!counsellor) throw new HttpException(404, "Counsellor profile not found");
    return this.update(counsellor.id, data);
  }

  async delete(id: string): Promise<boolean> {
    return counsellorRepo.delete(id);
  }
}

export const counsellorService = new CounsellorService();
