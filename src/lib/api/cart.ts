import { http } from "./client";

export interface ApiCartItem {
  id: string;
  productId: string;
  variantId: string | null;
  vendorId: string;
  title: string;
  slug: string;
  image: string | null;
  variantSku: string | null;
  variantAttributes: Record<string, unknown> | null;
  quantity: number;
  priceSnapshot: number;
  currentPrice: number;
  availableStock: number;
  savedForLater: boolean;
  isPriceChanged: boolean;
  isOutOfStock: boolean;
  isUnavailable: boolean;
  unavailabilityReason?: string;
  itemSubtotal: number;
  addedAt: string;
  updatedAt: string;
}

export interface ApiVendorGroup {
  vendorId: string;
  storeName: string;
  storeSlug: string;
  storeLogo: string | null;
  items: ApiCartItem[];
  subtotal: number;
  itemCount: number;
  hasIssues: boolean;
}

export interface ApiCartSummary {
  totalActiveItems: number;
  totalActiveQuantity: number;
  totalSavedForLaterCount: number;
  subtotal: number;
  hasPriceChanges: boolean;
  hasOutOfStockItems: boolean;
  hasUnavailableItems: boolean;
  canCheckout: boolean;
}

export interface ApiGroupedCartResponse {
  vendorGroups: ApiVendorGroup[];
  savedForLater: ApiCartItem[];
  summary: ApiCartSummary;
}

export interface AddToCartPayload {
  productId: string;
  variantId?: string;
  quantity?: number;
  sessionId?: string;
}

export interface UpdateCartItemPayload {
  quantity?: number;
  savedForLater?: boolean;
}

export interface MergeGuestCartPayload {
  sessionId: string;
}

export const cartApi = {
  getCart: async () => {
    const res = await http.get<ApiGroupedCartResponse>("/cart");
    return res.data;
  },

  addToCart: async (payload: AddToCartPayload) => {
    const res = await http.post<unknown, AddToCartPayload>("/cart", payload);
    return res.data;
  },

  updateCartItem: async (id: string, payload: UpdateCartItemPayload) => {
    const res = await http.patch<unknown, UpdateCartItemPayload>(`/cart/items/${id}`, payload);
    return res.data;
  },

  removeCartItem: async (id: string) => {
    const res = await http.delete<{ id: string }>(`/cart/items/${id}`);
    return res.data;
  },

  clearCart: async () => {
    const res = await http.delete<{ count: number }>("/cart");
    return res.data;
  },

  mergeGuestCart: async (sessionId: string) => {
    const res = await http.post<{ mergedCount: number; cleanedGuestCount: number; activeItemsCount: number }, MergeGuestCartPayload>(
      "/cart/merge",
      { sessionId },
    );
    return res.data;
  },
};
