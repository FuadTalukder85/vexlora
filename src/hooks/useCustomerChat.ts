import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/stores/chat.store";
import { useAuthStore } from "@/stores/auth.store";
import { chatApi } from "@/lib/api/chat";
import { VendorItem } from "@/components/chat/VendorStorePicker";

export function useCustomerChat() {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    sendMessage,
    isSending,
    isTyping,
    typingUser,
    fetchConversations,
    openChatWithVendor,
    setOpen: setFloatingChatOpen,
    initSocketListeners,
  } = useChatStore();

  const { user, isAuthenticated } = useAuthStore();

  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isStorePickerOpen, setIsStorePickerOpen] = useState(false);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initSocketListeners();
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated, fetchConversations, initSocketListeners]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const loadVendors = async () => {
    setLoadingVendors(true);
    try {
      const list = await chatApi.getVendors();
      setVendors(list || []);
    } catch {
      // Ignore
    } finally {
      setLoadingVendors(false);
    }
  };

  const handleStartChatWithVendor = async (vendor: VendorItem) => {
    setIsStorePickerOpen(false);
    await openChatWithVendor(vendor.id, {
      vendorPreview: {
        storeName: vendor.storeName,
        storeLogo: vendor.storeLogo,
      },
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || isSending) return;
    const textToSend = messageText.trim();
    setMessageText("");
    await sendMessage(textToSend);
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      conv.vendor?.storeName.toLowerCase().includes(q) ||
      conv.lastMessage?.toLowerCase().includes(q)
    );
  });

  return {
    user,
    isAuthenticated,
    conversations,
    filteredConversations,
    activeConversation,
    setActiveConversation,
    messages,
    messageText,
    setMessageText,
    searchQuery,
    setSearchQuery,
    isSending,
    isTyping,
    typingUser,
    isStorePickerOpen,
    setIsStorePickerOpen,
    vendors,
    loadingVendors,
    messagesContainerRef,
    setFloatingChatOpen,
    loadVendors,
    handleStartChatWithVendor,
    handleSendMessage,
  };
}
