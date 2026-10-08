"use client";

import React, { useEffect } from "react";
import { useChatStore } from "@/stores/chat.store";
import { useAIChatStore } from "@/stores/aiChat.store";
import { useAuthStore } from "@/stores/auth.store";
import { ChatTriggerButton } from "./ChatTriggerButton";
import { ChatHeader } from "./ChatHeader";
import { AIChatTab } from "./AIChatTab";
import { SellerMessagesTab } from "./SellerMessagesTab";

export const CustomerChatModal: React.FC = () => {
  const {
    isOpen,
    setOpen,
    toggleOpen,
    activeConversation,
    unreadCount,
    initSocketListeners,
    fetchConversations,
  } = useChatStore();

  const {
    messages: aiMessages,
    activeTab,
    setActiveTab,
    clearHistory: clearAIHistory,
  } = useAIChatStore();

  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    initSocketListeners();
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated, initSocketListeners, fetchConversations]);

  // If an active conversation is selected externally (e.g. from PDP or Store page), auto-switch to sellers tab
  useEffect(() => {
    if (activeConversation) {
      setActiveTab("sellers");
    }
  }, [activeConversation, setActiveTab]);

  return (
    <>
      {/* Floating Chat Trigger Bubble */}
      <ChatTriggerButton onClick={toggleOpen} unreadCount={unreadCount} />

      {/* Floating Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[440px] h-[600px] max-h-[85vh] bg-card rounded-3xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <ChatHeader
            activeTab={activeTab}
            unreadCount={unreadCount}
            canClearAI={aiMessages.length > 1}
            onSelectTab={setActiveTab}
            onClearAI={clearAIHistory}
            onClose={() => setOpen(false)}
          />

          {/* Active Tab View */}
          {activeTab === "ai" ? (
            <AIChatTab onCloseModal={() => setOpen(false)} />
          ) : (
            <SellerMessagesTab onCloseModal={() => setOpen(false)} />
          )}
        </div>
      )}
    </>
  );
};
