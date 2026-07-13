import { z } from "zod";
import { countries, rankingLevels, courseTypes, budgetRanges } from "../types/university.type";

export const CreateUniversityDTO = z.object({
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
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
});

export const UpdateUniversityDTO = CreateUniversityDTO.partial();

export const UniversityFilterDTO = z.object({
  country: z.enum(countries).optional(),
  courseType: z.enum(courseTypes).optional(),
  budgetRange: z.enum(budgetRanges).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export const RecommendationQueryDTO = z.object({
  limit: z.coerce.number().int().positive().max(20).default(9),
});

export type CreateUniversityDTOType = z.infer<typeof CreateUniversityDTO>;
export type UpdateUniversityDTOType = z.infer<typeof UpdateUniversityDTO>;
export type UniversityFilterDTOType = z.infer<typeof UniversityFilterDTO>;
