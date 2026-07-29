import { apiClient } from "./client";
import type { AdminUser } from "./types";

export interface Counsellor {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  bio?: string;
  specialties: string[];
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  available: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CounsellorListResponse {
  success: boolean;
  message: string;
  data: Counsellor[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export interface CreateCounsellorPayload {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  bio?: string;
  specialties?: string[];
  yearsOfExperience?: number;
  hourlyRate?: number;
  imageUrl?: string;
}

export interface UpdateCounsellorPayload extends Omit<Partial<CreateCounsellorPayload>, "userId"> {
  available?: boolean;
}

export async function getCounsellors(available?: boolean, specialty?: string): Promise<CounsellorListResponse> {
  const params: Record<string, string> = {};
  if (available !== undefined) params.available = String(available);
  if (specialty) params.specialty = specialty;
  return apiClient("GET", "/api/v1/counsellors", { params });
}

export async function getCounsellorById(id: string): Promise<{ success: boolean; data: Counsellor }> {
  return apiClient("GET", `/api/v1/counsellors/${id}`);
}

export async function getAssignedStudents(search?: string): Promise<{ success: boolean; message: string; data: AdminUser[] }> {
  return apiClient("GET", "/api/v1/counsellors/me/students", {
    params: search ? { search } : undefined,
  });
}

export async function createCounsellor(data: CreateCounsellorPayload): Promise<{ success: boolean; data: Counsellor; message: string }> {
  return apiClient("POST", "/api/v1/counsellors", { body: data });
}

export async function updateCounsellor(id: string, data: UpdateCounsellorPayload): Promise<{ success: boolean; data: Counsellor; message: string }> {
  return apiClient("PATCH", `/api/v1/counsellors/${id}`, { body: data });
}

export async function deleteCounsellor(id: string): Promise<{ success: boolean; message: string }> {
  return apiClient("DELETE", `/api/v1/counsellors/${id}`);
}
