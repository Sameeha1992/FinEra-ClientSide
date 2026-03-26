import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { chatService } from "@/api/chat/chat.service";
import type { ChatConversationDto } from "@/interfaces/chat/chat.interface";

function formatTime(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  }
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const ConversationSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100">
        <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-slate-200 rounded w-1/3" />
          <div className="h-3 bg-slate-100 rounded w-2/3" />
        </div>
        <div className="h-3 bg-slate-100 rounded w-10" />
      </div>
    ))}
  </div>
);

const UserConversationsPage = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ChatConversationDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    chatService
      .getConversations()
      .then(setConversations)
      .catch(() => setError("Failed to load conversations."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Chats</h1>
          <p className="text-sm text-gray-500">Your conversations with vendors</p>
        </div>
      </div>

      {/* Content card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {isLoading && <ConversationSkeleton />}

        {!isLoading && error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        {!isLoading && !error && conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium">No conversations yet</p>
            <p className="text-xs mt-1 text-slate-400">
              Open an application and click "Chat with Vendor" to start
            </p>
          </div>
        )}

        {!isLoading && !error && conversations.length > 0 && (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.conversationId}
                onClick={() => navigate(`/user/chat/${conv.conversationId}`)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all group text-left"
              >
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-base shrink-0 uppercase">
                  {conv.vendorName?.charAt(0) || "V"}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {conv.vendorName || "Vendor Support"}
                  </p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {conv.lastMessage ?? "No messages yet"}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {conv.lastMessageAt && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock size={11} />
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  )}
                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-teal-500 transition-colors"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserConversationsPage;
