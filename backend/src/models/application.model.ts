import mongoose, { Schema, Document } from "mongoose";
import { ApplicationType, applicationStatuses, applicationStages } from "../types/application.type";

export interface IApplication extends ApplicationType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationMongoSchema: Schema<IApplication> = new Schema(
  {
    studentId: {
      type: String,
      required: true,
      ref: "User",
    },
    universityId: {
      type: String,
      required: true,
      ref: "University",
    },
    program: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: applicationStatuses,
      default: "draft",
    },
    stage: {
      type: String,
      enum: applicationStages,
      default: "documents-pending",
    },
    submittedDate: {
      type: String,
      default: null,
    },
    decisionDate: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      maxlength: 1000,
      default: "",
    },
    documents: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

ApplicationMongoSchema.index({ studentId: 1 });
ApplicationMongoSchema.index({ universityId: 1 });
ApplicationMongoSchema.index({ status: 1 });

export const ApplicationModel = mongoose.model<IApplication>(
  "Application",
  ApplicationMongoSchema,
);