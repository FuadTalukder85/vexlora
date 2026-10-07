import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";
import { processUserMessageWithAI } from "@/lib/ai/shoppingAssistant";

export interface AIChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  products?: Product[];
  suggestedPrompts?: string[];
  actionLink?: {
    label: string;
    href: string;
  };
  timestamp: string;
}

interface AIChatState {
  messages: AIChatMessage[];
  isThinking: boolean;
  activeTab: "ai" | "sellers";

  // Actions
  setActiveTab: (tab: "ai" | "sellers") => void;
  sendMessageToAI: (prompt: string) => Promise<void>;
  clearHistory: () => void;
}

const INITIAL_WELCOME_MESSAGE: AIChatMessage = {
  id: "welcome-1",
  sender: "ai",
  text: "👋 Hi! I'm **Vexlora AI Copilot**, your personal shopping assistant.\n\nTell me what you're looking for (e.g. *\"I need a black hoodie under $50\"* or *\"Show me noise-cancelling headphones\"*), or ask me about shipping, orders, and returns!",
  suggestedPrompts: [
    "Find black hoodies under $50",
    "Best noise-cancelling headphones",
    "How does shipping work?",
    "What is your return policy?",
  ],
  timestamp: new Date().toISOString(),
};

export const useAIChatStore = create<AIChatState>()(
  persist(
    (set, get) => ({
      messages: [INITIAL_WELCOME_MESSAGE],
      isThinking: false,
      activeTab: "ai",

      setActiveTab: (tab) => set({ activeTab: tab }),

      sendMessageToAI: async (prompt: string) => {
        if (!prompt.trim() || get().isThinking) return;

        const userMsg: AIChatMessage = {
          id: `user_${Date.now()}`,
          sender: "user",
          text: prompt.trim(),
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, userMsg],
          isThinking: true,
        }));

        try {
          const aiResult = await processUserMessageWithAI(prompt.trim());

          const aiMsg: AIChatMessage = {
            id: `ai_${Date.now()}`,
            sender: "ai",
            text: aiResult.message,
            products: aiResult.products,
            suggestedPrompts: aiResult.suggestedPrompts,
            actionLink: aiResult.actionLink,
            timestamp: new Date().toISOString(),
          };

          set((state) => ({
            messages: [...state.messages, aiMsg],
            isThinking: false,
          }));
        } catch {
          const errorMsg: AIChatMessage = {
            id: `ai_err_${Date.now()}`,
            sender: "ai",
            text: "Sorry, I had trouble processing that request. Please try asking again or browse our categories.",
            timestamp: new Date().toISOString(),
          };

          set((state) => ({
            messages: [...state.messages, errorMsg],
            isThinking: false,
          }));
        }
      },

      clearHistory: () => {
        set({ messages: [INITIAL_WELCOME_MESSAGE] });
      },
    }),
    {
      name: "vexlora_ai_chat_history",
      partialize: (state) => ({ messages: state.messages }),
    }
  )
);
