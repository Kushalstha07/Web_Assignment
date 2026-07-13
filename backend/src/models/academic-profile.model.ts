import mongoose, { Schema, Document } from "mongoose";
import { AcademicProfileType, qualifications, testTypes } from "../types/academic-profile.type";

export interface IAcademicProfile extends AcademicProfileType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  onboardingStep: number;
  onboardingCompletedAt?: Date;
}

const AcademicProfileMongoSchema: Schema<IAcademicProfile> = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      ref: "User",
    },
    highestQualification: {
      type: String,
      enum: qualifications,
      required: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    graduationYear: {
      type: Number,
      required: true,
      min: 1990,
      max: new Date().getFullYear() + 5,
    },
    gpa: {
      type: Number,
      min: 0,
      max: 4.0,
    },
    fieldOfStudy: {
      type: String,
      required: true,
      trim: true,
    },
    testType: {
      type: String,
      enum: testTypes,
      default: null,
    },
    testScore: {
      type: Number,
      min: 0,
      max: 800,
    },
    preferredCountries: {
      type: [String],
      default: [],
    },
    tuitionBudget: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    profileStrength: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    onboardingStep: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    onboardingCompletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const AcademicProfileModel = mongoose.model<IAcademicProfile>(
  "AcademicProfile",
  AcademicProfileMongoSchema,
);
