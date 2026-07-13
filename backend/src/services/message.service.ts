import { MessageMongoRepository } from "../repositories/message.repository";
import { ConversationType, MessageType } from "../types/message.type";
import { CreateConversationDTOType, SendMessageDTOType, MarkReadDTOType } from "../dtos/message.dto";
import { HttpException } from "../exceptions/http-exception";
import { IConversation } from "../models/conversation.model";
import { IMessage } from "../models/message.model";
import { notificationService } from "./notification.service";

const msgRepo = new MessageMongoRepository();

export type SafeConversation = { id: string; participants: string[]; title?: string; lastMessage?: string; lastMessageAt?: string; createdAt: string; updatedAt: string };
export type SafeMessage = { id: string; conversationId: string; senderId: string; content: string; status: string; attachments: string[]; createdAt: string; updatedAt: string };

function toSafeConversation(c: IConversation): SafeConversation {
  const d = c as any;
  return { id: c._id.toString(), participants: c.participants, title: c.title, lastMessage: c.lastMessage, lastMessageAt: c.lastMessageAt, createdAt: d.createdAt?.toISOString?.() || String(d.createdAt), updatedAt: d.updatedAt?.toISOString?.() || String(d.updatedAt) };
}

function toSafeMessage(m: IMessage): SafeMessage {
  const d = m as any;
  return { id: m._id.toString(), conversationId: m.conversationId, senderId: m.senderId, content: m.content, status: m.status, attachments: m.attachments || [], createdAt: d.createdAt?.toISOString?.() || String(d.createdAt), updatedAt: d.updatedAt?.toISOString?.() || String(d.updatedAt) };
}

export class MessageService {
  async createConversation(data: CreateConversationDTOType, userId: string): Promise<SafeConversation> {
    const allParticipants = [...new Set([...data.participantIds, userId])];
    const convData: ConversationType = { participants: allParticipants, title: data.title };
    const created = await msgRepo.createConversation(convData);
    return toSafeConversation(created);
  }

  async getMyConversations(userId: string): Promise<SafeConversation[]> {
    const convs = await msgRepo.getConversationsForUser(userId);
    return convs.map(toSafeConversation);
  }

  async getConversationById(id: string, userId: string): Promise<SafeConversation> {
    const conv = await msgRepo.getConversationById(id);
    if (!conv) throw new HttpException(404, "Conversation not found");
    if (!conv.participants.includes(userId)) throw new HttpException(403, "You are not a participant");
    return toSafeConversation(conv);
  }

  async sendMessage(data: SendMessageDTOType, senderId: string): Promise<SafeMessage> {
    const conv = await msgRepo.getConversationById(data.conversationId);
    if (!conv) throw new HttpException(404, "Conversation not found");
    if (!conv.participants.includes(senderId)) throw new HttpException(403, "You are not a participant");

    const msgData: MessageType = { conversationId: data.conversationId, senderId, content: data.content, status: "sent", attachments: data.attachments || [] };
    const msg = await msgRepo.sendMessage(msgData);
    await msgRepo.updateConversationLastMessage(data.conversationId, data.content.substring(0, 100));
    await Promise.all(conv.participants
      .filter((participantId) => participantId !== senderId)
      .map((participantId) => notificationService.notify({
        userId: participantId,
        title: conv.title || "New message",
        message: data.content.length > 120 ? `${data.content.slice(0, 117)}...` : data.content,
        type: "info",
        category: "message",
        link: `/messages?conversation=${data.conversationId}`,
        metadata: { conversationId: data.conversationId, messageId: msg._id.toString() },
      })));
    return toSafeMessage(msg);
  }

  async getMessages(conversationId: string, userId: string, page: number, limit: number): Promise<{ data: SafeMessage[]; total: number }> {
    const conv = await msgRepo.getConversationById(conversationId);
    if (!conv) throw new HttpException(404, "Conversation not found");
    if (!conv.participants.includes(userId)) throw new HttpException(403, "You are not a participant");
    const result = await msgRepo.getMessages(conversationId, page, limit);
    return { data: result.data.map(toSafeMessage), total: result.total };
  }

  async markAsRead(data: MarkReadDTOType, userId: string): Promise<void> {
    await msgRepo.markAsRead(data.messageIds, userId);
  }
}

export const messageService = new MessageService();
