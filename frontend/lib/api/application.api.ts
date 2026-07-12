import { apiClient } from "./client";

export interface Application {
  id: string;
  studentId: string;
  universityId: string;
  program: string;
  status: string;
  stage: string;
  submittedDate?: string;
  decisionDate?: string;
  notes?: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationListResponse {
  success: boolean;
  message: string;
  data: Application[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateApplicationData {
  universityId: string;
  program: string;
  notes?: string;
}

export interface UpdateApplicationData {
  status?: string;
  stage?: string;
  program?: string;
  notes?: string;
  documents?: string[];
}

export async function createApplication(data: CreateApplicationData): Promise<{ success: boolean; data: Application; message: string }> {
  return apiClient("POST", "/api/v1/applications", { body: data });
}

export async function getMyApplications(): Promise<ApplicationListResponse> {
  return apiClient("GET", "/api/v1/applications");
}

export async function getAllApplications(page = 1, limit = 10, search?: string): Promise<ApplicationListResponse> {
  const params: Record<string, string> = { page: String(page), limit: String(limit) };
  if (search) params.search = search;
  return apiClient("GET", "/api/v1/applications/all", { params });
}

export async function getApplicationById(id: string): Promise<{ success: boolean; data: Application }> {
  return apiClient("GET", `/api/v1/applications/${id}`);
}

export async function updateApplication(id: string, data: UpdateApplicationData): Promise<{ success: boolean; data: Application; message: string }> {
  return apiClient("PATCH", `/api/v1/applications/${id}`, { body: data });
}

export async function submitApplication(id: string, submittedDate: string): Promise<{ success: boolean; data: Application; message: string }> {
  return apiClient("POST", `/api/v1/applications/${id}/submit`, { body: { submittedDate } });
}

export async function deleteApplication(id: string): Promise<{ success: boolean; message: string }> {
  return apiClient("DELETE", `/api/v1/applications/${id}`);
}