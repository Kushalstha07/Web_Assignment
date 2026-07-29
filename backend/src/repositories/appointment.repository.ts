import { AppointmentModel, IAppointment } from "../models/appointment.model";
import { AppointmentType } from "../types/appointment.type";
import { UpdateAppointmentDTOType } from "../dtos/appointment.dto";

export interface IAppointmentRepository {
  create(data: AppointmentType): Promise<IAppointment>;
  getById(id: string): Promise<IAppointment | null>;
  getByStudentId(studentId: string): Promise<IAppointment[]>;
  getByCounsellorId(counsellorId: string): Promise<IAppointment[]>;
  getByDateRange(startDate: string, endDate: string): Promise<IAppointment[]>;
  getAll(): Promise<IAppointment[]>;
  update(id: string, data: UpdateAppointmentDTOType): Promise<IAppointment | null>;
  delete(id: string): Promise<boolean>;
  getAllPaginated(page: number, limit: number, search?: string): Promise<{ data: IAppointment[]; total: number }>;
}

export class AppointmentMongoRepository implements IAppointmentRepository {
  async create(data: AppointmentType): Promise<IAppointment> {
    const created = await AppointmentModel.create(data);
    return created.toObject() as IAppointment;
  }

  async getById(id: string): Promise<IAppointment | null> {
    const doc = await AppointmentModel.findById(id);
    return doc ? (doc.toObject() as IAppointment) : null;
  }

  async getByStudentId(studentId: string): Promise<IAppointment[]> {
    const docs = await AppointmentModel.find({ studentId }).sort({ date: -1 });
    return docs.map((d) => d.toObject() as IAppointment);
  }

  async getByCounsellorId(counsellorId: string): Promise<IAppointment[]> {
    const docs = await AppointmentModel.find({ counsellorId }).sort({ date: -1 });
    return docs.map((d) => d.toObject() as IAppointment);
  }

  async getByDateRange(startDate: string, endDate: string): Promise<IAppointment[]> {
    const docs = await AppointmentModel.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: 1 });
    return docs.map((d) => d.toObject() as IAppointment);
  }

  async getAll(): Promise<IAppointment[]> {
    const docs = await AppointmentModel.find().sort({ date: -1 });
    return docs.map((d) => d.toObject() as IAppointment);
  }

  async update(id: string, data: UpdateAppointmentDTOType): Promise<IAppointment | null> {
    const updated = await AppointmentModel.findByIdAndUpdate(id, { $set: data }, { returnDocument: "after" });
    return updated ? (updated.toObject() as IAppointment) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await AppointmentModel.findByIdAndDelete(id);
    return result !== null;
  }

  async getAllPaginated(page: number, limit: number, search?: string): Promise<{ data: IAppointment[]; total: number }> {
    const query: Record<string, any> = {};
    if (search) {
      query.$or = [
        { studentId: { $regex: search, $options: "i" } },
        { counsellorId: { $regex: search, $options: "i" } },
      ];
    }
    const [data, total] = await Promise.all([
      AppointmentModel.find(query).sort({ date: -1 }).skip((page - 1) * limit).limit(limit),
      AppointmentModel.countDocuments(query),
    ]);
    return { data: data.map((d) => d.toObject() as IAppointment), total };
  }
}
