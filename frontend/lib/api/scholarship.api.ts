import { apiClient } from "./client";

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  type: string;
  amount: number;
  currency: string;
  description?: string;
  eligibility?: string;
  requirements: string[];
  countries: string[];
  universities: string[];
  deadline?: string;
  status: string;
  applicationUrl?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScholarshipListResponse {
  success: boolean;
  message: string;
  data: Scholarship[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export interface ScholarshipFilter {
  type?: string;
  country?: string;
  status?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getScholarships(filter?: ScholarshipFilter): Promise<ScholarshipListResponse> {
  const params: Record<string, string> = {};
  if (filter) {
    if (filter.type) params.type = filter.type;
    if (filter.country) params.country = filter.country;
    if (filter.status) params.status = filter.status;
    if (filter.minAmount) params.minAmount = String(filter.minAmount);
    if (filter.maxAmount) params.maxAmount = String(filter.maxAmount);
    if (filter.search) params.search = filter.search;
    if (filter.page) params.page = String(filter.page);
    if (filter.limit) params.limit = String(filter.limit);
  }
  return apiClient("GET", "/api/v1/scholarships", { params });
}

export async function getScholarshipById(id: string): Promise<{ success: boolean; data: Scholarship }> {
  return apiClient("GET", `/api/v1/scholarships/${id}`);
}

export async function createScholarship(data: Partial<Scholarship>): Promise<{ success: boolean; data: Scholarship; message: string }> {
  return apiClient("POST", "/api/v1/scholarships", { body: data });
}

export async function updateScholarship(id: string, data: Partial<Scholarship>): Promise<{ success: boolean; data: Scholarship; message: string }> {
  return apiClient("PATCH", `/api/v1/scholarships/${id}`, { body: data });
}

export async function deleteScholarship(id: string): Promise<{ success: boolean; message: string }> {
  return apiClient("DELETE", `/api/v1/scholarships/${id}`);
}