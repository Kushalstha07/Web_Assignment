"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { getConversations, getMessages, markMessagesAsRead, sendMessage, type ChatMessage, type Conversation } from "@/lib/api/message.api";

const formatTime = (value?: string) => value ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)) : "";

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getConversations();
      setConversations(response.data || []);
      setSelectedId((current) => current || response.data?.[0]?.id || "");
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load conversations");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (user) void loadConversations(); }, [user, loadConversations]);
  useEffect(() => {
    if (!selectedId) { setMessages([]); return; }
    void getMessages(selectedId).then((response) => {
      const next = response.data || [];
      setMessages(next);
      const unread = next.filter((message) => message.senderId !== user?.id && message.status !== "read").map((message) => message.id);
      if (unread.length) void markMessagesAsRead(unread);
    }).catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load messages"));
  }, [selectedId, user?.id]);

  const filtered = useMemo(() => conversations.filter((conversation) => (conversation.title || conversation.lastMessage || "Conversation").toLowerCase().includes(query.toLowerCase())), [conversations, query]);
  const selected = conversations.find((conversation) => conversation.id === selectedId);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!selectedId || !draft.trim()) return;
    try {
      setSending(true);
      const response = await sendMessage(selectedId, draft.trim());
      setMessages((current) => [...current, response.data]);
      setDraft("");
      await loadConversations();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to send message"); }
    finally { setSending(false); }
  }

  if (authLoading || loading) return <SkeletonCard />;
  if (!user) return null;

  return <div className="space-y-6">
    <div><h1 className="text-3xl font-bold text-[#0F172A]">Messages</h1><p className="mt-1 text-sm text-[#64748B]">Your real conversations, synced with the messaging API.</p></div>
    {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <div className="grid h-[calc(100vh-210px)] gap-6 lg:grid-cols-3">
      <Card padding="none" className="flex flex-col overflow-hidden">
        <div className="border-b p-4"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"/><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search conversations" className="pl-10"/></div></div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && <p className="p-6 text-center text-sm text-[#64748B]">No conversations yet.</p>}
          {filtered.map((conversation) => <button key={conversation.id} onClick={() => setSelectedId(conversation.id)} className={`w-full border-b p-4 text-left hover:bg-[#F8FAFC] ${selectedId === conversation.id ? "bg-[#EEF5FF]" : ""}`}>
            <p className="truncate text-sm font-semibold text-[#0F172A]">{conversation.title || "Conversation"}</p><p className="mt-1 truncate text-xs text-[#64748B]">{conversation.lastMessage || "No messages yet"}</p><p className="mt-1 text-[11px] text-[#94A3B8]">{formatTime(conversation.lastMessageAt)}</p>
          </button>)}
        </div>
      </Card>
      <Card padding="none" className="flex flex-col overflow-hidden lg:col-span-2">
        <div className="flex items-center gap-3 border-b p-4"><Avatar fallback={selected?.title || "Chat"}/><div><p className="font-semibold text-[#0F172A]">{selected?.title || "Select a conversation"}</p><p className="text-xs text-[#64748B]">{selected ? `${selected.participants.length} participants` : ""}</p></div></div>
        <div className="flex-1 space-y-3 overflow-y-auto bg-[#F8FAFC]/60 p-4">
          {selected && messages.length === 0 && <p className="text-center text-sm text-[#64748B]">Start the conversation.</p>}
          {messages.map((message) => { const mine = message.senderId === user.id; return <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}><div className={`max-w-[75%] rounded-2xl px-4 py-2 ${mine ? "rounded-tr-sm bg-[#2563EB] text-white" : "rounded-tl-sm bg-white text-[#0F172A] shadow-sm"}`}><p className="text-sm">{message.content}</p><p className={`mt-1 text-[10px] ${mine ? "text-blue-100" : "text-[#94A3B8]"}`}>{formatTime(message.createdAt)}</p></div></div>; })}
        </div>
        <form onSubmit={submit} className="flex gap-3 border-t p-4"><Input disabled={!selectedId || sending} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={selectedId ? "Type your message" : "Select a conversation"}/><button disabled={!selectedId || sending || !draft.trim()} className="rounded-xl bg-[#2563EB] p-3 text-white disabled:opacity-50"><Send className="h-5 w-5"/></button></form>
      </Card>
    </div>
  </div>;
}
