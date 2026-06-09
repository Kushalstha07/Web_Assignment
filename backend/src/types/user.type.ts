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

export const UserSchema = z.object({
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
    .min(6, "Password must be at least 6 character long"),

  role: z.enum(["admin", "user"]).default("user"),
});

export type UserType = z.infer<typeof UserSchema>;
