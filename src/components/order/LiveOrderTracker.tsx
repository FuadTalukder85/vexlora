"use client";

import React, { useEffect, useState } from "react";
import { Order, SubOrder } from "@/lib/api/orders";
import { useChatStore } from "@/stores/chat.store";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";
import { OrderHeaderBanner } from "./OrderHeaderBanner";
import { OrderTimelineStepper, ORDER_MILESTONES } from "./OrderTimelineStepper";
import { VendorSubOrderCard } from "./VendorSubOrderCard";
import { OrderSummaryCards } from "./OrderSummaryCards";

interface LiveOrderTrackerProps {
  initialOrder: Order;
}

export const LiveOrderTracker: React.FC<LiveOrderTrackerProps> = ({ initialOrder }) => {
  const [order, setOrder] = useState<Order>(initialOrder);
  const { openChatWithVendor } = useChatStore();

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  useEffect(() => {
    if (!order?.orderNumber) return;

    const socket = getSocket();
    socket.emit("join_order", order.orderNumber);

    const handleStatusUpdate = (payload: {
      type: string;
      data: { subOrderId: string; status: SubOrder["status"]; trackingNumber?: string };
    }) => {
      if (payload.type === "ORDER_STATUS_UPDATED") {
        toast.info(`Live Update: Order status changed to ${payload.data.status}`);
        setOrder((prev) => {
          if (!prev) return prev;
          const updatedSubOrders = prev.subOrders.map((sub) =>
            sub.id === payload.data.subOrderId
              ? {
                  ...sub,
                  status: payload.data.status,
                  trackingNumber: payload.data.trackingNumber ?? sub.trackingNumber,
                }
              : sub
          );
          return {
            ...prev,
            subOrders: updatedSubOrders,
          };
        });
      }
    };

    socket.on("ORDER_STATUS_UPDATED", handleStatusUpdate);

    return () => {
      socket.emit("leave_order", order.orderNumber);
      socket.off("ORDER_STATUS_UPDATED", handleStatusUpdate);
    };
  }, [order?.orderNumber]);

  // Overall milestone calculation based on sub-orders
  const calculateCurrentStepIndex = () => {
    if (order.paymentStatus === "PENDING") return 0;
    if (order.paymentStatus === "PAID") {
      const allDelivered = order.subOrders.every((s) => s.status === "DELIVERED");
      if (allDelivered) return 4;
      const anyShipped = order.subOrders.some((s) => s.status === "SHIPPED");
      if (anyShipped) return 3;
      const anyConfirmed = order.subOrders.some(
        (s) => s.status === "CONFIRMED" || s.status === "PROCESSING"
      );
      if (anyConfirmed) return 2;
      return 1;
    }
    return 0;
  };

  const activeStepIdx = calculateCurrentStepIndex();

  const handleContactVendor = (subOrder: SubOrder) => {
    openChatWithVendor(subOrder.vendorId, {
      subOrderId: subOrder.id,
      initialMessage: `Hi, I'm inquiring about my order #${order.orderNumber} (Sub-order: ${subOrder.id})`,
      vendorPreview: {
        storeName: subOrder.vendor?.storeName || "Vendor Store",
        storeLogo: subOrder.vendor?.storeLogo,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Order Info Banner */}
      <OrderHeaderBanner order={order} />

      {/* Visual Live Stepper Timeline */}
      <OrderTimelineStepper activeStepIdx={activeStepIdx} />

      {/* Sub-Orders Multi-Vendor Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-primary">Shipments by Vendor Store</h3>

        <div className="grid grid-cols-1 gap-4">
          {order.subOrders.map((subOrder) => (
            <VendorSubOrderCard
              key={subOrder.id}
              subOrder={subOrder}
              onContactVendor={handleContactVendor}
            />
          ))}
        </div>
      </div>

      {/* Shipping Address & Payment Breakdown */}
      <OrderSummaryCards order={order} />
    </div>
  );
};
