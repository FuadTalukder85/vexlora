import { create } from "zustand";
import { chatApi, Conversation, ChatMessage } from "@/lib/api/chat";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";

export type { Conversation, ChatMessage };

interface ChatState {
  isOpen: boolean;
  activeConversation: Conversation | null;
  conversations: Conversation[];
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  isTyping: boolean;
  typingUser: string | null;
  unreadCount: number;

  // Actions
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  openChatWithVendor: (
    vendorId: string,
    context?: {
      productId?: string;
      subOrderId?: string;
      initialMessage?: string;
      productPreview?: {
        title: string;
        images: string[];
        basePrice: number | string;
        discountPrice?: number | string | null;
      };
      vendorPreview?: {
        storeName: string;
        storeLogo?: string | null;
      };
    },
  ) => Promise<void>;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (text: string, attachments?: string[]) => Promise<void>;
  initSocketListeners: () => void;
}

let socketInitialized = false;

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  activeConversation: null,
  conversations: [],
  messages: [],
  isLoading: false,
  isSending: false,
  isTyping: false,
  typingUser: null,
  unreadCount: 0,

  setOpen: (open: boolean) => {
    set({ isOpen: open });
    if (open) {
      get().fetchConversations();
    }
  },

  toggleOpen: () => {
    const next = !get().isOpen;
    set({ isOpen: next });
    if (next) {
      get().fetchConversations();
    }
  },

  setActiveConversation: (conversation: Conversation | null) => {
    set({ activeConversation: conversation, messages: [] });
    if (conversation) {
      get().fetchMessages(conversation.id);
      const socket = getSocket();
      socket.emit("join_conversation", conversation.id);
      chatApi.markAsRead(conversation.id).catch(() => {});
    }
  },

  openChatWithVendor: async (vendorId, context) => {
    set({ isOpen: true, isLoading: true });
    try {
      const conv = await chatApi.getOrCreateConversation({
        vendorId,
        productId: context?.productId,
        subOrderId: context?.subOrderId,
        initialMessage: context?.initialMessage,
      });

      set({ activeConversation: conv, isLoading: false });
      await get().fetchMessages(conv.id);

      const socket = getSocket();
      socket.emit("join_conversation", conv.id);
    } catch {
      set({ isLoading: false });
      toast.error("Please login to message the seller.");
    }
  },

  fetchConversations: async () => {
    try {
      const convs = await chatApi.getConversations();
      const totalUnread = convs.reduce((acc, c) => acc + (c.unreadCountCustomer || 0), 0);
      set({ conversations: convs, unreadCount: totalUnread });
    } catch {
      // Ignored if user not logged in
    }
  },

  fetchMessages: async (conversationId: string) => {
    try {
      const msgs = await chatApi.getMessages(conversationId);
      set({ messages: msgs });
    } catch {
      // Ignore
    }
  },

  sendMessage: async (text: string, attachments?: string[]) => {
    const { activeConversation, messages } = get();
    if (!activeConversation || !text.trim()) return;

    set({ isSending: true });
    try {
      const newMsg = await chatApi.sendMessage(activeConversation.id, {
        text: text.trim(),
        attachments,
      });

      set({
        messages: [...messages, newMsg],
        isSending: false,
      });

      // Stop typing
      const socket = getSocket();
      socket.emit("typing_stop", { conversationId: activeConversation.id });
    } catch {
      set({ isSending: false });
      toast.error("Failed to send message. Please try again.");
    }
  },

  initSocketListeners: () => {
    if (typeof window === "undefined" || socketInitialized) return;
    socketInitialized = true;

    const socket = getSocket();

    socket.on("NEW_CHAT_MESSAGE", (data: { conversationId: string; message: ChatMessage }) => {
      const { activeConversation, messages } = get();
      if (activeConversation && activeConversation.id === data.conversationId) {
        // Prevent duplicate appending if sender already added optimistic/response message
        if (!messages.some((m) => m.id === data.message.id)) {
          set({ messages: [...messages, data.message] });
        }
        chatApi.markAsRead(data.conversationId).catch(() => {});
      } else {
        // Increment unread count & refresh conversation list
        get().fetchConversations();
      }
    });

    socket.on("NEW_CHAT_NOTIFICATION", (data: { conversationId: string; senderName: string; text: string }) => {
      toast.info(`${data.senderName}: ${data.text}`, {
        action: {
          label: "Reply",
          onClick: () => {
            get().setOpen(true);
            chatApi.getConversationById(data.conversationId).then((conv) => {
              get().setActiveConversation(conv);
            });
          },
        },
      });
      get().fetchConversations();
    });

    socket.on("USER_TYPING", (data: { conversationId: string; userName: string; isTyping: boolean }) => {
      const { activeConversation } = get();
      if (activeConversation && activeConversation.id === data.conversationId) {
        set({ isTyping: data.isTyping, typingUser: data.isTyping ? data.userName : null });
      }
    });
  },
}));
