import { getProducts } from "@/lib/api/products";
import { Product } from "@/types/product";

export interface AIProductQuery {
  rawQuery: string;
  searchTerm?: string;
  maxPrice?: number;
  minPrice?: number;
  category?: string;
  sortBy?: string;
  isGeneralQuery?: boolean;
}

export interface AIResponse {
  message: string;
  products?: Product[];
  suggestedPrompts?: string[];
  actionLink?: {
    label: string;
    href: string;
  };
}

/**
 * Intelligent parser that extracts search criteria from user prompt
 */
export function parseUserShoppingIntent(prompt: string): AIProductQuery {
  const cleanPrompt = prompt.trim().toLowerCase();

  let maxPrice: number | undefined;
  let minPrice: number | undefined;

  // Max price regex: under $50, below 100, less than $30, cheaper than 40, max 50, under 50 bucks/dollars
  const maxPriceMatch = cleanPrompt.match(
    /(?:under|below|less\s+than|cheaper\s+than|max|budget\s+of?|within)\s*\$?(\d+(?:\.\d+)?)/i
  );
  if (maxPriceMatch) {
    maxPrice = parseFloat(maxPriceMatch[1]);
  }

  // Min price regex: above $50, over 100, more than $30, at least 40, min 50
  const minPriceMatch = cleanPrompt.match(
    /(?:above|over|more\s+than|at\s+least|min)\s*\$?(\d+(?:\.\d+)?)/i
  );
  if (minPriceMatch) {
    minPrice = parseFloat(minPriceMatch[1]);
  }

  // Price range: between $20 and $50
  const rangeMatch = cleanPrompt.match(/between\s*\$?(\d+)\s*(?:and|to|-)\s*\$?(\d+)/i);
  if (rangeMatch) {
    minPrice = parseFloat(rangeMatch[1]);
    maxPrice = parseFloat(rangeMatch[2]);
  }

  // Extract core keywords by stripping intent verbs and price tokens
  let cleanedKeywords = cleanPrompt
    .replace(/(?:under|below|less\s+than|cheaper\s+than|above|over|more\s+than|at\s+least|between|max|min)\s*\$?(\d+(?:\.\d+)?)(?:\s*(?:and|to|-)\s*\$?(\d+))?/gi, "")
    .replace(/\b(i need|i want|show me|find me|look for|can you find|give me|search for|do you have|recommend|looking for|please|products?|items?|dollars?|bucks?)\b/gi, "")
    .trim();

  // Normalize multi spaces
  cleanedKeywords = cleanedKeywords.replace(/\s+/g, " ").trim();

  // Category matching
  let category: string | undefined;
  if (/laptop|computer|macbook|pc|desktop/i.test(cleanPrompt)) {
    category = "laptops-computers";
  } else if (/phone|headphone|earbud|speaker|electronics|gadget|camera/i.test(cleanPrompt)) {
    category = "electronics";
  } else if (/hoodie|shirt|jacket|shoes|sneaker|clothing|dress|pants|tshirt|apparel/i.test(cleanPrompt)) {
    category = "fashion-apparel";
  } else if (/kitchen|cookware|knife|board|pan|pot|blender/i.test(cleanPrompt)) {
    category = "home-kitchen";
  } else if (/beauty|skincare|perfume|serum|makeup/i.test(cleanPrompt)) {
    category = "beauty-welness";
  }

  // Check if it's purely a general knowledge/FAQ question
  const isGeneralQuery =
    /return|refund|exchange|policy|ship|shipping|delivery|track|order|carrier|payment|stripe|pay|escrow|vendor|sell|contact|help|hello|hi|hey/i.test(
      cleanPrompt
    ) && cleanedKeywords.length < 3;

  return {
    rawQuery: prompt,
    searchTerm: cleanedKeywords || undefined,
    maxPrice,
    minPrice,
    category,
    isGeneralQuery,
  };
}

/**
 * Knowledge base handler for customer service queries
 */
