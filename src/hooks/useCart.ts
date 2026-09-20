import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCartStore, CartItem } from "@/stores/cart.store";

/**
 * Add an item to cart via Zustand store + backend sync.
 * Wraps the existing optimistic-update logic with useMutation lifecycle.
 */
export function useAddToCart() {
  const addItem = useCartStore((s) => s.addItem);

  return useMutation<void, Error, { item: Omit<CartItem, "quantity">; quantity?: number }>({
    mutationFn: ({ item, quantity }) => addItem(item, quantity),
    onSuccess: () => {
      toast.success("Added to cart!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add item to cart");
    },
  });
}

/**
 * Remove an item from cart.
 */
export function useRemoveFromCart() {
  const removeItem = useCartStore((s) => s.removeItem);

  return useMutation<void, Error, string>({
    mutationFn: (itemId) => removeItem(itemId),
    onError: (error) => {
      toast.error(error.message || "Failed to remove item");
    },
  });
}

/**
 * Update the quantity of a cart item.
 */
export function useUpdateCartQuantity() {
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  return useMutation<void, Error, { itemId: string; quantity: number }>({
    mutationFn: ({ itemId, quantity }) => updateQuantity(itemId, quantity),
    onError: (error) => {
      toast.error(error.message || "Failed to update quantity");
    },
  });
}

/**
 * Clear all items from the cart.
 */
export function useClearCart() {
  const clearCart = useCartStore((s) => s.clearCart);

  return useMutation<void, Error, void>({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      toast.success("Cart cleared");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to clear cart");
    },
  });
}
