import { apiClient } from "./client";

export interface Appointment {
  id: string;
  studentId: string;
  counsellorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  meetingLink?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentListResponse {
  success: boolean;
  message: string;
  data: Appointment[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export async function createAppointment(data: { counsellorId: string; date: string; startTime: string; endTime: string; notes?: string }): Promise<{ success: boolean; data: Appointment; message: string }> {
  return apiClient("POST", "/api/v1/appointments", { body: data });
}

export async function getMyAppointments(): Promise<AppointmentListResponse> {
  return apiClient("GET", "/api/v1/appointments");
}

export async function getAllAppointments(page = 1, limit = 10): Promise<AppointmentListResponse> {
  return apiClient("GET", "/api/v1/appointments/all", { params: { page: String(page), limit: String(limit) } });
}

export async function getAppointmentsByDateRange(startDate: string, endDate: string): Promise<AppointmentListResponse> {
  return apiClient("GET", "/api/v1/appointments/date-range", { params: { startDate, endDate } });
}

export async function getAppointmentsByCounsellor(counsellorId: string): Promise<AppointmentListResponse> {
  return apiClient("GET", `/api/v1/appointments/counsellor/${counsellorId}`);
}

export async function getAppointmentById(id: string): Promise<{ success: boolean; data: Appointment }> {
  return apiClient("GET", `/api/v1/appointments/${id}`);
}

export async function updateAppointment(id: string, data: { date?: string; startTime?: string; endTime?: string; notes?: string }): Promise<{ success: boolean; data: Appointment; message: string }> {
  return apiClient("PATCH", `/api/v1/appointments/${id}`, { body: data });
}

export async function cancelAppointment(id: string, cancellationReason?: string): Promise<{ success: boolean; data: Appointment; message: string }> {
  return apiClient("POST", `/api/v1/appointments/${id}/cancel`, { body: { cancellationReason } });
}