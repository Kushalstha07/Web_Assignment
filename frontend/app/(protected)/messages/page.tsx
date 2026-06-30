"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Sparkles } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  online: boolean;
}

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Messages</h1>
          <p className="mt-1 text-sm text-[#64748B]">Loading...</p>
        </div>
        <SkeletonCard />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const mockMessages: Message[] = [
    {
      id: "1",
      sender: "Sarah Williams",
      avatar: undefined,
      lastMessage: "I've reviewed John's application. Looks good!",
      time: "2 min ago",
      unread: true,
      online: true,
    },
    {
      id: "2",
      sender: "Michael Brown",
      avatar: undefined,
      lastMessage: "Can we schedule a call for tomorrow?",
      time: "1 hour ago",
      unread: true,
      online: false,
    },
    {
      id: "3",
      sender: "John Doe",
      avatar: undefined,
      lastMessage: "Thank you for the update on my visa status",
      time: "3 hours ago",
      unread: false,
      online: true,
    },
    {
      id: "4",
      sender: "Emily Davis",
      avatar: undefined,
      lastMessage: "The documents have been uploaded successfully",
      time: "5 hours ago",
      unread: false,
      online: false,
    },
    {
      id: "5",
      sender: "Jennifer Taylor",
      avatar: undefined,
      lastMessage: "I need help with my scholarship application",
      time: "1 day ago",
      unread: false,
      online: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A]">Messages</h1>
        <p className="mt-1 text-sm text-[#64748B]">Communicate with students and team members</p>
      </div>

      {/* Messages Container */}
      <div className="grid gap-6 lg:grid-cols-3 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card padding="none" className="overflow-hidden flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-[#E5E7EB]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {mockMessages.map((message) => (
              <div
                key={message.id}
                className={`flex items-center gap-3 p-4 border-b border-[#E5E7EB] cursor-pointer transition-all hover:bg-[#F8FAFC] ${
                  message.unread ? "bg-[#EEF5FF]/50" : ""
                }`}
              >
                <div className="relative">
                  <Avatar src={message.avatar} fallback={message.sender} size="md" />
                  {message.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#22C55E]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-sm font-semibold text-[#0F172A] truncate ${message.unread ? "font-bold" : ""}`}>
                      {message.sender}
                    </p>
                    <span className="text-xs text-[#64748B]">{message.time}</span>
                  </div>
                  <p className={`text-sm truncate ${message.unread ? "font-medium text-[#0F172A]" : "text-[#64748B]"}`}>
                    {message.lastMessage}
                  </p>
                </div>
                {message.unread && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
                    1
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Area */}
        <Card padding="none" className="overflow-hidden flex flex-col lg:col-span-2">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <Avatar fallback="SW" size="md" />
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Sarah Williams</h3>
                <p className="text-xs text-[#22C55E]">Online</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg p-2 text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A]">
                <Phone className="h-5 w-5" />
              </button>
              <button className="rounded-lg p-2 text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A]">
                <Video className="h-5 w-5" />
              </button>
              <button className="rounded-lg p-2 text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A]">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Date Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[#E5E7EB]" />
              <span className="text-xs font-medium text-[#64748B]">Today</span>
              <div className="flex-1 h-px bg-[#E5E7EB]" />
            </div>

            {/* Received Message */}
            <div className="flex gap-3">
              <Avatar fallback="SW" size="sm" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-[#0F172A]">Sarah Williams</span>
                  <span className="text-xs text-[#94A3B8]">10:30 AM</span>
                </div>
                <div className="inline-block rounded-2xl rounded-tl-sm bg-[#F8FAFC] px-4 py-2">
                  <p className="text-sm text-[#0F172A]">Hi! I've reviewed John's application for University of Toronto.</p>
                </div>
              </div>
            </div>

            {/* Sent Message */}
            <div className="flex gap-3 justify-end">
              <div className="flex-1 flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#94A3B8]">10:32 AM</span>
                </div>
                <div className="inline-block rounded-2xl rounded-tr-sm bg-[#2563EB] px-4 py-2">
                  <p className="text-sm text-white">Great! What are your thoughts?</p>
                </div>
              </div>
            </div>

            {/* Received Message */}
            <div className="flex gap-3">
              <Avatar fallback="SW" size="sm" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-[#0F172A]">Sarah Williams</span>
                  <span className="text-xs text-[#94A3B8]">10:33 AM</span>
                </div>
                <div className="inline-block rounded-2xl rounded-tl-sm bg-[#F8FAFC] px-4 py-2">
                  <p className="text-sm text-[#0F172A]">Looks good! His GPA is strong and the essays are well-written. I think he has a good chance of getting in. Should we proceed with the application?</p>
                </div>
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#2563EB]">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-[#7C3AED]">AI Assistant</span>
                  <Badge variant="purple" size="sm">Suggested Reply</Badge>
                </div>
                <div className="inline-block rounded-2xl rounded-tl-sm border-2 border-dashed border-[#7C3AED]/30 bg-[#7C3AED]/5 px-4 py-2">
                  <p className="text-sm text-[#0F172A]">Yes, let's proceed! Please submit the application and schedule a call with John to discuss the next steps.</p>
                </div>
                <button className="mt-2 text-xs font-semibold text-[#7C3AED] hover:underline">
                  Use this reply
                </button>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <button className="rounded-lg p-2 text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A]">
                <Paperclip className="h-5 w-5" />
              </button>
              <Input
                placeholder="Type your message..."
                className="flex-1"
              />
              <button className="rounded-lg bg-[#2563EB] p-2 text-white transition-all hover:bg-[#1D4ED8]">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

