import { z } from "zod";
import { scholarshipStatuses, scholarshipTypes } from "../types/scholarship.type";

export const CreateScholarshipDTO = z.object({
  name: z.string().min(1, "Name is required"),
  provider: z.string().min(1, "Provider is required"),
  type: z.enum(scholarshipTypes),
  amount: z.number().min(0),
  currency: z.string().optional(),
  description: z.string().max(2000).optional(),
  eligibility: z.string().max(2000).optional(),
  requirements: z.array(z.string()).optional(),
  countries: z.array(z.string()).optional(),
  universities: z.array(z.string()).optional(),
  deadline: z.string().optional(),
  status: z.enum(scholarshipStatuses).optional(),
  applicationUrl: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const UpdateScholarshipDTO = z.object({
  name: z.string().optional(),
  provider: z.string().optional(),
  type: z.enum(scholarshipTypes).optional(),
  amount: z.number().min(0).optional(),
  currency: z.string().optional(),
  description: z.string().max(2000).optional(),
  eligibility: z.string().max(2000).optional(),
  requirements: z.array(z.string()).optional(),
  countries: z.array(z.string()).optional(),
  universities: z.array(z.string()).optional(),
  deadline: z.string().optional(),
  status: z.enum(scholarshipStatuses).optional(),
  applicationUrl: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const ScholarshipFilterDTO = z.object({
  type: z.enum(scholarshipTypes).optional(),
  country: z.string().optional(),
  status: z.enum(scholarshipStatuses).optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export type CreateScholarshipDTOType = z.infer<typeof CreateScholarshipDTO>;
export type UpdateScholarshipDTOType = z.infer<typeof UpdateScholarshipDTO>;
export type ScholarshipFilterDTOType = z.infer<typeof ScholarshipFilterDTO>;