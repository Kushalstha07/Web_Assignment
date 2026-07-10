import { z } from "zod";
import { counsellorSpecialties } from "../types/counsellor.type";

export const CreateCounsellorDTO = z.object({
  userId: z.string().min(1, "User ID is required"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(10, "Phone must be at least 10 digits"),
  bio: z.string().max(1000).optional(),
  specialties: z.array(z.enum(counsellorSpecialties)).optional(),
  yearsOfExperience: z.number().int().min(0).optional(),
  hourlyRate: z.number().min(0).optional(),
  imageUrl: z.string().optional(),
});

export const UpdateCounsellorDTO = z.object({
  fullName: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().min(10).optional(),
  bio: z.string().max(1000).optional(),
  specialties: z.array(z.enum(counsellorSpecialties)).optional(),
  yearsOfExperience: z.number().int().min(0).optional(),
  hourlyRate: z.number().min(0).optional(),
  available: z.boolean().optional(),
  imageUrl: z.string().optional(),
});

export type CreateCounsellorDTOType = z.infer<typeof CreateCounsellorDTO>;
export type UpdateCounsellorDTOType = z.infer<typeof UpdateCounsellorDTO>;