import mongoose, { Schema, Document } from "mongoose";
import { ScholarshipType, scholarshipStatuses, scholarshipTypes } from "../types/scholarship.type";

export interface IScholarship extends ScholarshipType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ScholarshipMongoSchema: Schema<IScholarship> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    provider: { type: String, required: true, trim: true },
    type: { type: String, enum: scholarshipTypes, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    description: { type: String, maxlength: 2000, default: "" },
    eligibility: { type: String, maxlength: 2000, default: "" },
    requirements: { type: [String], default: [] },
    countries: { type: [String], default: [] },
    universities: { type: [String], default: [] },
    deadline: { type: String, default: null },
    status: { type: String, enum: scholarshipStatuses, default: "active" },
    applicationUrl: { type: String, default: null },
    imageUrl: { type: String, default: null },
  },
  { timestamps: true },
);

ScholarshipMongoSchema.index({ status: 1 });
ScholarshipMongoSchema.index({ type: 1 });
ScholarshipMongoSchema.index({ countries: 1 });

export const ScholarshipModel = mongoose.model<IScholarship>("Scholarship", ScholarshipMongoSchema);