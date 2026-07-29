import { z } from "zod";
import { applicationStatuses, applicationStages } from "../types/application.type";

export const CreateApplicationDTO = z.object({
  universityId: z.string().min(1, "University is required"),
  program: z.string().min(1, "Program name is required"),
  notes: z.string().max(1000).optional(),
});

export const UpdateApplicationDTO = z.object({
  counsellorId: z.string().nullable().optional(),
  status: z.enum(applicationStatuses).optional(),
  stage: z.enum(applicationStages).optional(),
  program: z.string().min(1).optional(),
  notes: z.string().max(1000).optional(),
  documents: z.array(z.string()).optional(),
});

// Students may edit application content, but workflow decisions belong to staff.
export const StudentUpdateApplicationDTO = UpdateApplicationDTO.pick({
  program: true,
  notes: true,
  documents: true,
}).strict();

export const CounsellorUpdateApplicationDTO = UpdateApplicationDTO.pick({
  status: true,
  stage: true,
  notes: true,
}).strict();

export const SubmitApplicationDTO = z.object({
  submittedDate: z.string().min(1, "Submission date is required"),
});

export type CreateApplicationDTOType = z.infer<typeof CreateApplicationDTO>;
export type UpdateApplicationDTOType = z.infer<typeof UpdateApplicationDTO>;
export type StudentUpdateApplicationDTOType = z.infer<typeof StudentUpdateApplicationDTO>;
export type CounsellorUpdateApplicationDTOType = z.infer<typeof CounsellorUpdateApplicationDTO>;
export type SubmitApplicationDTOType = z.infer<typeof SubmitApplicationDTO>;
