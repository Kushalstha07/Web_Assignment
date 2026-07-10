import { z } from "zod";

export const messageStatuses = ["sent", "delivered", "read"] as const;

export const MessageSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  senderId: z.string().min(1, "Sender ID is required"),
  content: z.string().min(1, "Content cannot be empty").max(5000),
  status: z.enum(messageStatuses).default("sent"),
  attachments: z.array(z.string()).default([]),
});

export const ConversationSchema = z.object({
  participants: z.array(z.string()).min(2, "At least 2 participants required"),
  title: z.string().max(200).optional(),
  lastMessage: z.string().optional(),
  lastMessageAt: z.string().optional(),
});

export type MessageType = z.infer<typeof MessageSchema>;
export type ConversationType = z.infer<typeof ConversationSchema>;
export type MessageStatus = (typeof messageStatuses)[number];