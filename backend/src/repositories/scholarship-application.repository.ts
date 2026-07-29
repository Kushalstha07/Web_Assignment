import { ScholarshipApplicationModel, IScholarshipApplication } from "../models/scholarship-application.model";
import { ScholarshipApplicationType } from "../types/scholarship-application.type";
import { UpdateScholarshipApplicationDTOType } from "../dtos/scholarship-application.dto";

export class ScholarshipApplicationMongoRepository {
  async create(data: ScholarshipApplicationType): Promise<IScholarshipApplication> {
    const created = await ScholarshipApplicationModel.create(data);
    return created.toObject() as IScholarshipApplication;
  }

  async getById(id: string): Promise<IScholarshipApplication | null> {
    const doc = await ScholarshipApplicationModel.findById(id);
    return doc ? (doc.toObject() as IScholarshipApplication) : null;
  }

  async getByScholarshipAndStudent(scholarshipId: string, studentId: string): Promise<IScholarshipApplication | null> {
    const doc = await ScholarshipApplicationModel.findOne({ scholarshipId, studentId });
    return doc ? (doc.toObject() as IScholarshipApplication) : null;
  }

  async getByStudentId(studentId: string): Promise<IScholarshipApplication[]> {
    const docs = await ScholarshipApplicationModel.find({ studentId }).sort({ createdAt: -1 });
    return docs.map((doc) => doc.toObject() as IScholarshipApplication);
  }

  async getAll(): Promise<IScholarshipApplication[]> {
    const docs = await ScholarshipApplicationModel.find().sort({ createdAt: -1 });
    return docs.map((doc) => doc.toObject() as IScholarshipApplication);
  }

  async update(id: string, data: UpdateScholarshipApplicationDTOType & { reviewedAt?: string }): Promise<IScholarshipApplication | null> {
    const updated = await ScholarshipApplicationModel.findByIdAndUpdate(id, { $set: data }, { returnDocument: "after", runValidators: true });
    return updated ? (updated.toObject() as IScholarshipApplication) : null;
  }
}
