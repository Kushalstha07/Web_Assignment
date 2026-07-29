import { z } from "zod";
import { scholarshipApplicationStatuses } from "../types/scholarship-application.type";

export const ApplyScholarshipDTO = z.object({
  statement: z.string().trim().min(10, "Personal statement must be at least 10 characters").max(2000),
  academicSummary: z.string().trim().max(1000).optional(),
  financialNeed: z.string().trim().max(1000).optional(),
});

export const UpdateScholarshipApplicationDTO = z.object({
  status: z.enum(scholarshipApplicationStatuses).optional(),
  notes: z.string().trim().max(1000).optional(),
}).strict();

export type ApplyScholarshipDTOType = z.infer<typeof ApplyScholarshipDTO>;
export type UpdateScholarshipApplicationDTOType = z.infer<typeof UpdateScholarshipApplicationDTO>;
