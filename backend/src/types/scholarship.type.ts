import { z } from "zod";

export const scholarshipStatuses = ["active", "expired", "upcoming"] as const;
export const scholarshipTypes = ["merit-based", "need-based", "country-specific", "university-specific", "government", "private"] as const;

export const ScholarshipSchema = z.object({
  name: z.string().min(1, "Name is required"),
  provider: z.string().min(1, "Provider is required"),
  type: z.enum(scholarshipTypes),
  amount: z.number().min(0, "Amount must be positive"),
  currency: z.string().default("USD"),
  description: z.string().max(2000).optional(),
  eligibility: z.string().max(2000).optional(),
  requirements: z.array(z.string()).default([]),
  countries: z.array(z.string()).default([]),
  universities: z.array(z.string()).default([]),
  deadline: z.string().optional(),
  status: z.enum(scholarshipStatuses).default("active"),
  applicationUrl: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type ScholarshipType = z.infer<typeof ScholarshipSchema>;
export type ScholarshipStatus = (typeof scholarshipStatuses)[number];
export type ScholarshipTypeEnum = (typeof scholarshipTypes)[number];