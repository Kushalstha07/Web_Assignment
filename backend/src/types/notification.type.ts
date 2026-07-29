import { z } from "zod";

export const notificationTypes = ["info", "success", "warning", "error"] as const;
export const notificationCategories = ["application", "document", "appointment", "message", "scholarship", "visa", "system"] as const;

export const NotificationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  title: z.string().min(1, "Title is required").max(200),
  message: z.string().min(1, "Message is required").max(1000),
  type: z.enum(notificationTypes).default("info"),
  category: z.enum(notificationCategories).default("system"),
  read: z.boolean().default(false),
  link: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type NotificationType = z.infer<typeof NotificationSchema>;
export type NotificationInput = z.input<typeof NotificationSchema>;
export type NotificationTypeEnum = (typeof notificationTypes)[number];
export type NotificationCategory = (typeof notificationCategories)[number];
