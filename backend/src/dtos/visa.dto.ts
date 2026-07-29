import { z } from "zod";
import { visaStatuses } from "../types/visa.type";

export const CreateVisaCaseDTO = z.object({
  applicationId: z.string().regex(/^[0-9a-f]{24}$/i, "Invalid application ID"),
  country: z.string().trim().min(2).max(100),
  visaType: z.string().trim().min(2).max(100),
});

export const UpdateVisaCaseDTO = z.object({
  counsellorId: z.string().regex(/^[0-9a-f]{24}$/i, "Invalid counsellor ID").nullable().optional(),
  status: z.enum(visaStatuses).optional(),
  referenceNumber: z.string().trim().max(100).optional(),
  submissionDate: z.string().max(40).optional(),
  appointmentDate: z.string().max(40).optional(),
  decisionDate: z.string().max(40).optional(),
  notes: z.string().trim().max(2000).optional(),
}).strict();

export type CreateVisaCaseDTOType = z.infer<typeof CreateVisaCaseDTO>;
export type UpdateVisaCaseDTOType = z.infer<typeof UpdateVisaCaseDTO>;
