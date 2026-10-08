"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Store,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Search,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { useMyOrders } from "@/hooks/useOrders";
import { orderApi, Order, SubOrder } from "@/lib/api/orders";
import { formatCurrency } from "@/lib/utils";
import { useChatStore } from "@/stores/chat.store";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";

export const AccountOrdersTab: React.FC = () => {
  const { data: ordersData, isLoading, refetch } = useMyOrders();
  const { openChatWithVendor, setOpen: setChatOpen } = useChatStore();
  const queryClient = useQueryClient();

  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const orders: Order[] = Array.isArray(ordersData?.data)
    ? ordersData.data
    : Array.isArray(ordersData)
    ? (ordersData as unknown as Order[])
    : [];

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleCopy = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrderId(orderNumber);
    toast.success("Order number copied to clipboard");
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleMessageSeller = async (subOrder: SubOrder, order: Order) => {
    setChatOpen(true);
    await openChatWithVendor(subOrder.vendorId, {
      subOrderId: subOrder.id,
      vendorPreview: {
        storeName: subOrder.vendor?.storeName || "Seller Store",
        storeLogo: subOrder.vendor?.storeLogo,
      },
    });
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order? Stock will be released and payment will be voided.")) {
      return;
    }

    setCancellingOrderId(orderId);
    try {
      await orderApi.cancelMyOrder(orderId, "Customer cancelled from account dashboard");
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.dashboard });
      refetch();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to cancel order";
      toast.error(errorMsg);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getSubOrderStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3 h-3" /> Shipped / In Transit
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Clock className="w-3 h-3" /> Confirmed by Seller
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-highlight border border-rose-200">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-muted text-secondary border border-border">
            {status}
          </span>
        );
    }
  };

  // Filter & search orders
  const filteredOrders = orders.filter((order) => {
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchOrderNum = order.orderNumber.toLowerCase().includes(q);
      const matchVendor = order.subOrders?.some((so) =>
        so.vendor?.storeName.toLowerCase().includes(q)
      );
      const matchItems = order.subOrders?.some((so) =>
        so.items?.some((it) => it.name.toLowerCase().includes(q))
      );
      if (!matchOrderNum && !matchVendor && !matchItems) return false;
    }

    // Status filter
    if (activeFilter === "ALL") return true;
    if (activeFilter === "PENDING") {
      return (
        order.paymentStatus === "PENDING" ||
        order.subOrders?.some(
          (so) => so.status === "PENDING" || so.status === "CONFIRMED" || so.status === "PROCESSING"
        )
      );
    }
    if (activeFilter === "SHIPPED") {
      return order.subOrders?.some((so) => so.status === "SHIPPED");
    }
    if (activeFilter === "DELIVERED") {
      return order.subOrders?.every((so) => so.status === "DELIVERED");
    }
    if (activeFilter === "CANCELLED") {
      return order.subOrders?.some((so) => so.status === "CANCELLED");
    }
    return true;
  });

  return (
    <div className="space-y-6 text-[14px]">
      {/* Top Filter Bar & Search */}
      <div className="bg-white rounded-3xl border border-border p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Orders" },
            { id: "PENDING", label: "Pending" },
            { id: "SHIPPED", label: "In Transit" },
            { id: "DELIVERED", label: "Delivered" },
            { id: "CANCELLED", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-[14px] font-bold transition-colors cursor-pointer shrink-0 ${
                activeFilter === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-muted text-secondary hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, store, or item..."
            className="w-full pl-9 pr-3 py-1.5 bg-muted/60 border border-border rounded-xl text-[14px] text-primary placeholder:text-secondary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="py-16 text-center text-secondary bg-white rounded-3xl border border-border">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[14px] font-bold text-primary">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center text-secondary bg-white rounded-3xl border border-border px-4">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h4 className="text-base font-bold text-primary">No orders found</h4>
          <p className="text-[14px] text-secondary mt-1 mb-4 max-w-md mx-auto">
            {searchQuery || activeFilter !== "ALL"
              ? "No orders match your selected filter or search query."
              : "You haven't placed any orders yet. Explore our marketplace and start shopping!"}
          </p>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-[14px] font-bold rounded-xl transition-colors shadow-xs"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = !expandedOrders[order.id];
            const canCancel = order.subOrders?.every(
              (so) => so.status === "PENDING" || so.status === "CONFIRMED"
            );

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-border shadow-xs overflow-hidden transition-all duration-200"
              >
                {/* Order Summary Header */}
                <div className="p-5 sm:p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
                        Order Number
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-base font-black text-primary font-mono">
                          #{order.orderNumber}
                        </span>
                        <button
                          onClick={() => handleCopy(order.orderNumber)}
                          className="p-1 hover:bg-muted rounded text-secondary hover:text-primary transition-colors cursor-pointer"
                          title="Copy Order Number"
                        >
                          {copiedOrderId === order.orderNumber ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
                        Date Placed
                      </span>
                      <span className="text-[14px] font-bold text-primary block mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
                        Total Amount
                      </span>
                      <span className="text-base font-black text-primary block mt-0.5">
                        {formatCurrency(Number(order.totalAmount))}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
                        Payment Status
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                          order.paymentStatus === "PAID"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <Link
                      href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}
                      className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-primary text-[14px] font-bold flex items-center gap-1.5 transition-colors border border-border"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Live Tracker</span>
                    </Link>

                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                        className="px-3 py-2 rounded-xl border border-rose-200 text-highlight hover:bg-rose-50 text-[14px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {cancellingOrderId === order.id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}

                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="px-3 py-2 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary text-[14px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? "Hide Details" : "View Items"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Sub-Orders & Product Items Breakdown */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-muted/20 divide-y divide-border space-y-6">
                    {order.subOrders?.map((subOrder) => (
                      <div key={subOrder.id} className="pt-4 first:pt-0">
                        {/* Sub-Order Store Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 bg-white p-3.5 rounded-2xl border border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
                              {subOrder.vendor?.storeLogo ? (
                                <Image
                                  src={subOrder.vendor.storeLogo}
                                  alt={subOrder.vendor.storeName}
                                  width={36}
                                  height={36}
                                  className="rounded-lg object-cover"
                                />
                              ) : (
                                <Store className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[14px] font-bold text-primary">
                                  {subOrder.vendor?.storeName || "Vendor Store"}
                                </span>
                                {getSubOrderStatusBadge(subOrder.status)}
                              </div>
                              {subOrder.trackingNumber && (
                                <span className="text-xs text-secondary font-mono">
                                  Tracking: {subOrder.trackingNumber}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleMessageSeller(subOrder, order)}
                              className="px-3 py-1.5 rounded-xl bg-highlight/10 hover:bg-highlight hover:text-white text-highlight text-[14px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Message Seller</span>
                            </button>
                            <span className="text-[14px] font-black text-primary">
                              Subtotal: {formatCurrency(Number(subOrder.subtotal))}
                            </span>
                          </div>
                        </div>

                        {/* Items in this sub-order */}
                        <div className="space-y-2 pl-2">
                          {subOrder.items?.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between py-2 text-[14px]"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-primary font-bold shrink-0">
                                  <Package className="w-4 h-4 text-secondary" />
                                </div>
                                <div>
                                  <p className="font-bold text-primary">{item.name}</p>
                                  <p className="text-secondary text-xs">
                                    Qty: {item.quantity} × {formatCurrency(Number(item.price))}
                                  </p>
                                </div>
                              </div>
                              <span className="font-bold text-primary">
                                {formatCurrency(Number(item.price) * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Shipping Address snapshot */}
                    {order.shippingAddress && (
                      <div className="pt-4 text-[14px] text-secondary flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-primary">Delivery Address: </span>
                          <span>
                            {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                            {order.shippingAddress.zip}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
