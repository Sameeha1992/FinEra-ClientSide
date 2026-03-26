import { useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { chatService } from "@/api/chat/chat.service";
import toast from "react-hot-toast";

interface ChatButtonProps {
  applicationId: string;
  /**
   * Pass "user" when rendering on the user application detail page,
   * or "vendor" when rendering on the vendor application detail page.
   * This determines where to navigate after the conversation is created.
   */
  viewerRole: "user" | "vendor";
  /** Optional extra className for layout/spacing */
  className?: string;
}

/**
 * ChatButton — drop this anywhere on an application detail page.
 *
 * User side:   navigates to /user/chat/:conversationId
 * Vendor side: navigates to /vendor/chat/:conversationId
 *
 * Usage (user side):
 *   <ChatButton applicationId={data.applicationId} viewerRole="user" />
 *
 * Usage (vendor side):
 *   <ChatButton applicationId={applicationId} viewerRole="vendor" />
 */
const ChatButton = ({ applicationId, viewerRole, className = "" }: ChatButtonProps) => {
  const navigate = useNavigate();
  const auth = useAppSelector((s) => s.auth);
  const [loading, setLoading] = useState(false);

  const handleOpenChat = async () => {
    if (!auth.isAuthenticated) {
      toast.error("Please log in to use chat.");
      return;
    }

    setLoading(true);
    try {
      const conversation = await chatService.createOrGetConversation(applicationId);
      const route =
        viewerRole === "vendor"
          ? `/vendor/chat/${conversation.conversationId}`
          : `/user/chat/${conversation.conversationId}`;
      navigate(route);
    } catch {
      toast.error("Could not open chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const label = viewerRole === "vendor" ? "Chat with User" : "Chat with Vendor";

  return (
    <button
      onClick={handleOpenChat}
      disabled={loading}
      className={[
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl",
        "bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium",
        "transition-colors shadow-sm shadow-teal-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <MessageCircle size={16} />
      )}
      {label}
    </button>
  );
};

export default ChatButton;
