import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cartApi, ApiCartItem, ApiVendorGroup, ApiCartSummary } from "@/lib/api/cart";
import { getCartSessionId } from "@/lib/api/client";

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string | null;
  vendorId: string;
  vendorName: string;
  title: string;
  slug: string;
  price: number;
  quantity: number;
  image?: string | null;
  attributes?: Record<string, string> | null;
  isPriceChanged?: boolean;
  isOutOfStock?: boolean;
  isUnavailable?: boolean;
  availableStock?: number;
  savedForLater?: boolean;
}

interface CartState {
  items: CartItem[];
  vendorGroups: ApiVendorGroup[];
  savedForLater: ApiCartItem[];
  summary: ApiCartSummary | null;
  selectedItemIds: string[];
  isLoading: boolean;
  isSyncing: boolean;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  toggleSaveForLater: (itemId: string, savedForLater: boolean) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeGuestCart: () => Promise<void>;

  // Selection for Checkout (Amazon / Lazada style)
  toggleSelectItem: (itemId: string) => void;
  toggleSelectVendor: (vendorId: string) => void;
  selectAllItems: (selectAll: boolean) => void;

  // Getters
  getItemCount: () => number;
  getSubtotal: () => number;
  getSelectedSubtotal: () => number;
  getSelectedCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      vendorGroups: [],
      savedForLater: [],
      summary: null,
      selectedItemIds: [],
      isLoading: false,
      isSyncing: false,

      fetchCart: async () => {
        set({ isSyncing: true });
        try {
          const res = await cartApi.getCart();
          if (res) {
            const flattenedItems: CartItem[] = [];
            res.vendorGroups.forEach((group) => {
              group.items.forEach((item) => {
                flattenedItems.push({
                  id: item.id,
                  productId: item.productId,
                  variantId: item.variantId,
                  vendorId: item.vendorId,
                  vendorName: group.storeName,
                  title: item.title,
                  slug: item.slug,
                  price: item.currentPrice,
                  quantity: item.quantity,
                  image: item.image,
                  attributes: item.variantAttributes as Record<string, string> | null,
                  isPriceChanged: item.isPriceChanged,
                  isOutOfStock: item.isOutOfStock,
                  isUnavailable: item.isUnavailable,
                  availableStock: item.availableStock,
                  savedForLater: item.savedForLater,
                });
              });
            });

            const currentSelected = get().selectedItemIds;
            // Retain selected items that still exist and are available
            const validSelected = currentSelected.filter((id) =>
              flattenedItems.some((i) => i.id === id && !i.isOutOfStock && !i.isUnavailable)
            );
            // Default select all valid items if none selected
            const finalSelected =
              validSelected.length > 0
                ? validSelected
                : flattenedItems.filter((i) => !i.isOutOfStock && !i.isUnavailable).map((i) => i.id);

            set({
              items: flattenedItems,
              vendorGroups: res.vendorGroups,
              savedForLater: res.savedForLater,
              summary: res.summary,
              selectedItemIds: finalSelected,
              isSyncing: false,
            });
          }
        } catch {
          set({ isSyncing: false });
        }
      },

      addItem: async (item, quantity = 1) => {
        // Optimistic update
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.id === item.id || (i.productId === item.productId && i.variantId === item.variantId)
          );

          let updated: CartItem[];
          if (existingIndex > -1) {
            updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
          } else {
            const newItem: CartItem = {
              ...item,
              id: item.id || `temp_${Date.now()}`,
              quantity,
            };
            updated = [newItem, ...state.items];
          }

          return {
            items: updated,
            selectedItemIds: Array.from(new Set([...state.selectedItemIds, updated[0].id])),
          };
        });

        // Backend Sync
        try {
          await cartApi.addToCart({
            productId: item.productId,
            variantId: item.variantId || undefined,
            quantity,
            sessionId: typeof window !== "undefined" ? getCartSessionId() : undefined,
          });
          await get().fetchCart();
        } catch (err) {
          // If error occurs, refresh cart from server
          await get().fetchCart();
          throw err;
        }
      },

      removeItem: async (itemId: string) => {
        const prevItems = get().items;
        // Optimistic removal
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
          selectedItemIds: state.selectedItemIds.filter((id) => id !== itemId),
        }));

        try {
          await cartApi.removeCartItem(itemId);
          await get().fetchCart();
        } catch {
          set({ items: prevItems });
          await get().fetchCart();
        }
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          await get().removeItem(itemId);
          return;
        }

        const prevItems = get().items;
        // Optimistic update
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));

        try {
          await cartApi.updateCartItem(itemId, { quantity });
          await get().fetchCart();
        } catch {
          set({ items: prevItems });
          await get().fetchCart();
        }
      },

      toggleSaveForLater: async (itemId: string, savedForLater: boolean) => {
        try {
          await cartApi.updateCartItem(itemId, { savedForLater });
          await get().fetchCart();
        } catch (err) {
          await get().fetchCart();
          throw err;
        }
      },

      clearCart: async () => {
        set({ items: [], vendorGroups: [], selectedItemIds: [] });
        try {
          await cartApi.clearCart();
          await get().fetchCart();
        } catch {
          await get().fetchCart();
        }
      },

      mergeGuestCart: async () => {
        if (typeof window === "undefined") return;
        const sessionId = getCartSessionId();
        if (!sessionId) return;

        try {
          await cartApi.mergeGuestCart(sessionId);
          await get().fetchCart();
        } catch {
          // Non-blocking
        }
      },

      toggleSelectItem: (itemId: string) => {
        set((state) => {
          const exists = state.selectedItemIds.includes(itemId);
          return {
            selectedItemIds: exists
              ? state.selectedItemIds.filter((id) => id !== itemId)
              : [...state.selectedItemIds, itemId],
          };
        });
      },

      toggleSelectVendor: (vendorId: string) => {
        set((state) => {
          const group = state.vendorGroups.find((g) => g.vendorId === vendorId);
          if (!group) return state;

          const groupItemIds = group.items.map((i) => i.id);
          const allSelected = groupItemIds.every((id) => state.selectedItemIds.includes(id));

          return {
            selectedItemIds: allSelected
              ? state.selectedItemIds.filter((id) => !groupItemIds.includes(id))
              : Array.from(new Set([...state.selectedItemIds, ...groupItemIds])),
          };
        });
      },

      selectAllItems: (selectAll: boolean) => {
        set((state) => ({
          selectedItemIds: selectAll ? state.items.map((i) => i.id) : [],
        }));
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + (item.savedForLater ? 0 : item.quantity), 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.savedForLater ? 0 : item.price * item.quantity),
          0
        );
      },

      getSelectedSubtotal: () => {
        const { items, selectedItemIds } = get();
        return items
          .filter((item) => selectedItemIds.includes(item.id) && !item.savedForLater)
          .reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getSelectedCount: () => {
        const { items, selectedItemIds } = get();
        return items
          .filter((item) => selectedItemIds.includes(item.id) && !item.savedForLater)
          .reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "vexlora_cart_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        selectedItemIds: state.selectedItemIds,
      }),
    }
  )
);
