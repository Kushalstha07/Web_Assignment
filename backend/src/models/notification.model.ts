import mongoose, { Schema, Document } from "mongoose";
import { NotificationType, notificationTypes, notificationCategories } from "../types/notification.type";

export interface INotification extends NotificationType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationMongoSchema: Schema<INotification> = new Schema(
  {
    userId: { type: String, required: true, ref: "User" },
    title: { type: String, required: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 1000 },
    type: { type: String, enum: notificationTypes, default: "info" },
    category: { type: String, enum: notificationCategories, default: "system" },
    read: { type: Boolean, default: false },
    link: { type: String, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

NotificationMongoSchema.index({ userId: 1, createdAt: -1 });
NotificationMongoSchema.index({ userId: 1, read: 1 });

export const NotificationModel = mongoose.model<INotification>("Notification", NotificationMongoSchema);