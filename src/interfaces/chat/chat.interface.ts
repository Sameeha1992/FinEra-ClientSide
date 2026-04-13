export interface ChatMessageDto {
  messageId: string;
  conversationId: string;
  senderId: string;
  role: "User" | "Vendor";
  senderRole?:string;
  text: string;
  createdAt: string;
}

export interface ChatConversationDto {
  conversationId: string;
  applicationId: string;
  userId: string;
  vendorId: string;
  userName?: string;
  vendorName?: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
}

export interface SendMessagePayload {
  conversationId: string;
  senderId: string;
  role: "User" | "Vendor";
  text: string;
}

export interface ChatWindowProps {
  conversationId: string;
  otherParticipantName?: string;
}
