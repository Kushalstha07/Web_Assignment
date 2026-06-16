import type { ApiResponse, LoginResponse, SafeUser } from "@/lib/api/types";
import type { LoginInput } from "@/lib/schemas/auth.schema";

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

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  return response.json() as Promise<ApiResponse<T>>;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<ApiResponse<SafeUser>> {
  const response = await fetch("/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return parseResponse<SafeUser>(response);
}

export async function loginUser(
  payload: LoginInput,
): Promise<ApiResponse<LoginResponse>> {
  const response = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return parseResponse<LoginResponse>(response);
}

export async function whoami(): Promise<ApiResponse<SafeUser>> {
  const response = await fetch("/api/v1/auth/whoami", {
    method: "GET",
    cache: "no-store",
  });

  return parseResponse<SafeUser>(response);
}

export async function updateProfile(
  payload: FormData,
): Promise<ApiResponse<SafeUser>> {
  const response = await fetch("/api/v1/auth/update", {
    method: "PUT",
    body: payload,
    cache: "no-store",
  });

  return parseResponse<SafeUser>(response);
}

export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<ApiResponse<null>> {
  const response = await fetch("/api/v1/auth/change-password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return parseResponse<null>(response);
}