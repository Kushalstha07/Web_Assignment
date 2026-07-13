import { VisaCaseModel, IVisaCase } from "../models/visa.model";
import { VisaCaseType } from "../types/visa.type";
import { UpdateVisaCaseDTOType } from "../dtos/visa.dto";

export class VisaCaseMongoRepository {
  async create(data: VisaCaseType): Promise<IVisaCase> {
    const created = await VisaCaseModel.create(data);
    return created.toObject() as IVisaCase;
  }

  async getById(id: string): Promise<IVisaCase | null> {
    const found = await VisaCaseModel.findById(id);
    return found ? found.toObject() as IVisaCase : null;
  }

  async getByApplicationId(applicationId: string): Promise<IVisaCase | null> {
    const found = await VisaCaseModel.findOne({ applicationId });
    return found ? found.toObject() as IVisaCase : null;
  }

  async getByStudentId(studentId: string): Promise<IVisaCase[]> {
    const cases = await VisaCaseModel.find({ studentId }).sort({ updatedAt: -1 });
    return cases.map((item) => item.toObject() as IVisaCase);
  }

  async getByCounsellorId(counsellorId: string): Promise<IVisaCase[]> {
    const cases = await VisaCaseModel.find({ counsellorId }).sort({ updatedAt: -1 });
    return cases.map((item) => item.toObject() as IVisaCase);
  }

  async getAll(): Promise<IVisaCase[]> {
    const cases = await VisaCaseModel.find().sort({ updatedAt: -1 });
    return cases.map((item) => item.toObject() as IVisaCase);
  }

  async update(id: string, data: UpdateVisaCaseDTOType): Promise<IVisaCase | null> {
    const updated = await VisaCaseModel.findByIdAndUpdate(
      id,
      { $set: data },
      { returnDocument: "after", runValidators: true },
    );
    return updated ? updated.toObject() as IVisaCase : null;
  }

  async delete(id: string): Promise<boolean> {
    return (await VisaCaseModel.findByIdAndDelete(id)) !== null;
  }
}
