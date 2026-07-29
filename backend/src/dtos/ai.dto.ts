import { z } from "zod";

export const AiChatMessageDTO = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1, "Message cannot be empty").max(4000),
});

export const AiChatDTO = z.object({
  messages: z.array(AiChatMessageDTO).min(1, "At least one message is required").max(20),
});

export type AiChatDTOType = z.infer<typeof AiChatDTO>;
