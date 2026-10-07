import { http } from "./client";

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: "CUSTOMER" | "VENDOR" | "ADMIN";
  text: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: string;
  };
}

export interface Conversation {
  id: string;
  customerId: string;
  vendorId: string;
  productId?: string | null;
  subOrderId?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  unreadCountCustomer: number;
  unreadCountVendor: number;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  vendor?: {
    id: string;
    storeName: string;
    storeSlug: string;
    storeLogo?: string | null;
    ratingAvg: number | string;
  };
  product?: {
    id: string;
    title: string;
    slug: string;
    images: string[];
    basePrice: number | string;
    discountPrice?: number | string | null;
  } | null;
  subOrder?: {
    id: string;
    status: string;
    trackingNumber?: string | null;
    subtotal: number | string;
    order?: {
      id: string;
      orderNumber: string;
    };
  } | null;
  messages?: ChatMessage[];
}

export interface CreateConversationPayload {
  vendorId: string;
  productId?: string;
  subOrderId?: string;
  initialMessage?: string;
}

export interface SendMessagePayload {
  text: string;
  attachments?: string[];
}

export const chatApi = {
  getConversations: async () => {
    const res = await http.get<Conversation[]>("/chats");
    return res.data;
  },

  getConversationById: async (id: string) => {
    const res = await http.get<Conversation>(`/chats/${id}`);
    return res.data;
  },

  getOrCreateConversation: async (payload: CreateConversationPayload) => {
    const res = await http.post<Conversation, CreateConversationPayload>("/chats", payload);
    return res.data;
  },

  getMessages: async (conversationId: string, page = 1, limit = 50) => {
    const res = await http.get<ChatMessage[]>(`/chats/${conversationId}/messages`, {
      page,
      limit,
    });
    return res.data;
  },

  sendMessage: async (conversationId: string, payload: SendMessagePayload) => {
    const res = await http.post<ChatMessage, SendMessagePayload>(
      `/chats/${conversationId}/messages`,
      payload,
    );
    return res.data;
  },

  markAsRead: async (conversationId: string) => {
    const res = await http.patch<{ success: boolean }>(`/chats/${conversationId}/read`);
    return res.data;
  },

  getVendors: async () => {
    const res = await http.get<Array<{ id: string; storeName: string; storeSlug: string; storeLogo?: string | null; ratingAvg?: number; description?: string }>>("/vendor-profiles");
    return res.data;
  },
};
