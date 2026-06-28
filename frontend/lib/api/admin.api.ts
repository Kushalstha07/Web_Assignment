import type { ApiResponse, PaginatedResponse, AdminUser, AdminCreateUserPayload, AdminUpdateUserPayload } from "@/lib/api/types";

function getToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )client-token=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

async function parseResponse(response: Response) {
  return response.json();
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function getUsers(
  page: number = 1,
  limit: number = 10,
  search?: string,
): Promise<PaginatedResponse<AdminUser>> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (search) params.set("search", search);

  const response = await fetch(`/api/v1/admin/users?${params.toString()}`, {
    method: "GET",
    headers: authHeaders(),
    cache: "no-store",
  });
  return parseResponse(response);
}

export async function getUser(id: string): Promise<ApiResponse<AdminUser>> {
  const response = await fetch(`/api/v1/admin/users/${id}`, {
    method: "GET",
    headers: authHeaders(),
    cache: "no-store",
  });
  return parseResponse(response);
}

export async function createUser(payload: AdminCreateUserPayload): Promise<ApiResponse<AdminUser>> {
  const response = await fetch("/api/v1/admin/users", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  return parseResponse(response);
}

export async function updateUser(id: string, payload: AdminUpdateUserPayload): Promise<ApiResponse<AdminUser>> {
  const response = await fetch(`/api/v1/admin/users/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  return parseResponse(response);
}

export async function deleteUser(id: string): Promise<ApiResponse<null>> {
  const response = await fetch(`/api/v1/admin/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
    cache: "no-store",
  });
  return parseResponse(response);
}