"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Send, Check, CheckCheck, Sparkles } from "lucide-react";
import { Conversation, ChatMessage } from "@/stores/chat.store";
import { User } from "@/stores/auth.store";
import { getSocket } from "@/lib/socket";

interface SellerActiveChatProps {
  conversation: Conversation;
  messages: ChatMessage[];
  user: User | null;
  isSending: boolean;
  isTyping: boolean;
  typingUser: string | null;
  onBackToInbox: () => void;
  onSendMessage: (text: string) => Promise<void>;
  onCloseModal: () => void;
}

export const SellerActiveChat: React.FC<SellerActiveChatProps> = ({
  conversation,
  messages,
  user,
  isSending,
  isTyping,
  typingUser,
  onBackToInbox,
  onSendMessage,
  onCloseModal,
}) => {
  const [inputText, setInputText] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    const socket = getSocket();
    socket.emit("typing_start", {
      conversationId: conversation.id,
      userName: user?.name || "Customer",
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing_stop", { conversationId: conversation.id });
    }, 1500);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;
    const text = inputText;
    setInputText("");
    await onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-muted/30">
      {/* Vendor Context Sub-Header */}
      <div className="px-4 py-2.5 bg-card border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBackToInbox}
            className="p-1 text-secondary hover:text-primary rounded-lg transition-colors cursor-pointer"
            title="Back to inbox"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h4 className="text-xs font-bold text-primary">
              {conversation.vendor?.storeName || "Vendor Store"}
            </h4>
            <p className="text-[10px] text-emerald-600 font-semibold">Verified Merchant</p>
          </div>
        </div>

        <Link
          href={`/stores/${conversation.vendor?.storeSlug || ""}`}
          onClick={onCloseModal}
          className="text-[11px] font-bold text-primary hover:text-highlight bg-muted px-2.5 py-1 rounded-lg transition-colors"
        >
          Visit Store
        </Link>
      </div>

      {/* Product context pill if inquiry is about a specific product */}
      {conversation.product && (
        <div className="px-4 py-2 bg-muted/70 border-b border-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-card border border-border shrink-0">
              <Image
                src={conversation.product.images?.[0] || "/images/placeholder.png"}
                alt={conversation.product.title}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-semibold text-primary truncate max-w-xs">
              {conversation.product.title}
            </span>
          </div>
          <span className="font-bold text-highlight">
            ${Number(conversation.product.discountPrice ?? conversation.product.basePrice).toFixed(2)}
          </span>
        </div>
      )}

      {/* Messages Feed */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="py-12 text-center text-secondary">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-highlight/60" />
            <p className="text-xs font-medium text-primary">No messages yet</p>
            <p className="text-[11px] text-secondary mt-0.5">
              Send a message to start chatting directly with this seller.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderRole === "CUSTOMER" || (user && msg.senderId === user.id);

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? "bg-primary text-white rounded-br-xs"
                      : "bg-card text-primary border border-border rounded-bl-xs shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                </div>
                <span className="text-[10px] text-secondary mt-1 px-1 flex items-center gap-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {isMe && (
                    msg.isRead ? (
                      <span className="flex items-center text-sky-500" title="Seen">
                        <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    ) : msg.isDelivered ? (
                      <span className="flex items-center text-secondary" title="Delivered">
                        <CheckCheck className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="flex items-center text-secondary/60" title="Sent">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )
                  )}
                </span>
              </div>
            );
          })
        )}

        {isTyping && (
          <div className="flex items-center gap-1 text-xs text-secondary italic bg-card border border-border px-3 py-1.5 rounded-2xl w-fit animate-pulse">
            <span>{typingUser || "Seller"} is typing...</span>
          </div>
        )}
      </div>

      {/* Vendor Chat Input */}
      <div className="p-3 bg-card border-t border-border flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message to the seller..."
          className="flex-1 px-3.5 py-2.5 bg-muted rounded-xl text-xs sm:text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || isSending}
          className="p-2.5 rounded-xl bg-primary hover:bg-highlight text-white disabled:opacity-40 disabled:hover:bg-primary transition-all cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
