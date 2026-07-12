import { z } from "zod";
import { documentStatuses, documentCategories } from "../types/document.type";

export const CreateDocumentDTO = z.object({
  category: z.enum(documentCategories, { error: "Invalid category" }),
  notes: z.string().max(500).optional(),
});

export const UpdateDocumentDTO = z.object({
  status: z.enum(documentStatuses).optional(),
  notes: z.string().max(500).optional(),
});

export const VerifyDocumentDTO = z.object({
  status: z.enum(["verified", "rejected"]),
  notes: z.string().max(500).optional(),
});

export type CreateDocumentDTOType = z.infer<typeof CreateDocumentDTO>;
export type UpdateDocumentDTOType = z.infer<typeof UpdateDocumentDTO>;
export type VerifyDocumentDTOType = z.infer<typeof VerifyDocumentDTO>;