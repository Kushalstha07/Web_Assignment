import { z } from "zod";

export const scholarshipApplicationStatuses = ["submitted", "under-review", "approved", "rejected", "withdrawn"] as const;

export const ScholarshipApplicationSchema = z.object({
  scholarshipId: z.string().min(1),
  studentId: z.string().min(1),
  status: z.enum(scholarshipApplicationStatuses).default("submitted"),
  statement: z.string().trim().min(10).max(2000),
  academicSummary: z.string().trim().max(1000).optional(),
  financialNeed: z.string().trim().max(1000).optional(),
  notes: z.string().trim().max(1000).optional(),
  submittedAt: z.string().min(1),
  reviewedAt: z.string().optional(),
});

export type ScholarshipApplicationType = z.infer<typeof ScholarshipApplicationSchema>;
export type ScholarshipApplicationStatus = (typeof scholarshipApplicationStatuses)[number];
