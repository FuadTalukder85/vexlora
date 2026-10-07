"use client";

import React from "react";
import { Sparkles, Trash2, X, Bot, Store } from "lucide-react";

interface ChatHeaderProps {
  activeTab: "ai" | "sellers";
  unreadCount: number;
  canClearAI: boolean;
  onSelectTab: (tab: "ai" | "sellers") => void;
  onClearAI: () => void;
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  activeTab,
  unreadCount,
  canClearAI,
  onSelectTab,
  onClearAI,
  onClose,
}) => {
  return (
    <div className="px-5 py-3.5 bg-primary text-white border-b border-primary/20 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-white/10 text-white">
            <Sparkles className="w-4 h-4 text-highlight" />
          </div>
          <h3 className="text-sm font-bold tracking-tight text-white">Vexlora Marketplace Assistant</h3>
        </div>

        <div className="flex items-center gap-1">
          {activeTab === "ai" && canClearAI && (
            <button
              onClick={onClearAI}
              className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Clear Chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs: AI Copilot vs Seller Messages */}
      <div className="grid grid-cols-2 p-1 bg-black/20 rounded-2xl gap-1 text-xs font-bold">
        <button
          onClick={() => onSelectTab("ai")}
          className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "ai"
              ? "bg-white text-primary shadow-sm"
              : "text-white/70 hover:text-white"
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Copilot</span>
        </button>

        <button
          onClick={() => onSelectTab("sellers")}
          className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all relative cursor-pointer ${
            activeTab === "sellers"
              ? "bg-white text-primary shadow-sm"
              : "text-white/70 hover:text-white"
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Seller Messages</span>
          {unreadCount > 0 && (
            <span className="w-2 h-2 bg-highlight rounded-full" />
          )}
        </button>
      </div>
    </div>
  );
};
