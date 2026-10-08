"use client";

import React from "react";
import { Bot } from "lucide-react";

interface ChatTriggerButtonProps {
  onClick: () => void;
  unreadCount: number;
}

export const ChatTriggerButton: React.FC<ChatTriggerButtonProps> = ({ onClick, unreadCount }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        className="relative group p-4 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer border border-primary/20 ring-4 ring-primary/10"
        aria-label="Open AI and Seller Chat"
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-white group-hover:rotate-6 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-highlight rounded-full animate-ping" />
        </div>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-highlight text-white shadow-md">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        <span className="sr-only">Open Chat</span>
      </button>
    </div>
  );
};
