"use client";

import React, { useState, useEffect } from "react";
import { useChatStore } from "@/stores/chat.store";
import { useAuthStore } from "@/stores/auth.store";
import { chatApi } from "@/lib/api/chat";
import { toast } from "sonner";
import { SellerActiveChat } from "./SellerActiveChat";
import { VendorStorePicker, VendorItem } from "./VendorStorePicker";
import { ConversationInboxList } from "./ConversationInboxList";

interface SellerMessagesTabProps {
  onCloseModal: () => void;
}

export const SellerMessagesTab: React.FC<SellerMessagesTabProps> = ({ onCloseModal }) => {
  const {
    activeConversation,
    setActiveConversation,
    openChatWithVendor,
    conversations,
    messages,
    sendMessage,
    isSending,
    isTyping,
    typingUser,
  } = useChatStore();

  const { user, isAuthenticated } = useAuthStore();
  const [isNewVendorChatMode, setIsNewVendorChatMode] = useState(false);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(false);

  useEffect(() => {
    if (isNewVendorChatMode || (isAuthenticated && conversations.length === 0)) {
      loadVendors();
    }
  }, [isNewVendorChatMode, conversations.length, isAuthenticated]);

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

  const handleStartChatWithStore = async (vendor: VendorItem) => {
    if (!isAuthenticated) {
      toast.error("Please log in to chat with sellers");
      return;
    }
    setIsNewVendorChatMode(false);
    await openChatWithVendor(vendor.id, {
      vendorPreview: {
        storeName: vendor.storeName,
        storeLogo: vendor.storeLogo,
      },
    });
  };

  if (activeConversation) {
    return (
      <SellerActiveChat
        conversation={activeConversation}
        messages={messages}
        user={user}
        isSending={isSending}
        isTyping={isTyping}
        typingUser={typingUser}
        onBackToInbox={() => setActiveConversation(null)}
        onSendMessage={sendMessage}
        onCloseModal={onCloseModal}
      />
    );
  }

  if (isNewVendorChatMode || (isAuthenticated && conversations.length === 0)) {
    return (
      <VendorStorePicker
        vendors={vendors}
        loading={loadingVendors}
        onSelectVendor={handleStartChatWithStore}
        onBackToConversations={() => setIsNewVendorChatMode(false)}
        showBackOption={conversations.length > 0}
      />
    );
  }

  return (
    <ConversationInboxList
      conversations={conversations}
      isAuthenticated={isAuthenticated}
      onSelectConversation={(conv) => setActiveConversation(conv)}
      onStartNewChat={() => {
        setIsNewVendorChatMode(true);
        loadVendors();
      }}
      onCloseModal={onCloseModal}
    />
  );
};
