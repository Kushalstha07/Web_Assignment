import { apiClient } from "./client";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  category: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface NotificationListResponse {
  success: boolean;
  message: string;
  data: Notification[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export async function getNotifications(page = 1, limit = 20): Promise<NotificationListResponse> {
  return apiClient("GET", "/api/v1/notifications", { params: { page: String(page), limit: String(limit) } });
}

export async function getUnreadCount(): Promise<{ success: boolean; data: { count: number } }> {
  return apiClient("GET", "/api/v1/notifications/unread-count");
}

export async function markNotificationsAsRead(notificationIds: string[]): Promise<{ success: boolean; message: string }> {
  return apiClient("PATCH", "/api/v1/notifications/read", { body: { notificationIds } });
}

export async function markAllNotificationsAsRead(): Promise<{ success: boolean; message: string }> {
  return apiClient("PATCH", "/api/v1/notifications/read-all");
}

export async function deleteNotification(id: string): Promise<{ success: boolean; message: string }> {
  return apiClient("DELETE", `/api/v1/notifications/${id}`);
}