import { ApplicationMongoRepository, IApplicationRepository } from "../repositories/application.repository";
import { ApplicationType, applicationStatuses } from "../types/application.type";
import { CreateApplicationDTOType, UpdateApplicationDTOType, SubmitApplicationDTOType } from "../dtos/application.dto";
import { HttpException } from "../exceptions/http-exception";
import { IApplication } from "../models/application.model";
import { CounsellorMongoRepository } from "../repositories/counsellor.repository";
import { UserModel } from "../models/user.model";
import { notificationService } from "./notification.service";

const appRepo = new ApplicationMongoRepository();
const counsellorRepo = new CounsellorMongoRepository();

export type SafeApplication = {
  id: string;
  studentId: string;
  studentName?: string;
  counsellorId?: string | null;
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

function toSafeApplication(a: IApplication, studentName?: string): SafeApplication {
  const doc = a as IApplication & { createdAt?: Date; updatedAt?: Date };
  return {
    id: a._id.toString(),
    studentId: a.studentId,
    studentName,
    counsellorId: a.counsellorId || null,
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
  private async canAccess(
    application: IApplication,
    userId: string,
    role: string,
  ): Promise<boolean> {
    if (role === "admin") return true;
    if (role === "student") return application.studentId === userId;
    if (role === "counsellor") {
      const counsellor = await counsellorRepo.getByUserId(userId);
      return counsellor?._id.toString() === application.counsellorId;
    }
    return false;
  }

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
    if (!(await this.canAccess(app, userId, role))) {
      throw new HttpException(403, "You can only access your own applications");
    }
    return toSafeApplication(app);
  }

  async getMyApplications(studentId: string): Promise<SafeApplication[]> {
    const apps = await appRepo.getByStudentId(studentId);
    return apps.map((application) => toSafeApplication(application));
  }

  async getAssignedApplications(userId: string): Promise<SafeApplication[]> {
    const counsellor = await counsellorRepo.getByUserId(userId);
    if (!counsellor) throw new HttpException(404, "Counsellor profile not found");
    const apps = await appRepo.getByCounsellorId(counsellor._id.toString());
    const studentIds = [...new Set(apps.map((application) => application.studentId))];
    const students = await UserModel.find({ _id: { $in: studentIds } })
      .select("fullName")
      .lean();
    const names = new Map(students.map((student) => [student._id.toString(), student.fullName]));
    return apps.map((application) =>
      toSafeApplication(application, names.get(application.studentId)),
    );
  }

  async getAll(page: number, limit: number, search?: string): Promise<{ data: SafeApplication[]; total: number }> {
    const result = await appRepo.getAllPaginated(page, limit, search);
    return {
      data: result.data.map((application) => toSafeApplication(application)),
      total: result.total,
    };
  }

  async update(id: string, data: UpdateApplicationDTOType, userId: string, role: string): Promise<SafeApplication> {
    const app = await appRepo.getById(id);
    if (!app) throw new HttpException(404, "Application not found");
    if (!(await this.canAccess(app, userId, role))) {
      throw new HttpException(403, "You can only update your own applications");
    }
    if (data.counsellorId) {
      const counsellor = await counsellorRepo.getById(data.counsellorId);
      if (!counsellor) throw new HttpException(404, "Counsellor not found");
    }
    const updated = await appRepo.update(id, data);
    if (!updated) throw new HttpException(500, "Failed to update application");

    if (data.counsellorId && data.counsellorId !== app.counsellorId) {
      const counsellor = await counsellorRepo.getById(data.counsellorId);
      if (counsellor) {
        await notificationService.notify({
          userId: counsellor.userId,
          title: "New application assigned",
          message: `You have been assigned an application for ${updated.program}.`,
          type: "info",
          category: "application",
          link: "/applications",
          metadata: { applicationId: id },
        });
      }
      await notificationService.notify({
        userId: app.studentId,
        title: "Counsellor assigned",
        message: "A counsellor has been assigned to support your application.",
        type: "info",
        category: "application",
        link: "/applications",
        metadata: { applicationId: id },
      });
    }

    const statusChanged = data.status !== undefined && data.status !== app.status;
    const stageChanged = data.stage !== undefined && data.stage !== app.stage;
    if (role !== "student" && (statusChanged || stageChanged)) {
      const update = statusChanged ? `status is now ${updated.status}` : `stage is now ${updated.stage}`;
      await notificationService.notify({
        userId: app.studentId,
        title: "Application updated",
        message: `Your ${updated.program} application ${update}.`,
        type: updated.status === "accepted" ? "success" : updated.status === "rejected" ? "error" : "info",
        category: "application",
        link: "/applications",
        metadata: { applicationId: id },
      });
    }
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
    await notificationService.notify({
      userId,
      title: "Application submitted",
      message: `Your ${updated.program} application was submitted successfully.`,
      type: "success",
      category: "application",
      link: "/applications",
      metadata: { applicationId: id },
    });
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
