import { z } from "zod";

export const applicationStatuses = [
  "draft",
  "submitted",
  "under-review",
  "accepted",
  "rejected",
  "waitlisted",
  "withdrawn",
] as const;

export const applicationStages = [
  "documents-pending",
  "documents-uploaded",
  "verified",
  "interview-scheduled",
  "interview-completed",
  "decision-pending",
  "decision-made",
] as const;

export const ApplicationSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  universityId: z.string().min(1, "University ID is required"),
  program: z.string().min(1, "Program name is required"),
  status: z.enum(applicationStatuses).default("draft"),
  stage: z.enum(applicationStages).default("documents-pending"),
  submittedDate: z.string().optional(),
  decisionDate: z.string().optional(),
  notes: z.string().max(1000, "Notes must be under 1000 characters").optional(),
  documents: z.array(z.string()).default([]),
});

export type ApplicationType = z.infer<typeof ApplicationSchema>;

export type ApplicationStatus = (typeof applicationStatuses)[number];
export type ApplicationStage = (typeof applicationStages)[number];