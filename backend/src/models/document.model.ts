import mongoose, { Schema, Document } from "mongoose";
import { DocumentType, documentStatuses, documentCategories } from "../types/document.type";

export interface IDocument extends DocumentType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentMongoSchema: Schema<IDocument> = new Schema(
  {
    userId: { type: String, required: true, ref: "User" },
    fileName: { type: String, required: true, trim: true },
    originalName: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true, min: 1 },
    category: { type: String, enum: documentCategories, required: true },
    status: { type: String, enum: documentStatuses, default: "pending" },
    url: { type: String, required: true },
    notes: { type: String, maxlength: 500, default: "" },
    verifiedBy: { type: String, default: null },
    verifiedAt: { type: String, default: null },
  },
  { timestamps: true },
);

DocumentMongoSchema.index({ userId: 1 });
DocumentMongoSchema.index({ status: 1 });
DocumentMongoSchema.index({ category: 1 });

export const DocumentModel = mongoose.model<IDocument>("Document", DocumentMongoSchema);