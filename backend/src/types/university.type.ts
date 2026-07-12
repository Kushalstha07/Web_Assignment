import { z } from "zod";

export const countries = ["usa", "uk", "canada", "australia", "europe"] as const;
export const rankingLevels = ["top-10", "top-50", "top-100", "top-200", "regional"] as const;
export const courseTypes = ["undergraduate", "postgraduate", "research", "diploma"] as const;
export const budgetRanges = ["under-10k", "10k-20k", "20k-35k", "35k-plus"] as const;

export const UniversitySchema = z.object({
  name: z.string().min(1, "University name is required"),
  country: z.enum(countries),
  city: z.string().min(1),
  ranking: z.enum(rankingLevels),
  worldRanking: z.number().int().positive().optional(),
  courseType: z.enum(courseTypes),
  tuitionFee: z.number().positive(),
  budgetRange: z.enum(budgetRanges),
  applicationFee: z.number().nonnegative().optional(),
  description: z.string().max(2000).optional(),
  programs: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  matchScore: z.number().min(0).max(100).optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
});

export type UniversityType = z.infer<typeof UniversitySchema>;