import mongoose, { Schema, Document } from "mongoose";
import { CounsellorType, counsellorSpecialties } from "../types/counsellor.type";

export interface ICounsellor extends CounsellorType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CounsellorMongoSchema: Schema<ICounsellor> = new Schema(
  {
    userId: { type: String, required: true, ref: "User", unique: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    bio: { type: String, maxlength: 1000, default: "" },
    specialties: { type: [String], enum: counsellorSpecialties, default: [] },
    yearsOfExperience: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, min: 0, default: 0 },
    hourlyRate: { type: Number, min: 0, default: 0 },
    available: { type: Boolean, default: true },
    imageUrl: { type: String, default: null },
  },
  { timestamps: true },
);

CounsellorMongoSchema.index({ available: 1 });
CounsellorMongoSchema.index({ specialties: 1 });

export const CounsellorModel = mongoose.model<ICounsellor>("Counsellor", CounsellorMongoSchema);