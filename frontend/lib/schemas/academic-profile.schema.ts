import { z } from "zod";

export const qualifications = [
  "high-school",
  "diploma",
  "bachelor",
  "master",
  "doctorate",
] as const;

export const testTypes = ["IELTS", "TOEFL", "GRE", "GMAT"] as const;

export const AcademicProfileSchema = z.object({
  userId: z.string(),
  highestQualification: z.enum(qualifications),
  institution: z.string().min(1),
  graduationYear: z.number().int().min(1990).max(new Date().getFullYear() + 5),
  gpa: z.number().min(0).max(4.0).optional(),
  fieldOfStudy: z.string().min(1),
  testType: z.enum(testTypes).optional(),
  testScore: z.number().min(0).max(120).optional(),
  preferredCountries: z.array(z.string()).optional(),
  tuitionBudget: z.string().optional(),
  bio: z.string().max(500).optional(),
  profileStrength: z.number().min(0).max(100).optional(),
});

export type AcademicProfile = z.infer<typeof AcademicProfileSchema>;

export const Step1PersonalSchema = z.object({
  highestQualification: z.enum(qualifications),
  institution: z.string().min(1),
  graduationYear: z.coerce.number().int().min(1990).max(2035),
  fieldOfStudy: z.string().min(1),
});

export type Step1Personal = z.infer<typeof Step1PersonalSchema>;

export const Step2AcademicSchema = z.object({
  gpa: z.coerce.number().min(0).max(4.0).optional(),
  testType: z.enum(testTypes).optional(),
  testScore: z.coerce.number().min(0).max(120).optional(),
});

export type Step2Academic = z.infer<typeof Step2AcademicSchema>;

export const Step3PreferencesSchema = z.object({
  preferredCountries: z.array(z.string()).optional().default([]),
  tuitionBudget: z.string().optional(),
});

export type Step3Preferences = z.infer<typeof Step3PreferencesSchema>;