"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, RefreshCw, Send, Sparkles, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { sendAiChat, type AiChatMessage } from "@/lib/api/ai.api";

type ChatItem = AiChatMessage & {
  id: string;
};

const starterByRole: Record<string, string[]> = {
  student: [
    "Which scholarships should I focus on first?",
    "Help me plan my SOP for a computer science application.",
    "What documents should I prepare before applying abroad?",
  ],
  counsellor: [
    "Create a checklist for reviewing a student's application.",
    "How should I explain scholarship fit to a student?",
    "Draft follow-up questions for a student planning to study abroad.",
  ],
  admin: [
    "Suggest improvements for our scholarship listings.",
    "Create a student support workflow for applications.",
    "Summarize what an education consultancy dashboard should track.",
  ],
};

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function AiChatPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi, I am EduGlobal AI. Ask me about universities, scholarships, applications, documents, or visa preparation.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [authLoading, user, router]);
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, sending]);

  const starters = useMemo(() => starterByRole[user?.role || "student"] || starterByRole.student, [user?.role]);

  async function submitMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || sending) return;

    const userMessage: ChatItem = { id: makeId(), role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft("");
    setError("");

    try {
      setSending(true);
      const response = await sendAiChat(nextMessages.map(({ role, content }) => ({ role, content })).slice(-12));
      if (!response.success) throw new Error(response.message);
      setMessages((current) => [...current, { id: makeId(), role: "assistant", content: response.data.reply }]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to get an AI reply.");
    } finally {
      setSending(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitMessage(draft);
  }

  if (authLoading) return <SkeletonCard/>;
  if (!user) return null;

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">AI Chat</h1><p className="mt-1 text-sm text-[#64748B]">Chat with EduGlobal AI for practical study-abroad guidance.</p></div>
      <Button variant="secondary" onClick={() => { setMessages(messages.slice(0, 1)); setError(""); setDraft(""); }}><RefreshCw className="h-4 w-4"/>New chat</Button>
    </div>

    {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Card padding="none" className="flex h-[calc(100vh-220px)] min-h-[560px] flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-[#E7EDF6] p-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EEF5FF] text-[#2563EB]"><Bot className="h-5 w-5"/></span><div><p className="font-semibold text-[#0F172A]">EduGlobal AI</p><p className="text-xs text-[#64748B]">Powered by your Google AI key</p></div></div>
        <div className="flex-1 space-y-4 overflow-y-auto bg-[#F8FAFC]/70 p-4">
          {messages.map((message) => {
            const mine = message.role === "user";
            return <div key={message.id} className={`flex gap-3 ${mine ? "justify-end" : "justify-start"}`}>
              {!mine && <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-[#2563EB] shadow-sm"><Bot className="h-4 w-4"/></span>}
              <div className={`max-w-[82%] rounded-2xl px-4 py-3 ${mine ? "rounded-tr-sm bg-[#2563EB] text-white" : "rounded-tl-sm bg-white text-[#0F172A] shadow-sm"}`}><p className="whitespace-pre-wrap break-words text-sm leading-6">{message.content}</p></div>
              {mine && <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#0F172A] text-white"><User className="h-4 w-4"/></span>}
            </div>;
          })}
          {sending && <div className="flex gap-3"><span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-[#2563EB] shadow-sm"><Bot className="h-4 w-4"/></span><div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm text-[#64748B] shadow-sm">Thinking...</div></div>}
          <div ref={scrollRef}/>
        </div>
        <form onSubmit={submit} className="border-t border-[#E7EDF6] bg-white p-4">
          <div className="flex gap-3"><Textarea value={draft} onChange={(event) => setDraft(event.target.value)} disabled={sending} placeholder="Ask about applications, scholarships, universities, SOPs, visas..." className="min-h-[52px] resize-none"/><button aria-label="Send AI message" disabled={sending || !draft.trim()} className="h-[52px] rounded-xl bg-[#2563EB] px-4 text-white disabled:opacity-50"><Send className="h-5 w-5"/></button></div>
        </form>
      </Card>

      <div className="space-y-4">
        <Card><h2 className="flex items-center gap-2 font-bold text-[#0F172A]"><Sparkles className="h-5 w-5 text-[#2563EB]"/>Try asking</h2><div className="mt-4 space-y-2">{starters.map((starter) => <button key={starter} onClick={() => void submitMessage(starter)} disabled={sending} className="w-full rounded-xl border border-[#E7EDF6] bg-white p-3 text-left text-sm text-[#334155] transition hover:border-[#2563EB] hover:bg-[#EEF5FF] disabled:opacity-60">{starter}</button>)}</div></Card>
        <Card><p className="text-sm font-semibold text-[#0F172A]">Quick note</p><p className="mt-2 text-sm leading-6 text-[#64748B]">AI guidance can help you prepare, but verify admission, visa, scholarship, and deadline details with official sources before making decisions.</p></Card>
      </div>
    </div>
  </div>;
}
