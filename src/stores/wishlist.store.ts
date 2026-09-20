import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { wishlistApi } from "@/lib/api/wishlist";

export interface WishlistItem {
  id?: string;
  productId: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image?: string;
  vendorName?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  isSyncing: boolean;

  // Actions
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (item: WishlistItem) => Promise<boolean>;
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isSyncing: false,

      fetchWishlist: async () => {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("vexlora_token");
        if (!token) return;

        set({ isSyncing: true });
        try {
          const res = await wishlistApi.getMyWishlist({ limit: 100 });
          if (res?.data) {
            const serverItems: WishlistItem[] = res.data.map((w) => ({
              id: w.id,
              productId: w.productId || w.product?.id,
              title: w.product?.title || "Product",
              slug: w.product?.slug || w.productId,
              price: w.product?.discountPrice
                ? Number(w.product.discountPrice)
                : Number(w.product?.basePrice || 0),
              originalPrice:
                w.product?.discountPrice && Number(w.product.discountPrice) < Number(w.product.basePrice)
                  ? Number(w.product.basePrice)
                  : undefined,
              image: w.product?.images?.[0],
              vendorName: w.product?.vendor?.storeName,
              rating: Number(w.product?.ratingAvg) || 0,
              reviews: w.product?.ratingCount || 0,
              inStock: (w.product?.totalStock ?? 0) > 0,
            }));

            set({ items: serverItems, isSyncing: false });
          }
        } catch {
          set({ isSyncing: false });
        }
      },

      toggleWishlist: async (item) => {
        const isPresent = get().isInWishlist(item.productId);
        const prevItems = get().items;

        // Optimistic local update
        if (isPresent) {
          set({ items: prevItems.filter((i) => i.productId !== item.productId) });
        } else {
          set({ items: [item, ...prevItems] });
        }

        // Background server sync if logged in
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("vexlora_token");
          if (token) {
            try {
              await wishlistApi.toggle(item.productId);
            } catch {
              // Rollback on failure
              set({ items: prevItems });
              return isPresent;
            }
          }
        }

        return !isPresent;
      },

      addItem: async (item) => {
        if (get().isInWishlist(item.productId)) return;
        const prevItems = get().items;
        set({ items: [item, ...prevItems] });

        if (typeof window !== "undefined") {
          const token = localStorage.getItem("vexlora_token");
          if (token) {
            try {
              await wishlistApi.add(item.productId);
            } catch {
              set({ items: prevItems });
            }
          }
        }
      },

      removeItem: async (productId) => {
        const prevItems = get().items;
        set({ items: prevItems.filter((i) => i.productId !== productId) });

        if (typeof window !== "undefined") {
          const token = localStorage.getItem("vexlora_token");
          if (token) {
            try {
              await wishlistApi.remove(productId);
            } catch {
              set({ items: prevItems });
            }
          }
        }
      },

      clearWishlist: async () => {
        const prevItems = get().items;
        set({ items: [] });

        if (typeof window !== "undefined") {
          const token = localStorage.getItem("vexlora_token");
          if (token) {
            try {
              await wishlistApi.clear();
            } catch {
              set({ items: prevItems });
            }
          }
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      getCount: () => get().items.length,
    }),
    {
      name: "vexlora_wishlist_storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
