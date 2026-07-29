import { z } from "zod";
import { qualifications, testTypes } from "../types/academic-profile.type";

const preferredCountries = ["usa", "uk", "canada", "australia", "europe"] as const;
const tuitionBudgets = ["under-10k", "10k-20k", "20k-35k", "35k-plus"] as const;

export const CreateAcademicProfileSchema = z.object({
  highestQualification: z.enum(qualifications, {
    error: "Qualification is required",
  }),
  institution: z.string().min(1, "Institution name is required"),
  graduationYear: z.coerce.number().int().min(1990).max(new Date().getFullYear() + 5, "Invalid graduation year"),
  gpa: z.coerce.number().min(0).max(4.0).optional(),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  testType: z.enum(testTypes).optional(),
  testScore: z.coerce.number().min(0).max(800).optional(),
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
  institution: z.string().trim().min(1, "Institution name is required"),
  graduationYear: z.coerce.number().int().min(1990).max(new Date().getFullYear() + 5, "Invalid year"),
  fieldOfStudy: z.string().trim().min(1, "Field of study is required"),
});

export type Step1PersonalDTO = z.infer<typeof Step1PersonalSchema>;

export const Step2AcademicSchema = z.object({
  gpa: z.coerce.number().min(0).max(4.0).optional(),
  testType: z.enum(testTypes).optional(),
  testScore: z.coerce.number().min(0).max(800).optional(),
}).superRefine((value, context) => {
  if (Boolean(value.testType) !== (value.testScore !== undefined)) {
    context.addIssue({ code: "custom", path: [value.testType ? "testScore" : "testType"], message: "Test type and score must be provided together" });
  }
  const limits = { IELTS: 9, TOEFL: 120, GRE: 340, GMAT: 800 } as const;
  if (value.testType && value.testScore !== undefined && value.testScore > limits[value.testType]) {
    context.addIssue({ code: "custom", path: ["testScore"], message: `${value.testType} score cannot exceed ${limits[value.testType]}` });
  }
});

export type Step2AcademicDTO = z.infer<typeof Step2AcademicSchema>;

export const Step3PreferencesSchema = z.object({
  preferredCountries: z.array(z.enum(preferredCountries)).min(1, "Select at least one preferred country"),
  tuitionBudget: z.enum(tuitionBudgets, { error: "Select a tuition budget" }),
});

export type Step3PreferencesDTO = z.infer<typeof Step3PreferencesSchema>;

export const CreateAcademicProfileDTO = CreateAcademicProfileSchema;
export type CreateAcademicProfileDTOType = z.infer<typeof CreateAcademicProfileDTO>;
