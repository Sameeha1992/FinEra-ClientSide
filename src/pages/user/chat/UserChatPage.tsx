import { useParams } from "react-router-dom";
import ChatWindow from "@/components/chat/ChatWindow";

const UserChatPage = () => {
  const { conversationId } = useParams<{ conversationId: string }>();

  if (!conversationId) {
    return <div className="p-8 text-slate-400">No chat selected.</div>;
  }

  return (
    <div className="h-[calc(100vh-160px)] min-h-[500px]">
      <ChatWindow conversationId={conversationId} />
    </div>
  );
};

export default UserChatPage;
