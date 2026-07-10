import { AppointmentMongoRepository } from "../repositories/appointment.repository";
import { AppointmentType } from "../types/appointment.type";
import { CreateAppointmentDTOType, UpdateAppointmentDTOType, CancelAppointmentDTOType } from "../dtos/appointment.dto";
import { HttpException } from "../exceptions/http-exception";
import { IAppointment } from "../models/appointment.model";

const appointmentRepo = new AppointmentMongoRepository();

export type SafeAppointment = {
  id: string;
  studentId: string;
  counsellorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  meetingLink?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
};

function toSafeAppointment(a: IAppointment): SafeAppointment {
  const doc = a as IAppointment & { createdAt?: Date; updatedAt?: Date };
  return {
    id: a._id.toString(),
    studentId: a.studentId,
    counsellorId: a.counsellorId,
    date: a.date,
    startTime: a.startTime,
    endTime: a.endTime,
    status: a.status,
    notes: a.notes,
    meetingLink: a.meetingLink,
    cancellationReason: a.cancellationReason,
    createdAt: doc.createdAt?.toISOString?.() || String(doc.createdAt),
    updatedAt: doc.updatedAt?.toISOString?.() || String(doc.updatedAt),
  };
}

export class AppointmentService {
  async create(data: CreateAppointmentDTOType, studentId: string): Promise<SafeAppointment> {
    const appData: AppointmentType = {
      studentId,
      counsellorId: data.counsellorId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      status: "scheduled",
      notes: data.notes,
    };
    const created = await appointmentRepo.create(appData);
    return toSafeAppointment(created);
  }

  async getById(id: string, userId: string, role: string): Promise<SafeAppointment> {
    const app = await appointmentRepo.getById(id);
    if (!app) throw new HttpException(404, "Appointment not found");
    if (role !== "admin" && app.studentId !== userId && app.counsellorId !== userId) {
      throw new HttpException(403, "You can only access your own appointments");
    }
    return toSafeAppointment(app);
  }

  async getMyAppointments(studentId: string): Promise<SafeAppointment[]> {
    const apps = await appointmentRepo.getByStudentId(studentId);
    return apps.map(toSafeAppointment);
  }

  async getByCounsellor(counsellorId: string): Promise<SafeAppointment[]> {
    const apps = await appointmentRepo.getByCounsellorId(counsellorId);
    return apps.map(toSafeAppointment);
  }

  async getByDateRange(startDate: string, endDate: string): Promise<SafeAppointment[]> {
    const apps = await appointmentRepo.getByDateRange(startDate, endDate);
    return apps.map(toSafeAppointment);
  }

  async getAll(page: number, limit: number, search?: string): Promise<{ data: SafeAppointment[]; total: number }> {
    const result = await appointmentRepo.getAllPaginated(page, limit, search);
    return { data: result.data.map(toSafeAppointment), total: result.total };
  }

  async cancel(id: string, data: CancelAppointmentDTOType, userId: string, role: string): Promise<SafeAppointment> {
    const app = await appointmentRepo.getById(id);
    if (!app) throw new HttpException(404, "Appointment not found");
    if (role !== "admin" && app.studentId !== userId && app.counsellorId !== userId) {
      throw new HttpException(403, "You can only cancel your own appointments");
    }
    const updated = await appointmentRepo.update(id, {
      status: "cancelled" as any,
      cancellationReason: data.cancellationReason,
    } as any);
    if (!updated) throw new HttpException(500, "Failed to cancel appointment");
    return toSafeAppointment(updated);
  }

  async update(id: string, data: UpdateAppointmentDTOType, userId: string, role: string): Promise<SafeAppointment> {
    const app = await appointmentRepo.getById(id);
    if (!app) throw new HttpException(404, "Appointment not found");
    if (role !== "admin" && app.studentId !== userId && app.counsellorId !== userId) {
      throw new HttpException(403, "You can only update your own appointments");
    }
    const updated = await appointmentRepo.update(id, data);
    if (!updated) throw new HttpException(500, "Failed to update appointment");
    return toSafeAppointment(updated);
  }
}

export const appointmentService = new AppointmentService();