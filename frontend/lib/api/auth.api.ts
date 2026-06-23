import { API_URL } from "@/lib/config";
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

function getBaseUrl() {
  if (typeof window === "undefined") return API_URL;
  return "";
}

function getToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )client-token=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

async function parseResponse(response: Response) {
  return response.json();
}

export async function registerUser(payload: RegisterPayload) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  return parseResponse(response);
}

export async function loginUser(payload: LoginInput) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  return parseResponse(response);
}

export async function whoami() {
  const baseUrl = getBaseUrl();
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${baseUrl}/api/v1/auth/whoami`, {
    method: "GET",
    headers,
    cache: "no-store",
  });
  return parseResponse(response);
}

export async function updateProfile(payload: FormData) {
  const baseUrl = getBaseUrl();
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${baseUrl}/api/v1/auth/update`, {
    method: "PUT",
    headers,
    body: payload,
    cache: "no-store",
  });
  return parseResponse(response);
}

export async function changePassword(payload: ChangePasswordPayload) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/v1/auth/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  return parseResponse(response);
}
