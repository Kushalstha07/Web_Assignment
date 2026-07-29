import type { ApiResponse, PaginatedResponse, AdminUser, AdminCreateUserPayload, AdminUpdateUserPayload } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";

export async function getUsers(
  page: number = 1,
  limit: number = 10,
  search?: string,
  role?: string,
): Promise<PaginatedResponse<AdminUser>> {
  return apiClient("GET", "/api/v1/admin/users", {
    params: { page: String(page), limit: String(limit), ...(search ? { search } : {}), ...(role ? { role } : {}) },
  });
}

export async function getUser(id: string): Promise<ApiResponse<AdminUser>> {
  return apiClient("GET", `/api/v1/admin/users/${id}`);
}

export async function createUser(payload: AdminCreateUserPayload): Promise<ApiResponse<AdminUser>> {
  return apiClient("POST", "/api/v1/admin/users", { body: payload });
}

export async function updateUser(id: string, payload: AdminUpdateUserPayload): Promise<ApiResponse<AdminUser>> {
  return apiClient("PUT", `/api/v1/admin/users/${id}`, { body: payload });
}

export async function deleteUser(id: string): Promise<ApiResponse<null>> {
  return apiClient("DELETE", `/api/v1/admin/users/${id}`);
}
