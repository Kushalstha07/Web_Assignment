import { apiClient } from "./client";

export const visaStatuses = [
  "documents-preparing",
  "ready-to-submit",
  "submitted",
  "biometrics-scheduled",
  "interview-scheduled",
  "under-review",
  "approved",
  "refused",
] as const;

export type VisaStatus = (typeof visaStatuses)[number];

export interface VisaCase {
  id: string;
  applicationId: string;
  studentId: string;
  studentName?: string;
  program?: string;
  counsellorId?: string | null;
  country: string;
  visaType: string;
  status: VisaStatus;
  referenceNumber?: string;
  submissionDate?: string;
  appointmentDate?: string;
  decisionDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

type VisaResponse = { success: boolean; message: string; data: VisaCase };

export async function getVisaCases(): Promise<{ success: boolean; message: string; data: VisaCase[] }> {
  return apiClient("GET", "/api/v1/visa");
}

export async function createVisaCase(payload: { applicationId: string; country: string; visaType: string }): Promise<VisaResponse> {
  return apiClient("POST", "/api/v1/visa", { body: payload });
}

export async function updateVisaCase(id: string, payload: Partial<Pick<VisaCase, "counsellorId" | "status" | "referenceNumber" | "submissionDate" | "appointmentDate" | "decisionDate" | "notes">>): Promise<VisaResponse> {
  return apiClient("PATCH", `/api/v1/visa/${id}`, { body: payload });
}

export async function deleteVisaCase(id: string): Promise<{ success: boolean; message: string }> {
  return apiClient("DELETE", `/api/v1/visa/${id}`);
}
