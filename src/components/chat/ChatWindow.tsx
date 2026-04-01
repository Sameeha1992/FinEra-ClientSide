import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft, Send, MessageCircle, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { socket } from "@/config/socket";
import { chatService } from "@/api/chat/chat.service";
import type { ChatMessageDto, ChatWindowProps, SendMessagePayload, ChatConversationDto } from "@/interfaces/chat/chat.interface";

// ─── Auth adapter ─────────────────────────────────────────────────────────────
function useCurrentUser() {
  const auth = useAppSelector((state) => state.auth);
  return {
    id: auth.Id ?? "",
    role: auth.role ?? "user",
    name: auth.name ?? "You",
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateDivider(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function isSameDay(a: string, b: string): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

// ─── Main Component ───────────────────────────────────────────────────────────

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
}) => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [conversation, setConversation] = useState<ChatConversationDto | null>(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socketError, setSocketError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  }, []);

  // Fetch history and conversation details
  useEffect(() => {
    if (!conversationId) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([
      chatService.getMessages(conversationId),
      chatService.getConversationDetails(conversationId)
    ])
      .then(([msgs, details]) => {
        if (!cancelled) {
          setMessages(msgs);
          setConversation(details);
          setIsLoading(false);
          setTimeout(() => scrollToBottom("instant"), 50);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.response?.data?.message || "Failed to load chat data.");
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [conversationId, scrollToBottom]);

  const accessToken = useAppSelector((state) => state.token.accessToken);
  
  useEffect(() => {
    if (!conversationId) return;

    socket.auth = { token: accessToken || "" };
    
    if (!socket.connected) socket.connect();
    socket.emit("join_conversation", conversationId);

    const handleReceiveMessage = (msg: ChatMessageDto) => {
      setMessages((prev) => {
        if (prev.some((m) => m.messageId === msg.messageId)) return prev;
        return [...prev, msg];
      });
      setTimeout(() => scrollToBottom(), 60);
    };

    const handleChatError = (payload: { message: string }) => {
      setSocketError(payload.message);
      setIsSending(false);
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("chat_error", handleChatError);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("chat_error", handleChatError);
      socket.disconnect();
    };
  }, [conversationId, scrollToBottom]);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || isSending) return;

    const payload: SendMessagePayload = {
      conversationId,
      senderId: currentUser.id,
      role: currentUser.role.toUpperCase() as "User" | "Vendor",
      text,
    };

    setIsSending(true);
    setSocketError(null);
    setInputText("");
    socket.emit("send_message", payload);

    setTimeout(() => setIsSending(false), 2000);
    inputRef.current?.focus();
  }, [inputText, isSending, conversationId, currentUser]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const otherName = currentUser.role === "vendor" ? conversation?.userName : conversation?.vendorName;
  const otherRole = currentUser.role === "vendor" ? "User Applicant" : "Vendor Support";

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-slate-100 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0 uppercase tracking-tighter">
            {otherName?.charAt(0) || otherRole.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {otherName || otherRole}
            </p>
            <p className="text-xs text-slate-400">
              {otherRole}
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400">Live</span>
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 scroll-smooth">
        {isLoading ? (
          <div className="animate-pulse space-y-4 px-4 py-8">
            <div className="h-10 bg-slate-200 rounded-full w-48" />
            <div className="h-10 bg-slate-200 rounded-full w-36 ml-auto" />
            <div className="h-10 bg-slate-200 rounded-full w-64" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 m-4 p-4 rounded-xl border border-red-100 bg-red-50 text-red-600 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
            <MessageCircle size={32} />
            <p className="text-sm">No messages yet. Say hello!</p>
          </div>
        ) : (() => {
          const nodes: React.ReactNode[] = [];
          messages.forEach((msg, idx) => {
            const prevMsg = messages[idx-1];
            
            if (!prevMsg || !isSameDay(prevMsg.createdAt, msg.createdAt)) {
              nodes.push(
                <div key={`date-${msg.messageId}`} className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{formatDateDivider(msg.createdAt)}</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
              );
            }

            const senderRole = msg.senderRole?.toUpperCase();
            const isVendor = senderRole === "VENDOR";
            const isOwn = String(msg.senderId) === String(currentUser.id);
            
            nodes.push(
              <div key={msg.messageId} className={`flex ${isVendor ? "justify-end" : "justify-start"} mb-2`}>
                <div className="flex flex-col max-w-[80%]">
                  <span className={`text-[10px] font-bold mb-1 ml-1 uppercase tracking-tight ${isVendor ? "text-emerald-600 text-right mr-1" : "text-blue-600 self-start"}`}>
                    {isVendor 
                      ? (conversation?.vendorName || "Vendor Support") 
                      : (conversation?.userName || "User Applicant")} {isOwn && "(You)"}
                  </span>
                  <div 
                    className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm relative ${
                      isVendor 
                        ? "bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-tr-sm" 
                        : "bg-blue-50 text-blue-900 border border-blue-100 rounded-tl-sm"
                    } ${isOwn ? "ring-1 ring-offset-1 ring-slate-200" : ""}`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <p className={`text-[9px] mt-1 text-right ${isVendor ? "text-emerald-500" : "text-blue-500"}`}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          });
          return nodes;
        })()}
        <div ref={bottomRef} />
      </div>

      {/* Error banner */}
      {socketError && (
        <div className="mx-4 mb-2 p-2 bg-red-50 text-red-500 text-[11px] rounded-lg border border-red-100 italic">
          ⚠️ {socketError}
        </div>
      )}

      {/* Input area */}
      <div className="shrink-0 p-4 bg-white border-t border-slate-100">
        <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
          <textarea
            ref={inputRef}
            rows={1}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            className="flex-1 resize-none bg-transparent text-sm text-slate-800 outline-none max-h-32 pt-1"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isSending}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${inputText.trim() ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-400"}`}
          >
            {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
