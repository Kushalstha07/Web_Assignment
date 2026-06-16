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

/**
 * Returns the base URL for API calls.
 * - Server-side (server actions): use absolute URL (e.g. http://localhost:4000)
 * - Client-side (browser): use empty string so proxy rewrites handle it
 */
function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return API_URL;
  }
  return "";
}

/**
 * Read a cookie value by name from document.cookie (client-side only)
 */
function getClientToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )client-token=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Build headers with optional Authorization Bearer token for client-side calls
 */
function buildHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extra };
  const token = getClientToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  return response.json() as Promise<ApiResponse<T>>;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<ApiResponse<SafeUser>> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
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
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
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
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/v1/auth/whoami`, {
    method: "GET",
    headers: buildHeaders(),
    cache: "no-store",
  });

  return parseResponse<SafeUser>(response);
}

export async function updateProfile(
  payload: FormData,
): Promise<ApiResponse<SafeUser>> {
  const baseUrl = getBaseUrl();
  const token = getClientToken();

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  // Do NOT set Content-Type for FormData — browser sets it with the boundary

  const response = await fetch(`${baseUrl}/api/v1/auth/update`, {
    method: "PUT",
    headers,
    body: payload,
    cache: "no-store",
  });

  return parseResponse<SafeUser>(response);
}

export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<ApiResponse<null>> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/v1/auth/change-password`, {
    method: "PUT",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return parseResponse<null>(response);
}