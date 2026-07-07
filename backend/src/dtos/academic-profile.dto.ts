import { z } from "zod";
import { qualifications, testTypes } from "../types/academic-profile.type";

export const CreateAcademicProfileSchema = z.object({
  highestQualification: z.enum(qualifications, {
    error: "Qualification is required",
  }),
  institution: z.string().min(1, "Institution name is required"),
  graduationYear: z.coerce.number().int().min(1990).max(new Date().getFullYear() + 5, "Invalid graduation year"),
  gpa: z.coerce.number().min(0).max(4.0).optional(),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  testType: z.enum(testTypes).optional(),
  testScore: z.coerce.number().min(0).max(120).optional(),
  preferredCountries: z.array(z.string()).optional(),
  tuitionBudget: z.string().optional(),
  bio: z.string().max(500).optional(),
});

export type CreateAcademicProfileDTO = z.infer<typeof CreateAcademicProfileSchema>;

export const UpdateAcademicProfileSchema = CreateAcademicProfileSchema.partial();

export type UpdateAcademicProfileDTO = z.infer<typeof UpdateAcademicProfileSchema>;

// Per-step partial schemas for 5-step wizard
export const Step1PersonalSchema = z.object({
  highestQualification: z.enum(qualifications, { error: "Qualification is required" }),
  institution: z.string().min(1, "Institution name is required"),
  graduationYear: z.coerce.number().int().min(1990).max(2035, "Invalid year"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
});

export type Step1PersonalDTO = z.infer<typeof Step1PersonalSchema>;

export const Step2AcademicSchema = z.object({
  gpa: z.coerce.number().min(0).max(4.0).optional(),
  testType: z.enum(testTypes).optional(),
  testScore: z.coerce.number().min(0).max(120).optional(),
});

export type Step2AcademicDTO = z.infer<typeof Step2AcademicSchema>;

export const Step3PreferencesSchema = z.object({
  preferredCountries: z.array(z.string()).optional().default([]),
  tuitionBudget: z.string().optional(),
});

export type Step3PreferencesDTO = z.infer<typeof Step3PreferencesSchema>;

export const CreateAcademicProfileDTO = CreateAcademicProfileSchema;
export type CreateAcademicProfileDTOType = z.infer<typeof CreateAcademicProfileDTO>;