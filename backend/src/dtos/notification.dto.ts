import { z } from "zod";

export const MarkNotificationReadDTO = z.object({
  notificationIds: z.array(z.string().regex(/^[0-9a-f]{24}$/i, "Invalid notification ID")).min(1, "At least one notification ID required"),
});

export type MarkNotificationReadDTOType = z.infer<typeof MarkNotificationReadDTO>;
