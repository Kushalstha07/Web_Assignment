import { z } from "zod";

export const qualifications = [
  "high-school",
  "diploma",
  "bachelor",
  "master",
  "doctorate",
] as const;

export const testTypes = ["IELTS", "TOEFL", "GRE", "GMAT"] as const;
export const preferredCountries = ["usa", "uk", "canada", "australia", "europe"] as const;
export const tuitionBudgets = ["under-10k", "10k-20k", "20k-35k", "35k-plus"] as const;

export const AcademicProfileSchema = z.object({
  userId: z.string(),
  highestQualification: z.enum(qualifications),
  institution: z.string().min(1),
  graduationYear: z.number().int().min(1990).max(new Date().getFullYear() + 5),
  gpa: z.number().min(0).max(4.0).optional(),
  fieldOfStudy: z.string().min(1),
  testType: z.enum(testTypes).optional(),
  testScore: z.number().min(0).max(800).optional(),
  preferredCountries: z.array(z.string()).optional(),
  tuitionBudget: z.string().optional(),
  bio: z.string().max(500).optional(),
  profileStrength: z.number().min(0).max(100).optional(),
  onboardingStep: z.number().int().min(1).max(5).default(1),
  onboardingCompletedAt: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type AcademicProfile = z.infer<typeof AcademicProfileSchema>;

export const Step1PersonalSchema = z.object({
  highestQualification: z.enum(qualifications),
  institution: z.string().trim().min(1),
  graduationYear: z.coerce.number().int().min(1990).max(new Date().getFullYear() + 5),
  fieldOfStudy: z.string().trim().min(1),
});

export type Step1Personal = z.infer<typeof Step1PersonalSchema>;

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

export type Step2Academic = z.infer<typeof Step2AcademicSchema>;

export const Step3PreferencesSchema = z.object({
  preferredCountries: z.array(z.enum(preferredCountries)).min(1, "Select at least one preferred country"),
  tuitionBudget: z.enum(tuitionBudgets, { error: "Select a tuition budget" }),
});

export type Step3Preferences = z.infer<typeof Step3PreferencesSchema>;
