import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";
import { toast } from "sonner";

interface CompareStore {
  items: Product[];
  isOpen: boolean;
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  isInCompare: (productId: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addToCompare: (product: Product) => {
        const { items } = get();
        if (items.some((i) => i.id === product.id)) {
          toast.info(`"${product.title}" is already in your comparison list.`);
          return;
        }

        if (items.length >= 4) {
          toast.error("You can compare up to 4 products at a time. Please remove an item first.");
          return;
        }

        set({ items: [...items, product] });
        toast.success(`Added "${product.title}" to compare.`);
      },

      removeFromCompare: (productId: string) => {
        const { items } = get();
        set({ items: items.filter((i) => i.id !== productId) });
        toast.info("Removed product from comparison.");
      },

      clearCompare: () => {
        set({ items: [] });
      },

      toggleOpen: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      setOpen: (open: boolean) => {
        set({ isOpen: open });
      },

      isInCompare: (productId: string) => {
        return get().items.some((i) => i.id === productId);
      },
    }),
    {
      name: "vexlora_compare_items",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
