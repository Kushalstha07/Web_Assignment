import { ApplicationMongoRepository } from "../repositories/application.repository";
import { CounsellorMongoRepository } from "../repositories/counsellor.repository";
import { VisaCaseMongoRepository } from "../repositories/visa.repository";
import { CreateVisaCaseDTOType, UpdateVisaCaseDTOType } from "../dtos/visa.dto";
import { IVisaCase } from "../models/visa.model";
import { HttpException } from "../exceptions/http-exception";
import { notificationService } from "./notification.service";
import { UserModel } from "../models/user.model";
import { ApplicationModel } from "../models/application.model";
import mongoose from "mongoose";

const visaRepo = new VisaCaseMongoRepository();
const applicationRepo = new ApplicationMongoRepository();
const counsellorRepo = new CounsellorMongoRepository();

export type SafeVisaCase = {
  id: string;
  applicationId: string;
  studentId: string;
  studentName?: string;
  program?: string;
  counsellorId?: string | null;
  country: string;
  visaType: string;
  status: string;
  referenceNumber?: string;
  submissionDate?: string;
  appointmentDate?: string;
  decisionDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

function toSafeVisaCase(item: IVisaCase, studentName?: string, program?: string): SafeVisaCase {
  return {
    id: item._id.toString(),
    applicationId: item.applicationId,
    studentId: item.studentId,
    studentName,
    program,
    counsellorId: item.counsellorId || null,
    country: item.country,
    visaType: item.visaType,
    status: item.status,
    referenceNumber: item.referenceNumber,
    submissionDate: item.submissionDate,
    appointmentDate: item.appointmentDate,
    decisionDate: item.decisionDate,
    notes: item.notes,
    createdAt: item.createdAt?.toISOString?.() || String(item.createdAt),
    updatedAt: item.updatedAt?.toISOString?.() || String(item.updatedAt),
  };
}

async function enrich(cases: IVisaCase[]): Promise<SafeVisaCase[]> {
  const studentIds = [...new Set(cases.map((item) => item.studentId))]
    .filter((id) => mongoose.isValidObjectId(id));
  const applicationIds = [...new Set(cases.map((item) => item.applicationId))];
  const [students, applications] = await Promise.all([
    UserModel.find({ _id: { $in: studentIds } }).select("fullName").lean(),
    ApplicationModel.find({ _id: { $in: applicationIds } }).select("program").lean(),
  ]);
  const names = new Map(students.map((student) => [student._id.toString(), student.fullName]));
  const programs = new Map(applications.map((application) => [application._id.toString(), application.program]));
  return cases.map((item) => toSafeVisaCase(item, names.get(item.studentId), programs.get(item.applicationId)));
}

export class VisaService {
  async create(data: CreateVisaCaseDTOType, studentId: string): Promise<SafeVisaCase> {
    const application = await applicationRepo.getById(data.applicationId);
    if (!application) throw new HttpException(404, "Application not found");
    if (application.studentId !== studentId) throw new HttpException(403, "You can only start a visa case for your own application");
    if (application.status !== "accepted") throw new HttpException(400, "A visa case can only be started for an accepted application");
    if (await visaRepo.getByApplicationId(data.applicationId)) throw new HttpException(409, "A visa case already exists for this application");

    const created = await visaRepo.create({
      ...data,
      studentId,
      counsellorId: application.counsellorId || null,
      status: "documents-preparing",
    });
    if (application.counsellorId) {
      const counsellor = await counsellorRepo.getById(application.counsellorId);
      if (counsellor) {
        await notificationService.notify({
          userId: counsellor.userId,
          title: "New visa case",
          message: `A visa case for ${application.program} is ready for guidance.`,
          category: "visa",
          link: "/visa",
          metadata: { visaCaseId: created._id.toString() },
        });
      }
    }
    return toSafeVisaCase(created, undefined, application.program);
  }

  async list(userId: string, role: string): Promise<SafeVisaCase[]> {
    if (role === "admin") return enrich(await visaRepo.getAll());
    if (role === "counsellor") {
      const counsellor = await counsellorRepo.getByUserId(userId);
      if (!counsellor) throw new HttpException(404, "Counsellor profile not found");
      return enrich(await visaRepo.getByCounsellorId(counsellor._id.toString()));
    }
    return enrich(await visaRepo.getByStudentId(userId));
  }

  async getById(id: string, userId: string, role: string): Promise<SafeVisaCase> {
    const visaCase = await visaRepo.getById(id);
    if (!visaCase) throw new HttpException(404, "Visa case not found");
    if (role === "student" && visaCase.studentId !== userId) throw new HttpException(403, "You can only access your own visa cases");
    if (role === "counsellor") {
      const counsellor = await counsellorRepo.getByUserId(userId);
      if (!counsellor || counsellor._id.toString() !== visaCase.counsellorId) {
        throw new HttpException(403, "This visa case is not assigned to you");
      }
    }
    return (await enrich([visaCase]))[0];
  }

  async update(id: string, data: UpdateVisaCaseDTOType, userId: string, role: string): Promise<SafeVisaCase> {
    const visaCase = await visaRepo.getById(id);
    if (!visaCase) throw new HttpException(404, "Visa case not found");
    if (role === "counsellor") {
      const counsellor = await counsellorRepo.getByUserId(userId);
      if (!counsellor || counsellor._id.toString() !== visaCase.counsellorId) {
        throw new HttpException(403, "This visa case is not assigned to you");
      }
      if (data.counsellorId !== undefined) throw new HttpException(403, "Only administrators can reassign visa cases");
    }
    if (data.counsellorId) {
      const assigned = await counsellorRepo.getById(data.counsellorId);
      if (!assigned) throw new HttpException(404, "Counsellor not found");
    }

    const updated = await visaRepo.update(id, data);
    if (!updated) throw new HttpException(500, "Failed to update visa case");

    await notificationService.notify({
      userId: visaCase.studentId,
      title: updated.status === "approved" ? "Visa approved" : updated.status === "refused" ? "Visa decision update" : "Visa case updated",
      message: `Your ${updated.country} visa case is now ${updated.status.replaceAll("-", " ")}.`,
      type: updated.status === "approved" ? "success" : updated.status === "refused" ? "error" : "info",
      category: "visa",
      link: "/visa",
      metadata: { visaCaseId: id },
    });

    if (data.counsellorId && data.counsellorId !== visaCase.counsellorId) {
      const assigned = await counsellorRepo.getById(data.counsellorId);
      if (assigned) await notificationService.notify({
        userId: assigned.userId,
        title: "Visa case assigned",
        message: `A ${updated.country} visa case has been assigned to you.`,
        category: "visa",
        link: "/visa",
        metadata: { visaCaseId: id },
      });
    }
    return (await enrich([updated]))[0];
  }

  async delete(id: string): Promise<void> {
    if (!(await visaRepo.delete(id))) throw new HttpException(404, "Visa case not found");
  }
}

export const visaService = new VisaService();