function handleGeneralKnowledge(prompt: string): AIResponse | null {
  const q = prompt.toLowerCase();

  // 1. Return & Refund Policy
  if (/return|refund|money\s*back|exchange/i.test(q)) {
    return {
      message:
        "🛡️ **Vexlora Return Policy:**\nWe offer a **14-day hassle-free return window** on eligible products from the date of delivery. Items must be in their original unopened condition. All transactions are protected with **100% Escrow Buyer Protection** until you confirm delivery satisfaction.",
      suggestedPrompts: [
        "How do I track my order?",
        "Find black hoodies under $50",
        "Show popular electronics",
      ],
    };
  }

  // 2. Shipping & Delivery
  if (/shipping|delivery|how\s*long|dispatch|deliver/i.test(q)) {
    return {
      message:
        "🚚 **Shipping & Delivery:**\n• **Free nationwide delivery** on orders over **$50** across all verified vendor stores.\n• Standard delivery typically takes **2–4 business days** depending on the vendor's location.\n• Each vendor packages and ships their items directly with real-time carrier tracking numbers.",
      suggestedPrompts: [
        "How do I track my package?",
        "What is your return policy?",
        "Browse verified stores",
      ],
    };
  }

  // 3. Order Tracking
  if (/track|where\s*is\s*my\s*order|order\s*status/i.test(q)) {
    return {
      message:
        "📦 **Live Order Tracking:**\nYou can track any order in real time! Simply enter your Order Number on our **Live Order Tracker** page to see live milestones, vendor sub-order statuses, and carrier tracking codes.",
      actionLink: {
        label: "Open Live Order Tracker",
        href: "/track-order",
      },
      suggestedPrompts: [
        "What is your return policy?",
        "Find wireless headphones under $100",
      ],
    };
  }

  // 4. Payment Methods & Security
  if (/payment|pay|card|stripe|checkout|credit/i.test(q)) {
    return {
      message:
        "💳 **Secure Payment Methods:**\nWe accept all major **Credit & Debit Cards (Visa, Mastercard, Amex)** processed securely via **Stripe Elements** with 256-bit SSL encryption. We never store raw card numbers.",
      suggestedPrompts: [
        "Show today's hot deals",
        "Browse verified stores",
      ],
    };
  }

  // 5. Verified Sellers & Becoming a Merchant
  if (/vendor|seller|stores?|sell\s*on\s*vexlora|apply/i.test(q)) {
    return {
      message:
        "🏪 **Verified Merchant Stores:**\nVexlora hosts hundreds of verified artisan creators and certified brands. You can browse all stores or apply to open your own merchant storefront with automated weekly payouts.",
      actionLink: {
        label: "Explore Verified Stores",
        href: "/stores",
      },
      suggestedPrompts: [
        "Browse verified stores",
        "Show laptops under $1000",
      ],
    };
  }

  // 6. Greetings
  if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|howdy)\b/i.test(q.trim())) {
    return {
      message:
        "👋 Hello! I am **Vexlora AI Copilot**, your personal shopping assistant. \n\nTell me what you're looking for (e.g. *\"I need a black hoodie under $50\"* or *\"Show me noise-cancelling headphones\"*), or ask me anything about shipping, order tracking, and store policies!",
      suggestedPrompts: [
        "Find black hoodies under $50",
        "Best noise-cancelling headphones",
        "How does shipping work?",
        "What is your return policy?",
      ],
    };
  }

  return null;
}

/**
 * Main AI Shopping Assistant execution function
 */
export async function processUserMessageWithAI(prompt: string): Promise<AIResponse> {
  // 1. Check if it's a general policy / FAQ query
  const generalResponse = handleGeneralKnowledge(prompt);
  if (generalResponse) {
    return generalResponse;
  }

  // 2. Parse natural language shopping intent
  const parsed = parseUserShoppingIntent(prompt);

  try {
    // 3. Query existing real Vexlora product catalog
    const response = await getProducts({
      q: parsed.searchTerm || undefined,
      maxPrice: parsed.maxPrice,
      minPrice: parsed.minPrice,
      category: parsed.category,
      limit: 6,
    });

    const products = response.data || [];

    // 4. Construct AI Assistant response
    if (products.length > 0) {
      let priceText = "";
      if (parsed.maxPrice && parsed.minPrice) {
        priceText = ` between $${parsed.minPrice} and $${parsed.maxPrice}`;
      } else if (parsed.maxPrice) {
        priceText = ` under $${parsed.maxPrice}`;
      } else if (parsed.minPrice) {
        priceText = ` above $${parsed.minPrice}`;
      }

      const itemLabel = parsed.searchTerm ? `"${parsed.searchTerm}"` : "products matching your criteria";

      return {
        message: `✨ I found **${products.length} matching ${products.length === 1 ? "item" : "items"}** in our catalog${priceText}. Here are the top results from verified sellers:`,
        products,
        suggestedPrompts: [
          "Sort by lowest price",
          "Show customer reviews",
          "What is the return policy?",
        ],
      };
    } else {
      // If no exact match with price filter, fallback to broader query to show realistic alternatives
      const fallbackResponse = await getProducts({
        q: parsed.searchTerm || undefined,
        category: parsed.category,
        limit: 4,
      });

      const fallbackProducts = fallbackResponse.data || [];

      if (fallbackProducts.length > 0) {
        return {
          message: `I couldn't find any products strictly under **$${parsed.maxPrice}** matching "${parsed.searchTerm || "your search"}", but here are the closest available items from our verified merchants:`,
          products: fallbackProducts,
          suggestedPrompts: [
            "Show today's hot deals",
            "Browse all categories",
            "What is your delivery timeframe?",
          ],
        };
      }

      return {
        message: `I searched the Vexlora marketplace for "${parsed.searchTerm || prompt}", but couldn't find any items in stock matching those exact parameters right now. You can try adjusting your search or explore our popular categories below.`,
        actionLink: {
          label: "Browse All Products",
          href: "/products",
        },
        suggestedPrompts: [
          "Show today's hot deals",
          "Electronics & Tech",
          "Fashion & Apparel",
        ],
      };
    }
  } catch (error) {
    return {
      message:
        "I encountered a temporary issue searching the product catalog. Please feel free to try again or browse our categories directly.",
      actionLink: {
        label: "Browse Catalog",
        href: "/products",
      },
    };
  }
}
