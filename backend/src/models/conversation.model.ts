import mongoose, { Schema, Document } from "mongoose";
import { ConversationType } from "../types/message.type";

export interface IConversation extends ConversationType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationMongoSchema: Schema<IConversation> = new Schema(
  {
    participants: { type: [String], required: true, validate: [(arr: string[]) => arr.length >= 2, "Need at least 2 participants"] },
    title: { type: String, maxlength: 200, default: "" },
    lastMessage: { type: String, default: null },
    lastMessageAt: { type: String, default: null },
  },
  { timestamps: true },
);

ConversationMongoSchema.index({ participants: 1 });
export const ConversationModel = mongoose.model<IConversation>("Conversation", ConversationMongoSchema);