import mongoose, { Document, Schema } from "mongoose";
import { ScholarshipApplicationType, scholarshipApplicationStatuses } from "../types/scholarship-application.type";

export interface IScholarshipApplication extends ScholarshipApplicationType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ScholarshipApplicationMongoSchema: Schema<IScholarshipApplication> = new Schema(
  {
    scholarshipId: { type: String, required: true, ref: "Scholarship", index: true },
    studentId: { type: String, required: true, ref: "User", index: true },
    status: { type: String, enum: scholarshipApplicationStatuses, default: "submitted", index: true },
    statement: { type: String, required: true, maxlength: 2000 },
    academicSummary: { type: String, maxlength: 1000, default: "" },
    financialNeed: { type: String, maxlength: 1000, default: "" },
    notes: { type: String, maxlength: 1000, default: "" },
    submittedAt: { type: String, required: true },
    reviewedAt: { type: String, default: null },
  },
  { timestamps: true },
);

ScholarshipApplicationMongoSchema.index({ scholarshipId: 1, studentId: 1 }, { unique: true });

export const ScholarshipApplicationModel = mongoose.model<IScholarshipApplication>("ScholarshipApplication", ScholarshipApplicationMongoSchema);
