import { z } from "zod";

export const CreateConversationDTO = z.object({
  participantIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid participant ID"))
    .min(1, "At least one other participant is required")
    .max(9, "A conversation can have at most 10 participants"),
  title: z.string().trim().max(200).optional(),
});

export const SendMessageDTO = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  content: z.string().trim().min(1, "Message cannot be empty").max(5000),
  attachments: z.array(z.string()).optional(),
});

export const MarkReadDTO = z.object({
  messageIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid message ID"))
    .min(1, "At least one message ID required")
    .max(100, "At most 100 messages can be marked at once"),
});

export type CreateConversationDTOType = z.infer<typeof CreateConversationDTO>;
export type SendMessageDTOType = z.infer<typeof SendMessageDTO>;
export type MarkReadDTOType = z.infer<typeof MarkReadDTO>;
