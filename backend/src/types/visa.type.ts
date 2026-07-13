import { z } from "zod";

export const visaStatuses = [
  "documents-preparing",
  "ready-to-submit",
  "submitted",
  "biometrics-scheduled",
  "interview-scheduled",
  "under-review",
  "approved",
  "refused",
] as const;

export const VisaCaseSchema = z.object({
  applicationId: z.string().min(1),
  studentId: z.string().min(1),
  counsellorId: z.string().nullable().optional(),
  country: z.string().trim().min(2).max(100),
  visaType: z.string().trim().min(2).max(100),
  status: z.enum(visaStatuses).default("documents-preparing"),
  referenceNumber: z.string().trim().max(100).optional(),
  submissionDate: z.string().max(40).optional(),
  appointmentDate: z.string().max(40).optional(),
  decisionDate: z.string().max(40).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export type VisaCaseType = z.infer<typeof VisaCaseSchema>;
export type VisaStatus = (typeof visaStatuses)[number];
