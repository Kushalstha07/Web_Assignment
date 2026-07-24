import { apiClient } from "./client";

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  ranking: string;
  worldRanking?: number;
  courseType: string;
  tuitionFee: number;
  budgetRange: string;
  applicationFee?: number;
  description?: string;
  programs: string[];
  rating?: number;
  matchScore?: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UniversityRecommendation extends University {
  score: number;
  reasons: string[];
}

export interface CreateUniversityPayload {
  name: string;
  country: string;
  city: string;
  ranking: string;
  worldRanking?: number;
  courseType: string;
  tuitionFee: number;
  budgetRange: string;
  applicationFee?: number;
  description?: string;
  programs?: string[];
  rating?: number;
  imageUrl?: string;
  isActive?: boolean;
}

export interface UniversityListResponse {
  success: boolean;
  message: string;
  data: University[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UniversityFilters {
  country?: string;
  courseType?: string;
  budgetRange?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getUniversities(filters: UniversityFilters = {}): Promise<UniversityListResponse> {
  const params: Record<string, string> = {};
  if (filters.country) params.country = filters.country;
  if (filters.courseType) params.courseType = filters.courseType;
  if (filters.budgetRange) params.budgetRange = filters.budgetRange;
  if (filters.search) params.search = filters.search;
  if (filters.page) params.page = String(filters.page);
  if (filters.limit) params.limit = String(filters.limit);

  return apiClient<UniversityListResponse>("GET", "/api/v1/universities", { params });
}

export async function getUniversityById(id: string): Promise<{ success: boolean; data: University }> {
  return apiClient<{ success: boolean; data: University }>("GET", `/api/v1/universities/${id}`);
}

export async function getUniversitiesByCountry(country: string): Promise<{ success: boolean; data: University[] }> {
  return apiClient<{ success: boolean; data: University[] }>("GET", `/api/v1/universities/country/${country}`);
}

export async function getUniversityRecommendations(limit = 9): Promise<{ success: boolean; message: string; data: UniversityRecommendation[] }> {
  return apiClient("GET", "/api/v1/universities/recommendations", { params: { limit: String(limit) } });
}

export async function createUniversity(payload: CreateUniversityPayload): Promise<{ success: boolean; message: string; data: University }> {
  return apiClient("POST", "/api/v1/universities", { body: payload });
}
