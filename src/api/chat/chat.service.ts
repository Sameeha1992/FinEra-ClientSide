import axiosInstance from "@/config/axiosInterceptor";


export const chatService = {
  async createOrGetConversation(applicationId: string) {
    const response = await axiosInstance.post("/chat/conversation", {
      applicationId,
    });
    console.log("create and get the chat", response.data.data)
    return response.data.data;
  },

  async getConversations() {
    const response = await axiosInstance.get("/chat/conversations");
    console.log("get conversation", response.data.data)
    return response.data.data;
  },

  async getMessages(conversationId: string) {
    const response = await axiosInstance.get(`/chat/${conversationId}/messages`);

    console.log("get messages", response.data.data)
    return response.data.data;
  },
  
  async getConversationDetails(conversationId: string) {
    const response = await axiosInstance.get(`/chat/${conversationId}`);
    return response.data.data;
  },
};