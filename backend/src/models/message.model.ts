import mongoose, { Schema, Document } from "mongoose";
import { MessageType, messageStatuses } from "../types/message.type";

export interface IMessage extends MessageType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MessageMongoSchema: Schema<IMessage> = new Schema(
  {
    conversationId: { type: String, required: true, ref: "Conversation" },
    senderId: { type: String, required: true, ref: "User" },
    content: { type: String, required: true, maxlength: 5000 },
    status: { type: String, enum: messageStatuses, default: "sent" },
    attachments: { type: [String], default: [] },
  },
  { timestamps: true },
);

MessageMongoSchema.index({ conversationId: 1, createdAt: 1 });

export const MessageModel = mongoose.model<IMessage>("Message", MessageMongoSchema);