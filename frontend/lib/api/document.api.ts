import { apiClient } from "./client";

export interface Document {
  id: string;
  userId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  category: string;
  status: string;
  url: string;
  notes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentListResponse {
  success: boolean;
  message: string;
  data: Document[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function uploadDocument(file: File, category: string, notes?: string): Promise<{ success: boolean; data: Document; message: string }> {
  const formData = new FormData();
  formData.append("document", file);
  formData.append("category", category);
  if (notes) formData.append("notes", notes);

  return apiClient("POST", "/api/v1/documents/upload", { body: formData, formData: true });
}

export async function getMyDocuments(): Promise<DocumentListResponse> {
  return apiClient("GET", "/api/v1/documents");
}

export async function getStudentDocuments(studentId: string): Promise<DocumentListResponse> {
  return apiClient("GET", `/api/v1/documents/student/${studentId}`);
}

export async function getAllDocuments(page = 1, limit = 10, status?: string): Promise<DocumentListResponse> {
  const params: Record<string, string> = { page: String(page), limit: String(limit) };
  if (status) params.status = status;
  return apiClient("GET", "/api/v1/documents/all", { params });
}

export async function getDocumentById(id: string): Promise<{ success: boolean; data: Document }> {
  return apiClient("GET", `/api/v1/documents/${id}`);
}

export async function verifyDocument(id: string, status: "verified" | "rejected", notes?: string): Promise<{ success: boolean; data: Document; message: string }> {
  return apiClient("PATCH", `/api/v1/documents/${id}/verify`, { body: { status, notes } });
}

export async function deleteDocument(id: string): Promise<{ success: boolean; message: string }> {
  return apiClient("DELETE", `/api/v1/documents/${id}`);
}
