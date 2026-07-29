import { apiClient } from "./client";

export interface Conversation {
  id: string;
  participants: string[];
  title?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  status: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export async function getConversations(): Promise<{ success: boolean; data: Conversation[]; message: string }> {
  return apiClient("GET", "/api/v1/messages/conversations");
}

export async function createConversation(participantIds: string[], title?: string): Promise<{ success: boolean; data: Conversation; message: string }> {
  return apiClient("POST", "/api/v1/messages/conversations", { body: { participantIds, title } });
}

export async function getMessages(conversationId: string, page = 1, limit = 50): Promise<{ success: boolean; data: ChatMessage[]; message: string }> {
  return apiClient("GET", `/api/v1/messages/conversations/${conversationId}/messages`, { params: { page: String(page), limit: String(limit) } });
}

export async function sendMessage(conversationId: string, content: string): Promise<{ success: boolean; data: ChatMessage; message: string }> {
  return apiClient("POST", "/api/v1/messages/send", { body: { conversationId, content } });
}

export async function markMessagesAsRead(messageIds: string[]): Promise<{ success: boolean; message: string }> {
  return apiClient("PATCH", "/api/v1/messages/read", { body: { messageIds } });
}
