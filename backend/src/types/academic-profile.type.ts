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
  highestQualification: z.enum(qualifications, {
    error: "Qualification is required",
  }),
  institution: z.string().min(1, "Institution name is required"),
  graduationYear: z.number().int().min(1990).max(new Date().getFullYear() + 5, "Invalid graduation year"),
  gpa: z.number().min(0).max(4.0, "GPA must be between 0 and 4.0").optional(),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  testType: z.enum(testTypes).optional(),
  testScore: z.number().min(0).max(120, "Invalid test score").optional(),
  preferredCountries: z.array(z.string()).optional(),
  tuitionBudget: z.string().optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  profileStrength: z.number().min(0).max(100).optional(),
  onboardingStep: z.number().int().min(1).max(5).optional(),
  onboardingCompletedAt: z.date().optional(),
});

export type AcademicProfileType = z.infer<typeof AcademicProfileSchema>;
