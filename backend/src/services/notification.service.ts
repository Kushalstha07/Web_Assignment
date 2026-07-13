import { NotificationMongoRepository } from "../repositories/notification.repository";
import { NotificationSchema, NotificationInput } from "../types/notification.type";
import { HttpException } from "../exceptions/http-exception";
import { INotification } from "../models/notification.model";

const notifRepo = new NotificationMongoRepository();

export type SafeNotification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  category: string;
  read: boolean;
  link?: string;
  createdAt: string;
};

export function toSafeNotification(n: INotification): SafeNotification {
  const d = n as INotification & { createdAt?: Date };
  return {
    id: n._id.toString(),
    userId: n.userId,
    title: n.title,
    message: n.message,
    type: n.type,
    category: n.category,
    read: n.read,
    link: n.link,
    createdAt: d.createdAt?.toISOString?.() || String(d.createdAt),
  };
}

export class NotificationService {
  async create(data: NotificationInput): Promise<SafeNotification> {
    const created = await notifRepo.create(NotificationSchema.parse(data));
    return toSafeNotification(created);
  }

  async notify(data: NotificationInput): Promise<void> {
    try {
      await this.create(data);
    } catch (error) {
      console.error("Failed to create notification", error);
    }
  }

  async getMyNotifications(userId: string, page = 1, limit = 20): Promise<{ data: SafeNotification[]; total: number }> {
    const result = await notifRepo.getByUserId(userId, page, limit);
    return { data: result.data.map(toSafeNotification), total: result.total };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return notifRepo.getUnreadCount(userId);
  }

  async markAsRead(notificationIds: string[], userId: string): Promise<void> {
    await notifRepo.markAsRead(notificationIds, userId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await notifRepo.markAllAsRead(userId);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const deleted = await notifRepo.delete(id, userId);
    if (!deleted) throw new HttpException(404, "Notification not found");
    return true;
  }
}

export const notificationService = new NotificationService();
