import mongoose, { Schema, Document } from "mongoose";
import {
  budgets,
  destinations,
  intakes,
  studyLevels,
  UserType,
} from "../types/user.type";

export interface IUser extends UserType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordTokenHash?: string;
  resetPasswordExpiresAt?: Date;
  passwordChangedAt?: Date;
  sessionVersion: number;
}

const UserMongoSchema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    studyLevel: {
      type: String,
      enum: studyLevels,
      required: false,
    },

    destination: {
      type: String,
      enum: destinations,
      required: false,
    },

    fieldOfStudy: {
      type: String,
      required: false,
      trim: true,
    },

    intake: {
      type: String,
      enum: intakes,
      required: false,
    },

    budget: {
      type: String,
      enum: budgets,
      required: false,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "counsellor", "student"],
      default: "student",
    },

    profileImage: {
      type: String,
      default: null,
    },
    resetPasswordTokenHash: {
      type: String,
      select: false,
      default: null,
    },
    resetPasswordExpiresAt: {
      type: Date,
      select: false,
      default: null,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
      default: null,
    },
    sessionVersion: {
      type: Number,
      select: false,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<IUser>("User", UserMongoSchema);
