"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageSquare,
  Store,
  Send,
  Plus,
  Bot,
  ExternalLink,
  Search,
  Check,
  CheckCheck,
  Maximize2,
} from "lucide-react";
import { useChatStore } from "@/stores/chat.store";
import { useAIChatStore } from "@/stores/aiChat.store";
import { useAuthStore } from "@/stores/auth.store";
import { chatApi } from "@/lib/api/chat";
import { VendorStorePicker, VendorItem } from "@/components/chat/VendorStorePicker";

export const AccountChatTab: React.FC = () => {
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
  } = useChatStore();

  const { setActiveTab: setAITab } = useAIChatStore();
  const { user, isAuthenticated } = useAuthStore();

  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isStorePickerOpen, setIsStorePickerOpen] = useState(false);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated, fetchConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      initialMessage: "Hi, I have a question regarding your store products.",
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

  return (
    <div className="bg-white rounded-3xl border border-border shadow-xs overflow-hidden h-[700px] flex flex-col md:flex-row text-[14px]">
      {/* Left Sidebar: Conversations Inbox */}
      <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col shrink-0 h-full bg-card">
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-highlight/10 text-highlight flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-primary">Seller Inquiries</h3>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setIsStorePickerOpen(true);
                  loadVendors();
                }}
                className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors cursor-pointer"
                title="Start new store chat"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setAITab("ai");
                  setFloatingChatOpen(true);
                }}
                className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white transition-colors cursor-pointer"
                title="Open AI Shopping Assistant"
              >
                <Bot className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-border rounded-xl text-[14px] text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {conversations.length === 0 ? (
            <div className="py-16 text-center text-secondary px-6">
              <Store className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
              <p className="text-[14px] font-bold text-primary">No conversations yet</p>
              <p className="text-xs text-secondary mt-1 mb-4">
                Message verified seller stores about orders, discounts, and item specs.
              </p>
              <button
                onClick={() => {
                  setIsStorePickerOpen(true);
                  loadVendors();
                }}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-[14px] font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Start New Chat
              </button>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="py-12 text-center text-[14px] text-secondary">
              No matching conversations found
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = activeConversation?.id === conv.id;
              const unread = conv.unreadCountCustomer || 0;

              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    setIsStorePickerOpen(false);
                    setActiveConversation(conv);
                  }}
                  className={`w-full p-4 flex items-center gap-3 transition-colors text-left cursor-pointer ${isSelected
                      ? "bg-primary/5 border-l-4 border-l-primary"
                      : "hover:bg-muted/50"
                    }`}
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
                      <div className="w-full h-full flex items-center justify-center font-bold text-primary text-sm">
                        {conv.vendor?.storeName?.[0] || "V"}
                      </div>
                    )}
                    {unread > 0 && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-highlight rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className="text-[14px] font-bold text-primary truncate">
                        {conv.vendor?.storeName || "Vendor"}
                      </p>
                      {conv.lastMessageAt && (
                        <span className="text-xs text-secondary shrink-0">
                          {new Date(conv.lastMessageAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[14px] truncate ${unread > 0 ? "font-bold text-primary" : "text-secondary"
                        }`}
                    >
                      {conv.lastMessage || "Conversation open"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Content: Active Conversation or Store Picker or Empty State */}
      <div className="flex-1 flex flex-col h-full bg-white">
        {isStorePickerOpen ? (
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <div>
                <h4 className="text-base font-bold text-primary">Start a New Conversation</h4>
                <p className="text-[14px] text-secondary">
                  Select any verified store to ask questions or get assistance
                </p>
              </div>
              <button
                onClick={() => setIsStorePickerOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-border text-[14px] font-bold text-secondary hover:text-primary hover:bg-muted cursor-pointer"
              >
                Back to Inbox
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <VendorStorePicker
                vendors={vendors}
                loading={loadingVendors}
                onSelectVendor={handleStartChatWithVendor}
                onBackToConversations={() => setIsStorePickerOpen(false)}
                showBackOption={false}
              />
            </div>
          </div>
        ) : activeConversation ? (
          <div className="flex flex-col h-full">
            {/* Conversation Top Header */}
            <div className="p-4 border-b border-border bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted border border-border">
                  {activeConversation.vendor?.storeLogo ? (
                    <Image
                      src={activeConversation.vendor.storeLogo}
                      alt={activeConversation.vendor.storeName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-primary text-sm">
                      {activeConversation.vendor?.storeName?.[0] || "V"}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-primary">
                      {activeConversation.vendor?.storeName || "Vendor"}
                    </h4>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Verified Seller
                    </span>
                  </div>
                  <p className="text-xs text-secondary">
                    Direct communication protected by Vexlora Buyer Shield
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeConversation.vendor?.storeSlug && (
                  <Link
                    href={`/stores/${activeConversation.vendor.storeSlug}`}
                    className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-primary text-[14px] font-bold flex items-center gap-1 transition-colors"
                    title="Visit Seller Store"
                  >
                    <Store className="w-4 h-4" />
                    <span className="hidden sm:inline">Store Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}

                <button
                  onClick={() => setFloatingChatOpen(true)}
                  className="p-2 rounded-xl border border-border hover:bg-muted text-secondary hover:text-primary transition-colors cursor-pointer"
                  title="Pop out to floating window"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message History Feed */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-muted/15">
              {messages.length === 0 ? (
                <div className="py-16 text-center text-secondary">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-[14px] font-bold text-primary">No messages yet</p>
                  <p className="text-xs text-secondary mt-1">
                    Send a message below to start chatting with{" "}
                    {activeConversation.vendor?.storeName || "the store"}.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === user?.id || msg.senderRole === "CUSTOMER";

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[78%] sm:max-w-[65%] rounded-2xl p-3.5 text-[14px] shadow-xs leading-relaxed ${isMe
                            ? "bg-primary text-white rounded-br-xs"
                            : "bg-white text-primary border border-border rounded-bl-xs"
                          }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1 px-1 text-xs text-secondary">
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isMe && (
                          msg.isRead ? (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-secondary" />
                          )
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-secondary">
                  <div className="flex items-center gap-1 p-2 bg-white rounded-2xl border border-border">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-xs">
                    {typingUser || "Seller"} is typing...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input composer row */}
            <form
              onSubmit={handleSendMessage}
              className="p-3.5 border-t border-border bg-white flex items-center gap-2"
            >
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Message ${activeConversation.vendor?.storeName || "seller"}...`}
                className="flex-1 px-4 py-2.5 bg-muted/50 border border-border rounded-2xl text-[14px] text-primary placeholder:text-secondary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />

              <button
                type="submit"
                disabled={!messageText.trim() || isSending}
                className="h-10 px-5 bg-primary hover:bg-primary/90 text-white rounded-2xl text-[14px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-secondary">
            <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center text-primary mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-primary">No Conversation Selected</h4>
            <p className="text-[14px] text-secondary mt-1 max-w-sm">
              Select a conversation from the sidebar to view existing chats, or start a new chat with any store.
            </p>
            <button
              onClick={() => {
                setIsStorePickerOpen(true);
                loadVendors();
              }}
              className="mt-5 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-[14px] font-bold rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Message a Seller</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
