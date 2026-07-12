import { z } from "zod";

export const CreateConversationDTO = z.object({
  participantIds: z.array(z.string()).min(2, "At least 2 participants").max(10, "Max 10 participants"),
  title: z.string().max(200).optional(),
});

export const SendMessageDTO = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  content: z.string().min(1, "Message cannot be empty").max(5000),
  attachments: z.array(z.string()).optional(),
});

export const MarkReadDTO = z.object({
  messageIds: z.array(z.string()).min(1, "At least one message ID required"),
});

export type CreateConversationDTOType = z.infer<typeof CreateConversationDTO>;
export type SendMessageDTOType = z.infer<typeof SendMessageDTO>;
export type MarkReadDTOType = z.infer<typeof MarkReadDTO>;