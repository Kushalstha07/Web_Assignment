import { apiClient } from "./client";

export interface ScholarshipAdvice {
  advice: string;
  model: string;
  generatedAt: string;
}

export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiChatReply {
  reply: string;
  model: string;
  generatedAt: string;
}

export async function getScholarshipAdvice(): Promise<{ success: boolean; message: string; data: ScholarshipAdvice }> {
  return apiClient("POST", "/api/v1/ai/scholarship-advice");
}

export async function sendAiChat(messages: AiChatMessage[]): Promise<{ success: boolean; message: string; data: AiChatReply }> {
  return apiClient("POST", "/api/v1/ai/chat", { body: { messages } });
}
