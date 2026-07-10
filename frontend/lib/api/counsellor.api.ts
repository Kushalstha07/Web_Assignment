import { apiClient } from "./client";

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

export async function getCounsellors(available?: boolean, specialty?: string): Promise<CounsellorListResponse> {
  const params: Record<string, string> = {};
  if (available !== undefined) params.available = String(available);
  if (specialty) params.specialty = specialty;
  return apiClient("GET", "/api/v1/counsellors", { params });
}

export async function getCounsellorById(id: string): Promise<{ success: boolean; data: Counsellor }> {
  return apiClient("GET", `/api/v1/counsellors/${id}`);
}

export async function createCounsellor(data: Partial<Counsellor>): Promise<{ success: boolean; data: Counsellor; message: string }> {
  return apiClient("POST", "/api/v1/counsellors", { body: data });
}

export async function updateCounsellor(id: string, data: Partial<Counsellor>): Promise<{ success: boolean; data: Counsellor; message: string }> {
  return apiClient("PATCH", `/api/v1/counsellors/${id}`, { body: data });
}

export async function deleteCounsellor(id: string): Promise<{ success: boolean; message: string }> {
  return apiClient("DELETE", `/api/v1/counsellors/${id}`);
}