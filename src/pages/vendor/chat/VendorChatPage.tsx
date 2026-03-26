import { useParams } from "react-router-dom";
import ChatWindow from "@/components/chat/ChatWindow";
import Sidebar from "@/components/vendor/dashboard/shared/Sidebar";

const VendorChatPage = () => {
  const { conversationId } = useParams<{ conversationId: string }>();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-56 p-8">
        <h1 className="text-2xl font-bold mb-6">User Chat</h1>
        <div className="h-[calc(100vh-180px)] min-h-[550px]">
          {conversationId ? (
            <ChatWindow conversationId={conversationId} />
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-100">
              Select a conversation to start chatting.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VendorChatPage;
