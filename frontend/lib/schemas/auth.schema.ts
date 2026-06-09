import { z } from "zod";

export const studyLevels = [
  "high-school",
  "diploma",
  "undergraduate",
  "postgraduate",
] as const;

export const destinations = [
  "usa",
  "uk",
  "canada",
  "australia",
  "europe",
] as const;

export const intakes = ["spring", "summer", "fall", "winter"] as const;

export const budgets = [
  "under-10k",
  "10k-20k",
  "20k-35k",
  "35k-plus",
] as const;

export const registerSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits long"),
    studyLevel: z.enum(studyLevels, {
      error: "Study level is required",
    }),
    destination: z.enum(destinations, {
      error: "Preferred destination is required",
    }),
    fieldOfStudy: z.string().min(1, "Field of study is required"),
    intake: z.enum(intakes, {
      error: "Preferred intake is required",
    }),
    budget: z.enum(budgets, {
      error: "Budget range is required",
    }),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.literal("on", {
      error: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
