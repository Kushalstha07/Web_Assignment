import { NotificationModel, INotification } from "../models/notification.model";
import { NotificationType } from "../types/notification.type";

export interface INotificationRepository {
  create(data: NotificationType): Promise<INotification>;
  getByUserId(userId: string, page: number, limit: number): Promise<{ data: INotification[]; total: number }>;
  getUnreadCount(userId: string): Promise<number>;
  markAsRead(notificationIds: string[], userId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
  delete(id: string, userId: string): Promise<boolean>;
}

export class NotificationMongoRepository implements INotificationRepository {
  async create(data: NotificationType): Promise<INotification> {
    const created = await NotificationModel.create(data);
    return created.toObject() as INotification;
  }

  async getByUserId(userId: string, page: number, limit: number): Promise<{ data: INotification[]; total: number }> {
    const [data, total] = await Promise.all([
      NotificationModel.find({ userId }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      NotificationModel.countDocuments({ userId }),
    ]);
    return { data: data.map((d) => d.toObject() as INotification), total };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return NotificationModel.countDocuments({ userId, read: false });
  }

  async markAsRead(notificationIds: string[], userId: string): Promise<void> {
    await NotificationModel.updateMany(
      { _id: { $in: notificationIds }, userId },
      { $set: { read: true } },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany({ userId, read: false }, { $set: { read: true } });
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await NotificationModel.findOneAndDelete({ _id: id, userId });
    return result !== null;
  }
}