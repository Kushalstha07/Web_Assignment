"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageSquarePlus, Search, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { getUsers } from "@/lib/api/admin.api";
import { getAssignedStudents, getCounsellors } from "@/lib/api/counsellor.api";
import { createConversation, getConversations, getMessages, markMessagesAsRead, sendMessage, type ChatMessage, type Conversation } from "@/lib/api/message.api";

type Contact = { id: string; name: string; email: string; role: string };

const formatTime = (value?: string) => value ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)) : "";

function MessagesWorkspace() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const linkedConversation = searchParams.get("conversation") || "";
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactQuery, setContactQuery] = useState("");
  const [contactId, setContactId] = useState("");
  const [conversationTitle, setConversationTitle] = useState("");
  const [contactsLoading, setContactsLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);

  const loadConversations = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const response = await getConversations();
      const next = response.data || [];
      setConversations(next);
      setSelectedId((current) => {
        if (linkedConversation && next.some((conversation) => conversation.id === linkedConversation)) return linkedConversation;
        return current && next.some((conversation) => conversation.id === current) ? current : next[0]?.id || "";
      });
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load conversations");
    } finally { if (showLoading) setLoading(false); }
  }, [linkedConversation]);

  const loadMessages = useCallback(async () => {
    if (!selectedId) { setMessages([]); return; }
    try {
      const response = await getMessages(selectedId);
      const next = response.data || [];
      setMessages(next);
      const unread = next.filter((message) => message.senderId !== user?.id && message.status !== "read").map((message) => message.id);
      if (unread.length) {
        await markMessagesAsRead(unread);
        setMessages((current) => current.map((message) => unread.includes(message.id) ? { ...message, status: "read" } : message));
      }
      setError("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load messages"); }
  }, [selectedId, user?.id]);

  useEffect(() => {
    if (!user) return;
    const timer = window.setTimeout(() => void loadConversations(true), 0);
    return () => window.clearTimeout(timer);
  }, [user, loadConversations]);

  useEffect(() => {
    if (!selectedId) return;
    const first = window.setTimeout(() => void loadMessages(), 0);
    const poll = window.setInterval(() => void loadMessages(), 10000);
    return () => { window.clearTimeout(first); window.clearInterval(poll); };
  }, [selectedId, loadMessages]);

  useEffect(() => {
    if (!user || !newOpen) return;
    const loadContacts = async () => {
      try {
        setContactsLoading(true);
        setError("");
        if (user.role === "student") {
          const response = await getCounsellors();
          setContacts((response.data || []).filter((item) => item.userId !== user.id).map((item) => ({ id: item.userId, name: item.fullName, email: item.email, role: "counsellor" })));
        } else if (user.role === "counsellor") {
          const response = await getAssignedStudents();
          setContacts((response.data || []).map((item) => ({ id: item.id, name: item.fullName, email: item.email, role: item.role })));
        } else {
          const response = await getUsers(1, 100);
          setContacts((response.data || []).filter((item) => item.id !== user.id).map((item) => ({ id: item.id, name: item.fullName, email: item.email, role: item.role })));
        }
      } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load contacts"); }
      finally { setContactsLoading(false); }
    };
    void loadContacts();
  }, [newOpen, user]);

  const filtered = useMemo(() => conversations.filter((conversation) => (conversation.title || conversation.lastMessage || "Conversation").toLowerCase().includes(query.toLowerCase())), [conversations, query]);
  const filteredContacts = useMemo(() => contacts.filter((contact) => `${contact.name} ${contact.email} ${contact.role}`.toLowerCase().includes(contactQuery.toLowerCase())), [contacts, contactQuery]);
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

  async function startConversation(event: FormEvent) {
    event.preventDefault();
    const contact = contacts.find((item) => item.id === contactId);
    if (!contact) return;
    try {
      setCreating(true);
      const response = await createConversation([contact.id], conversationTitle.trim() || contact.name);
      setConversations((current) => [response.data, ...current]);
      setSelectedId(response.data.id);
      setNewOpen(false);
      setContactId("");
      setConversationTitle("");
      setContactQuery("");
      setError("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to start conversation"); }
    finally { setCreating(false); }
  }

  if (authLoading || loading) return <SkeletonCard />;
  if (!user) return null;

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Messages</h1><p className="mt-1 text-sm text-[#64748B]">Keep application conversations together and receive replies automatically.</p></div>
      <Button onClick={() => setNewOpen(true)}><MessageSquarePlus className="h-4 w-4"/>New conversation</Button>
    </div>
    {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <div className="grid gap-4 lg:h-[calc(100vh-210px)] lg:grid-cols-3">
      <Card padding="none" className="flex h-80 flex-col overflow-hidden lg:h-auto">
        <div className="border-b p-4"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"/><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search conversations" className="pl-10"/></div></div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && <div className="p-6 text-center"><p className="text-sm text-[#64748B]">No conversations yet.</p><button onClick={() => setNewOpen(true)} className="mt-2 text-sm font-semibold text-[#2563EB]">Start your first one</button></div>}
          {filtered.map((conversation) => <button key={conversation.id} onClick={() => setSelectedId(conversation.id)} className={`w-full border-b p-4 text-left hover:bg-[#F8FAFC] ${selectedId === conversation.id ? "bg-[#EEF5FF]" : ""}`}>
            <p className="truncate text-sm font-semibold text-[#0F172A]">{conversation.title || "Conversation"}</p><p className="mt-1 truncate text-xs text-[#64748B]">{conversation.lastMessage || "No messages yet"}</p><p className="mt-1 text-[11px] text-[#94A3B8]">{formatTime(conversation.lastMessageAt)}</p>
          </button>)}
        </div>
      </Card>
      <Card padding="none" className="flex h-[560px] flex-col overflow-hidden lg:col-span-2 lg:h-auto">
        <div className="flex items-center gap-3 border-b p-4"><Avatar fallback={selected?.title || "Chat"}/><div><p className="font-semibold text-[#0F172A]">{selected?.title || "Select a conversation"}</p><p className="text-xs text-[#64748B]">{selected ? `${selected.participants.length} participants` : ""}</p></div></div>
        <div className="flex-1 space-y-3 overflow-y-auto bg-[#F8FAFC]/60 p-4">
          {!selected && <div className="flex h-full items-center justify-center text-center"><div><MessageSquarePlus className="mx-auto h-10 w-10 text-[#94A3B8]"/><p className="mt-3 text-sm text-[#64748B]">Choose a conversation or start a new one.</p></div></div>}
          {selected && messages.length === 0 && <p className="text-center text-sm text-[#64748B]">Start the conversation.</p>}
          {messages.map((message) => { const mine = message.senderId === user.id; return <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}><div className={`max-w-[75%] rounded-2xl px-4 py-2 ${mine ? "rounded-tr-sm bg-[#2563EB] text-white" : "rounded-tl-sm bg-white text-[#0F172A] shadow-sm"}`}><p className="whitespace-pre-wrap break-words text-sm">{message.content}</p><p className={`mt-1 text-[10px] ${mine ? "text-blue-100" : "text-[#94A3B8]"}`}>{formatTime(message.createdAt)}{mine ? ` · ${message.status}` : ""}</p></div></div>; })}
        </div>
        <form onSubmit={submit} className="flex gap-3 border-t p-4"><Input disabled={!selectedId || sending} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={selectedId ? "Type your message" : "Select a conversation"}/><button aria-label="Send message" disabled={!selectedId || sending || !draft.trim()} className="rounded-xl bg-[#2563EB] p-3 text-white disabled:opacity-50"><Send className="h-5 w-5"/></button></form>
      </Card>
    </div>

    <Modal isOpen={newOpen} onClose={() => setNewOpen(false)} title="Start a conversation">
      <form onSubmit={startConversation} className="space-y-4">
        <Input value={conversationTitle} onChange={(event) => setConversationTitle(event.target.value)} maxLength={200} placeholder="Conversation title (optional)"/>
        <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"/><Input value={contactQuery} onChange={(event) => setContactQuery(event.target.value)} placeholder="Search people" className="pl-10"/></div>
        <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-[#E2E8F0] p-2">
          {contactsLoading && <p className="p-4 text-center text-sm text-[#64748B]">Loading people…</p>}
          {!contactsLoading && filteredContacts.length === 0 && <p className="p-4 text-center text-sm text-[#64748B]">No available contacts found.</p>}
          {filteredContacts.map((contact) => <label key={contact.id} className={`flex cursor-pointer items-center gap-3 rounded-xl p-3 transition ${contactId === contact.id ? "bg-[#EEF5FF]" : "hover:bg-[#F8FAFC]"}`}>
            <input type="radio" name="contact" value={contact.id} checked={contactId === contact.id} onChange={() => setContactId(contact.id)} className="sr-only"/>
            <Avatar fallback={contact.name}/><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[#0F172A]">{contact.name}</span><span className="block truncate text-xs text-[#64748B]">{contact.email} · {contact.role}</span></span>
          </label>)}
        </div>
        <div className="flex justify-end gap-3"><Button type="button" variant="secondary" onClick={() => setNewOpen(false)}>Cancel</Button><Button type="submit" loading={creating} disabled={!contactId}>Start conversation</Button></div>
      </form>
    </Modal>
  </div>;
}

export default function MessagesPage() {
  return <Suspense fallback={<SkeletonCard/>}><MessagesWorkspace/></Suspense>;
}
