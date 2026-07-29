import { ScholarshipMongoRepository } from "../repositories/scholarship.repository";
import { ScholarshipApplicationMongoRepository } from "../repositories/scholarship-application.repository";
import { UserMongoRepository } from "../repositories/user.repository";
import { ApplyScholarshipDTOType, UpdateScholarshipApplicationDTOType } from "../dtos/scholarship-application.dto";
import { IScholarshipApplication } from "../models/scholarship-application.model";
import { HttpException } from "../exceptions/http-exception";
import { notificationService } from "./notification.service";
import mongoose from "mongoose";

const applicationRepo = new ScholarshipApplicationMongoRepository();
const scholarshipRepo = new ScholarshipMongoRepository();
const userRepo = new UserMongoRepository();

export type SafeScholarshipApplication = {
  id: string;
  scholarshipId: string;
  scholarshipName?: string;
  studentId: string;
  studentName?: string;
  status: string;
  statement: string;
  academicSummary?: string;
  financialNeed?: string;
  notes?: string;
  submittedAt: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
};

function toSafeApplication(item: IScholarshipApplication, scholarshipName?: string, studentName?: string): SafeScholarshipApplication {
  return {
    id: item._id.toString(),
    scholarshipId: item.scholarshipId,
    scholarshipName,
    studentId: item.studentId,
    studentName,
    status: item.status,
    statement: item.statement,
    academicSummary: item.academicSummary,
    financialNeed: item.financialNeed,
    notes: item.notes,
    submittedAt: item.submittedAt,
    reviewedAt: item.reviewedAt,
    createdAt: item.createdAt?.toISOString?.() || String(item.createdAt),
    updatedAt: item.updatedAt?.toISOString?.() || String(item.updatedAt),
  };
}

async function enrich(items: IScholarshipApplication[]): Promise<SafeScholarshipApplication[]> {
  const scholarshipIds = [...new Set(items.map((item) => item.scholarshipId))];
  const studentIds = [...new Set(items.map((item) => item.studentId))].filter((id) => mongoose.isValidObjectId(id));
  const [scholarships, users] = await Promise.all([
    Promise.all(scholarshipIds.map((id) => scholarshipRepo.getById(id))),
    userRepo.getUsersByIds(studentIds),
  ]);
  const scholarshipNames = new Map(scholarships.filter(Boolean).map((item) => [item!._id.toString(), item!.name]));
  const studentNames = new Map(users.map((user) => [user._id.toString(), user.fullName]));
  return items.map((item) => toSafeApplication(item, scholarshipNames.get(item.scholarshipId), studentNames.get(item.studentId)));
}

export class ScholarshipApplicationService {
  async apply(scholarshipId: string, studentId: string, data: ApplyScholarshipDTOType): Promise<SafeScholarshipApplication> {
    const scholarship = await scholarshipRepo.getById(scholarshipId);
    if (!scholarship) throw new HttpException(404, "Scholarship not found");
    if (scholarship.status !== "active") throw new HttpException(400, "You can only apply to active scholarships");
    if (await applicationRepo.getByScholarshipAndStudent(scholarshipId, studentId)) {
      throw new HttpException(409, "You have already applied for this scholarship");
    }

    const created = await applicationRepo.create({
      scholarshipId,
      studentId,
      status: "submitted",
      statement: data.statement,
      academicSummary: data.academicSummary,
      financialNeed: data.financialNeed,
      submittedAt: new Date().toISOString(),
    });
    await notificationService.notify({
      userId: studentId,
      title: "Scholarship application submitted",
      message: `Your application for ${scholarship.name} was submitted.`,
      type: "success",
      category: "scholarship",
      link: "/scholarships",
      metadata: { scholarshipId, scholarshipApplicationId: created._id.toString() },
    });
    return toSafeApplication(created, scholarship.name);
  }

  async list(userId: string, role: string): Promise<SafeScholarshipApplication[]> {
    const items = role === "admin" ? await applicationRepo.getAll() : await applicationRepo.getByStudentId(userId);
    return enrich(items);
  }

  async update(id: string, data: UpdateScholarshipApplicationDTOType): Promise<SafeScholarshipApplication> {
    const existing = await applicationRepo.getById(id);
    if (!existing) throw new HttpException(404, "Scholarship application not found");
    const updated = await applicationRepo.update(id, {
      ...data,
      ...(data.status && data.status !== existing.status ? { reviewedAt: new Date().toISOString() } : {}),
    });
    if (!updated) throw new HttpException(500, "Failed to update scholarship application");
    if (data.status && data.status !== existing.status) {
      await notificationService.notify({
        userId: existing.studentId,
        title: "Scholarship application updated",
        message: `Your scholarship application is now ${data.status.replaceAll("-", " ")}.`,
        type: data.status === "approved" ? "success" : data.status === "rejected" ? "error" : "info",
        category: "scholarship",
        link: "/scholarships",
        metadata: { scholarshipApplicationId: id },
      });
    }
    return (await enrich([updated]))[0];
  }
}

export const scholarshipApplicationService = new ScholarshipApplicationService();
