"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Store, Plus } from "lucide-react";
import { Conversation } from "@/stores/chat.store";

interface ConversationInboxListProps {
  conversations: Conversation[];
  isAuthenticated: boolean;
  onSelectConversation: (conv: Conversation) => void;
  onStartNewChat: () => void;
  onCloseModal: () => void;
}

export const ConversationInboxList: React.FC<ConversationInboxListProps> = ({
  conversations,
  isAuthenticated,
  onSelectConversation,
  onStartNewChat,
  onCloseModal,
}) => {
  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center bg-card">
        <Store className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h4 className="text-sm font-bold text-primary">Sign in to message sellers</h4>
        <p className="text-xs text-secondary mt-1 mb-4">
          Connect with merchants, inquire about products, and track order updates.
        </p>
        <Link
          href="/login"
          onClick={onCloseModal}
          className="inline-block px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto divide-y divide-border bg-card">
      <div className="p-3 bg-muted/40 border-b border-border flex items-center justify-between">
        <span className="text-xs font-bold text-secondary">Active Seller Chats</span>
        <button
          onClick={onStartNewChat}
          className="px-2.5 py-1 text-[11px] font-bold bg-highlight/10 text-highlight hover:bg-highlight hover:text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3 h-3" /> New Store Chat
        </button>
      </div>

      {conversations.length === 0 ? (
        <div className="py-12 text-center text-secondary px-4">
          <Store className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs font-semibold text-primary">No conversations yet</p>
          <p className="text-[11px] text-secondary mt-0.5">
            Click &quot;New Store Chat&quot; above to message any seller store.
          </p>
        </div>
      ) : (
        conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv)}
            className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left cursor-pointer"
          >
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-muted border border-border shrink-0">
              {conv.vendor?.storeLogo ? (
                <Image
                  src={conv.vendor.storeLogo}
                  alt={conv.vendor.storeName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-primary">
                  {conv.vendor?.storeName?.[0] || "V"}
                </div>
              )}
              {(conv.unreadCountCustomer || 0) > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-highlight rounded-full border-2 border-white" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <p className="text-xs font-bold text-primary truncate">
                  {conv.vendor?.storeName || "Vendor"}
                </p>
                {conv.lastMessageAt && (
                  <span className="text-[10px] text-secondary shrink-0">
                    {new Date(conv.lastMessageAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
              <p className="text-xs text-secondary truncate">
                {conv.lastMessage || "Conversation open"}
              </p>
            </div>
          </button>
        ))
      )}
    </div>
  );
};
