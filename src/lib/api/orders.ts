import { http } from "./client";

export interface OrderItem {
  id: string;
  subOrderId: string;
  productId: string;
  variantId?: string | null;
  name: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubOrder {
  id: string;
  orderId: string;
  vendorId: string;
  subtotal: number;
  commissionAmount: number;
  vendorEarning: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";
  payoutStatus: "UNPAID" | "PENDING" | "PAID" | "REJECTED";
  trackingNumber?: string | null;
  shippingCarrier?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  items: OrderItem[];
  vendor?: {
    id: string;
    storeName: string;
    storeSlug: string;
    storeLogo?: string | null;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  shippingAddressId?: string | null;
  totalAmount: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentMethod?: string | null;
  paymentIntentId?: string | null;
  couponCode?: string | null;
  couponDiscount?: number | null;
  createdAt: string;
  updatedAt: string;
  subOrders: SubOrder[];
  shippingAddress?: {
    id: string;
    label?: string | null;
    street: string;
    city: string;
    zip: string;
    phone?: string | null;
  } | null;
}

export interface CreateOrderItemPayload {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items?: CreateOrderItemPayload[];
  selectedCartItemIds?: string[];
  shippingAddressId?: string;
  paymentMethod?: string;
  paymentIntentId?: string;
  couponCode?: string;
}

export interface CreatePaymentIntentPayload {
  items?: CreateOrderItemPayload[];
  selectedCartItemIds?: string[];
  shippingAddressId?: string;
  couponCode?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  publishableKey?: string;
}

export const orderApi = {
  createPaymentIntent: async (payload: CreatePaymentIntentPayload) => {
    const res = await http.post<PaymentIntentResponse, CreatePaymentIntentPayload>(
      "/orders/create-payment-intent",
      payload,
    );
    return res.data;
  },

  createOrder: async (payload: CreateOrderPayload) => {
    const res = await http.post<Order, CreateOrderPayload>("/orders", payload);
    return res.data;
  },

  getMyOrders: async (params?: Record<string, unknown>) => {
    const res = await http.get<{ data: Order[]; meta?: { total: number; page: number; limit: number } }>(
      "/orders/my-orders",
      params,
    );
    return res.data;
  },

  getOrderById: async (id: string) => {
    const res = await http.get<Order>(`/orders/my-orders/${id}`);
    return res.data;
  },

  cancelMyOrder: async (id: string, reason?: string) => {
    const res = await http.patch<Order, { reason?: string }>(`/orders/my-orders/${id}/cancel`, { reason });
    return res.data;
  },
};
