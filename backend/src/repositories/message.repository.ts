import { ConversationModel, IConversation } from "../models/conversation.model";
import { MessageModel, IMessage } from "../models/message.model";
import { ConversationType, MessageType } from "../types/message.type";

export interface IMessageRepository {
  createConversation(data: ConversationType): Promise<IConversation>;
  getConversationsForUser(userId: string): Promise<IConversation[]>;
  getConversationById(id: string): Promise<IConversation | null>;
  sendMessage(data: MessageType): Promise<IMessage>;
  getMessages(conversationId: string, page: number, limit: number): Promise<{ data: IMessage[]; total: number }>;
  markAsRead(messageIds: string[], userId: string): Promise<void>;
  updateConversationLastMessage(conversationId: string, content: string): Promise<void>;
}

export class MessageMongoRepository implements IMessageRepository {
  async createConversation(data: ConversationType): Promise<IConversation> {
    const created = await ConversationModel.create(data);
    return created.toObject() as IConversation;
  }

  async getConversationsForUser(userId: string): Promise<IConversation[]> {
    const docs = await ConversationModel.find({ participants: userId }).sort({ lastMessageAt: -1, updatedAt: -1 });
    return docs.map((d) => d.toObject() as IConversation);
  }

  async getConversationById(id: string): Promise<IConversation | null> {
    const doc = await ConversationModel.findById(id);
    return doc ? (doc.toObject() as IConversation) : null;
  }

  async sendMessage(data: MessageType): Promise<IMessage> {
    const created = await MessageModel.create(data);
    return created.toObject() as IMessage;
  }

  async getMessages(conversationId: string, page: number, limit: number): Promise<{ data: IMessage[]; total: number }> {
    const [data, total] = await Promise.all([
      MessageModel.find({ conversationId }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      MessageModel.countDocuments({ conversationId }),
    ]);
    return { data: data.map((d) => d.toObject() as IMessage).reverse(), total };
  }

  async markAsRead(messageIds: string[], userId: string): Promise<void> {
    const conversations = await ConversationModel.find({ participants: userId }).select("_id");
    const conversationIds = conversations.map((conversation) => conversation._id.toString());
    await MessageModel.updateMany(
      { _id: { $in: messageIds }, conversationId: { $in: conversationIds }, senderId: { $ne: userId } },
      { $set: { status: "read" } },
    );
  }

  async updateConversationLastMessage(conversationId: string, content: string): Promise<void> {
    await ConversationModel.findByIdAndUpdate(conversationId, {
      $set: { lastMessage: content, lastMessageAt: new Date().toISOString() },
    });
  }
}
