import type { ApiResponse, LoginResponse, SafeUser } from "@/lib/api/types";
import type { LoginInput } from "@/lib/schemas/auth.schema";
import { apiClient } from "@/lib/api/client";

export type RegisterPayload = {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  studyLevel: string;
  destination: string;
  fieldOfStudy: string;
  intake: string;
  budget: string;
  password: string;
};

export type UpdateProfilePayload = {
  fullName?: string;
  phoneNumber?: string;
  studyLevel?: string;
  destination?: string;
  fieldOfStudy?: string;
  intake?: string;
  budget?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export async function registerUser(payload: RegisterPayload): Promise<ApiResponse<SafeUser>> {
  return apiClient("POST", "/api/v1/auth/register", { body: payload });
}

export async function loginUser(payload: LoginInput): Promise<ApiResponse<LoginResponse>> {
  return apiClient("POST", "/api/v1/auth/login", { body: payload });
}

export async function whoami(): Promise<ApiResponse<SafeUser>> {
  return apiClient("GET", "/api/v1/auth/whoami");
}

export async function updateProfile(payload: FormData): Promise<ApiResponse<SafeUser>> {
  return apiClient("PUT", "/api/v1/auth/update", { formData: true, body: payload });
}

export async function changePassword(payload: ChangePasswordPayload): Promise<ApiResponse<null>> {
  return apiClient("PUT", "/api/v1/auth/change-password", { body: payload });
}