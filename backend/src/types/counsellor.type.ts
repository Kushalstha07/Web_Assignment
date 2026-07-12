import { z } from "zod";

export const counsellorSpecialties = [
  "university-admissions",
  "visa-guidance",
  "scholarship-advising",
  "career-counseling",
  "test-preparation",
  "general-advising",
] as const;

export const CounsellorSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(10, "Phone must be at least 10 digits"),
  bio: z.string().max(1000, "Bio must be under 1000 characters").optional(),
  specialties: z.array(z.enum(counsellorSpecialties)).default([]),
  yearsOfExperience: z.number().int().min(0).default(0),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  hourlyRate: z.number().min(0).default(0),
  available: z.boolean().default(true),
  imageUrl: z.string().optional(),
});

export type CounsellorType = z.infer<typeof CounsellorSchema>;
export type CounsellorSpecialty = (typeof counsellorSpecialties)[number];