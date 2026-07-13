import { ApplicationModel, IApplication } from "../models/application.model";
import { ApplicationType } from "../types/application.type";
import { UpdateApplicationDTOType } from "../dtos/application.dto";

export interface IApplicationRepository {
  create(data: ApplicationType): Promise<IApplication>;
  getById(id: string): Promise<IApplication | null>;
  getByStudentId(studentId: string): Promise<IApplication[]>;
  getByCounsellorId(counsellorId: string): Promise<IApplication[]>;
  getByUniversityId(universityId: string): Promise<IApplication[]>;
  getByStatus(status: string): Promise<IApplication[]>;
  getAll(): Promise<IApplication[]>;
  update(id: string, data: UpdateApplicationDTOType): Promise<IApplication | null>;
  delete(id: string): Promise<boolean>;
  getAllPaginated(page: number, limit: number, search?: string): Promise<{ data: IApplication[]; total: number }>;
}

export class ApplicationMongoRepository implements IApplicationRepository {
  async create(data: ApplicationType): Promise<IApplication> {
    const created = await ApplicationModel.create(data);
    return created.toObject() as IApplication;
  }

  async getById(id: string): Promise<IApplication | null> {
    const app = await ApplicationModel.findById(id);
    return app ? (app.toObject() as IApplication) : null;
  }

  async getByStudentId(studentId: string): Promise<IApplication[]> {
    const apps = await ApplicationModel.find({ studentId }).sort({ createdAt: -1 });
    return apps.map((a) => a.toObject() as IApplication);
  }

  async getByCounsellorId(counsellorId: string): Promise<IApplication[]> {
    const apps = await ApplicationModel.find({ counsellorId }).sort({ updatedAt: -1 });
    return apps.map((application) => application.toObject() as IApplication);
  }

  async getByUniversityId(universityId: string): Promise<IApplication[]> {
    const apps = await ApplicationModel.find({ universityId }).sort({ createdAt: -1 });
    return apps.map((a) => a.toObject() as IApplication);
  }

  async getByStatus(status: string): Promise<IApplication[]> {
    const apps = await ApplicationModel.find({ status: status as any }).sort({ createdAt: -1 });
    return apps.map((a) => a.toObject() as IApplication);
  }

  async getAll(): Promise<IApplication[]> {
    const apps = await ApplicationModel.find().sort({ createdAt: -1 });
    return apps.map((a) => a.toObject() as IApplication);
  }

  async update(id: string, data: UpdateApplicationDTOType): Promise<IApplication | null> {
    const updated = await ApplicationModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    return updated ? (updated.toObject() as IApplication) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ApplicationModel.findByIdAndDelete(id);
    return result !== null;
  }

  async getAllPaginated(page: number, limit: number, search?: string): Promise<{ data: IApplication[]; total: number }> {
    const query: Record<string, any> = {};
    if (search) {
      query.$or = [
        { program: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
      ];
    }
    const [data, total] = await Promise.all([
      ApplicationModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ApplicationModel.countDocuments(query),
    ]);
    return { data: data.map((a) => a.toObject() as IApplication), total };
  }
}
