import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { AcademicProfile, Step1Personal, Step2Academic, Step3Preferences } from "@/lib/schemas/academic-profile.schema";

export async function getMyProfile(): Promise<ApiResponse<AcademicProfile>> {
  return apiClient("GET", "/api/v1/academic-profile");
}

export async function createProfile(payload: AcademicProfile): Promise<ApiResponse<AcademicProfile>> {
  return apiClient("POST", "/api/v1/academic-profile", { body: payload });
}

export async function updateProfile(payload: Partial<AcademicProfile>): Promise<ApiResponse<AcademicProfile>> {
  return apiClient("PUT", "/api/v1/academic-profile", { body: payload });
}

export async function saveStep1(payload: Step1Personal): Promise<ApiResponse<AcademicProfile>> {
  return apiClient("PUT", "/api/v1/academic-profile/step-1", { body: payload });
}

export async function saveStep2(payload: Step2Academic): Promise<ApiResponse<AcademicProfile>> {
  return apiClient("PUT", "/api/v1/academic-profile/step-2", { body: payload });
}

export async function saveStep3(payload: Step3Preferences): Promise<ApiResponse<AcademicProfile>> {
  return apiClient("PUT", "/api/v1/academic-profile/step-3", { body: payload });
}