import { z } from "zod";

export const MarkNotificationReadDTO = z.object({
  notificationIds: z.array(z.string()).min(1, "At least one notification ID required"),
});

export type MarkNotificationReadDTOType = z.infer<typeof MarkNotificationReadDTO>;