"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bot, Sparkles, Send, ExternalLink } from "lucide-react";
import { useAIChatStore } from "@/stores/aiChat.store";
import { useCartStore } from "@/stores/cart.store";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { AIProductCard } from "./AIProductCard";

interface AIChatTabProps {
  onCloseModal: () => void;
}

export const AIChatTab: React.FC<AIChatTabProps> = ({ onCloseModal }) => {
  const { messages, isThinking, sendMessageToAI } = useAIChatStore();
  const { addItem } = useCartStore();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend ?? inputText;
    if (!text.trim() || isThinking) return;
    setInputText("");
    await sendMessageToAI(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const price = Number(product.discountPrice ?? product.basePrice);
      await addItem({
        id: product.id,
        productId: product.id,
        vendorId: product.vendorId || "vendor-1",
        vendorName: product.vendor?.storeName || "Vexlora Store",
        title: product.title,
        slug: product.slug,
        price,
        image: product.images?.[0] || null,
      });
      toast.success(`Added "${product.title}" to cart`);
    } catch {
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-muted/30">
      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              {/* Avatar label */}
              {!isUser && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-secondary mb-1 pl-1">
                  <div className="w-4 h-4 rounded-full bg-highlight/15 text-highlight flex items-center justify-center">
                    <Bot className="w-2.5 h-2.5" />
                  </div>
                  <span>Vexlora AI Copilot</span>
                </div>
              )}

              {/* Bubble */}
              <div
                className={`max-w-[88%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-primary text-white rounded-br-xs"
                    : "bg-card text-primary border border-border rounded-bl-xs shadow-xs"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Action Link if provided */}
                {msg.actionLink && (
                  <div className="mt-3 pt-2 border-t border-border">
                    <Link
                      href={msg.actionLink.href}
                      onClick={onCloseModal}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white hover:bg-highlight rounded-xl text-xs font-bold transition-colors"
                    >
                      <span>{msg.actionLink.label}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Product Suggestions Cards */}
              {msg.products && msg.products.length > 0 && (
                <div className="w-full mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {msg.products.map((prod) => (
                    <AIProductCard
                      key={prod.id}
                      product={prod}
                      onAddToCart={handleAddToCart}
                      onSelectProduct={onCloseModal}
                    />
                  ))}
                </div>
              )}

              {/* Suggested Prompts Pills */}
              {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                <div className="w-full flex flex-wrap gap-1.5 mt-2">
                  {msg.suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-card hover:bg-highlight/10 text-primary hover:text-highlight border border-border shrink-0 transition-colors cursor-pointer active:scale-95"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-secondary italic bg-card border border-border px-3.5 py-2.5 rounded-2xl w-fit animate-pulse shadow-xs">
            <Sparkles className="w-4 h-4 text-highlight animate-spin" />
            <span>AI Copilot is searching products & policies...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Chat Input Footer */}
      <div className="p-3 bg-card border-t border-border flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. I need a black hoodie under $50..."
          className="flex-1 px-4 py-2.5 bg-muted rounded-xl text-xs sm:text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isThinking}
          className="p-2.5 rounded-xl bg-primary hover:bg-highlight text-white disabled:opacity-40 disabled:hover:bg-primary transition-all cursor-pointer shrink-0"
          aria-label="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
