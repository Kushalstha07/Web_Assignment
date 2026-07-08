import mongoose, { Schema, Document } from "mongoose";
import { UniversityType, countries, rankingLevels, courseTypes, budgetRanges } from "../types/university.type";

export interface IUniversity extends Document, UniversityType {}

const UniversitySchema = new Schema<IUniversity>(
  {
    name: { type: String, required: true, index: true },
    country: { type: String, required: true, enum: countries },
    city: { type: String, required: true },
    ranking: { type: String, required: true, enum: rankingLevels },
    worldRanking: { type: Number },
    courseType: { type: String, required: true, enum: courseTypes },
    tuitionFee: { type: Number, required: true },
    budgetRange: { type: String, required: true, enum: budgetRanges },
    applicationFee: { type: Number },
    description: { type: String, maxlength: 2000 },
    programs: [{ type: String }],
    rating: { type: Number, min: 0, max: 5 },
    matchScore: { type: Number, min: 0, max: 100 },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UniversitySchema.index({ country: 1, courseType: 1 });
UniversitySchema.index({ budgetRange: 1 });
UniversitySchema.index({ name: "text", description: "text" });

export const University = mongoose.model<IUniversity>("University", UniversitySchema);