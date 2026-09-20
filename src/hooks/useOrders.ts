import { useQuery, useMutation } from "@tanstack/react-query";
import {
  orderApi,
  Order,
  CreateOrderPayload,
  CreatePaymentIntentPayload,
  PaymentIntentResponse,
} from "@/lib/api/orders";
import { queryKeys } from "@/lib/query/keys";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";

/**
 * Create an order (COD or after Stripe payment success).
 * Refreshes the cart after successful order placement.
 */
export function useCreateOrder() {
  const fetchCart = useCartStore((s) => s.fetchCart);

  return useMutation<Order, Error, CreateOrderPayload>({
    mutationFn: (payload) => orderApi.createOrder(payload),
    onSuccess: () => {
      // Refresh cart to remove checked-out items
      fetchCart();
    },
  });
}

/**
 * Create a Stripe PaymentIntent for the current checkout.
 * Pure mutation — no cache side effects.
 */
export function useCreatePaymentIntent() {
  return useMutation<PaymentIntentResponse, Error, CreatePaymentIntentPayload>({
    mutationFn: (payload) => orderApi.createPaymentIntent(payload),
  });
}

/**
 * Fetch the authenticated user's orders with optional pagination/filters.
 * Prepared for a future "My Orders" page.
 */
export function useMyOrders(params?: Record<string, unknown>) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => orderApi.getMyOrders(params),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch a single order by ID.
 * Prepared for a future order detail page.
 */
export function useOrderDetail(id: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => orderApi.getOrderById(id),
    enabled: isAuthenticated && !!id,
    staleTime: 2 * 60 * 1000,
  });
}
