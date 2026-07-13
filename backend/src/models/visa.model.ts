import mongoose, { Document, Schema } from "mongoose";
import { VisaCaseType, visaStatuses } from "../types/visa.type";

export interface IVisaCase extends VisaCaseType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VisaCaseMongoSchema = new Schema<IVisaCase>({
  applicationId: { type: String, required: true, unique: true, ref: "Application" },
  studentId: { type: String, required: true, index: true, ref: "User" },
  counsellorId: { type: String, default: null, index: true, ref: "Counsellor" },
  country: { type: String, required: true, trim: true },
  visaType: { type: String, required: true, trim: true },
  status: { type: String, enum: visaStatuses, default: "documents-preparing", index: true },
  referenceNumber: { type: String, trim: true, default: null },
  submissionDate: { type: String, default: null },
  appointmentDate: { type: String, default: null },
  decisionDate: { type: String, default: null },
  notes: { type: String, maxlength: 2000, default: "" },
}, { timestamps: true });

export const VisaCaseModel = mongoose.model<IVisaCase>("VisaCase", VisaCaseMongoSchema);
