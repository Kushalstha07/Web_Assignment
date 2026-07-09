import { ApplicationMongoRepository, IApplicationRepository } from "../repositories/application.repository";
import { ApplicationType, applicationStatuses } from "../types/application.type";
import { CreateApplicationDTOType, UpdateApplicationDTOType, SubmitApplicationDTOType } from "../dtos/application.dto";
import { HttpException } from "../exceptions/http-exception";
import { IApplication } from "../models/application.model";

const appRepo = new ApplicationMongoRepository();

export type SafeApplication = {
  id: string;
  studentId: string;
  universityId: string;
  program: string;
  status: string;
  stage: string;
  submittedDate?: string;
  decisionDate?: string;
  notes?: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
};

function toSafeApplication(a: IApplication): SafeApplication {
  const doc = a as IApplication & { createdAt?: Date; updatedAt?: Date };
  return {
    id: a._id.toString(),
    studentId: a.studentId,
    universityId: a.universityId,
    program: a.program,
    status: a.status,
    stage: a.stage,
    submittedDate: a.submittedDate,
    decisionDate: a.decisionDate,
    notes: a.notes,
    documents: a.documents || [],
    createdAt: doc.createdAt?.toISOString?.() || String(doc.createdAt),
    updatedAt: doc.updatedAt?.toISOString?.() || String(doc.updatedAt),
  };
}

export class ApplicationService {
  async create(data: CreateApplicationDTOType, studentId: string): Promise<SafeApplication> {
    const appData: ApplicationType = {
      studentId,
      universityId: data.universityId,
      program: data.program,
      status: "draft",
      stage: "documents-pending",
      notes: data.notes,
      documents: [],
    };
    const created = await appRepo.create(appData);
    return toSafeApplication(created);
  }

  async getById(id: string, userId: string, role: string): Promise<SafeApplication> {
    const app = await appRepo.getById(id);
    if (!app) throw new HttpException(404, "Application not found");
    if (role !== "admin" && app.studentId !== userId) {
      throw new HttpException(403, "You can only access your own applications");
    }
    return toSafeApplication(app);
  }

  async getMyApplications(studentId: string): Promise<SafeApplication[]> {
    const apps = await appRepo.getByStudentId(studentId);
    return apps.map(toSafeApplication);
  }

  async getAll(page: number, limit: number, search?: string): Promise<{ data: SafeApplication[]; total: number }> {
    const result = await appRepo.getAllPaginated(page, limit, search);
    return { data: result.data.map(toSafeApplication), total: result.total };
  }

  async update(id: string, data: UpdateApplicationDTOType, userId: string, role: string): Promise<SafeApplication> {
    const app = await appRepo.getById(id);
    if (!app) throw new HttpException(404, "Application not found");
    if (role !== "admin" && app.studentId !== userId) {
      throw new HttpException(403, "You can only update your own applications");
    }
    const updated = await appRepo.update(id, data);
    if (!updated) throw new HttpException(500, "Failed to update application");
    return toSafeApplication(updated);
  }

  async submit(id: string, data: SubmitApplicationDTOType, userId: string): Promise<SafeApplication> {
    const app = await appRepo.getById(id);
    if (!app) throw new HttpException(404, "Application not found");
    if (app.studentId !== userId) throw new HttpException(403, "You can only submit your own applications");
    if (app.status !== "draft") throw new HttpException(400, "Only draft applications can be submitted");

    const updated = await appRepo.update(id, {
      status: "submitted",
      stage: "documents-uploaded",
      submittedDate: data.submittedDate,
    } as any);
    if (!updated) throw new HttpException(500, "Failed to submit application");
    return toSafeApplication(updated);
  }

  async delete(id: string, userId: string, role: string): Promise<boolean> {
    const app = await appRepo.getById(id);
    if (!app) throw new HttpException(404, "Application not found");
    if (role !== "admin" && app.studentId !== userId) {
      throw new HttpException(403, "You can only delete your own applications");
    }
    return appRepo.delete(id);
  }
}

export const applicationService = new ApplicationService();