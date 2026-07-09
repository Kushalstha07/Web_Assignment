import { z } from "zod";

export const documentStatuses = [
  "pending",
  "verified",
  "rejected",
  "expired",
] as const;

export const documentCategories = [
  "transcript",
  "degree",
  "identity",
  "language-test",
  "recommendation",
  "sop",
  "financial",
  "visa",
  "other",
] as const;

export const DocumentSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  fileName: z.string().min(1, "File name is required"),
  originalName: z.string().min(1, "Original name is required"),
  mimeType: z.string().min(1, "MIME type is required"),
  size: z.number().positive("File size must be positive"),
  category: z.enum(documentCategories, { error: "Invalid category" }),
  status: z.enum(documentStatuses).default("pending"),
  url: z.string().min(1, "File URL is required"),
  notes: z.string().max(500).optional(),
  verifiedBy: z.string().optional(),
  verifiedAt: z.string().optional(),
});

export type DocumentType = z.infer<typeof DocumentSchema>;
export type DocumentStatus = (typeof documentStatuses)[number];
export type DocumentCategory = (typeof documentCategories)[number];