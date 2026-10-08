"use client";

import React from "react";
import Link from "next/link";
import { Order } from "@/lib/api/orders";
import { ExternalLink } from "lucide-react";

interface OrderHeaderBannerProps {
  order: Order;
}

export const OrderHeaderBanner: React.FC<OrderHeaderBannerProps> = ({ order }) => {
  return (
    <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-highlight bg-highlight/10 px-2.5 py-0.5 rounded-full">
            Live Order Tracker
          </span>
          <span className="text-xs text-secondary">
            Placed {new Date(order.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
          Order #{order.orderNumber}
        </h2>
        <p className="text-xs sm:text-sm text-secondary mt-1">
          Payment Status:{" "}
          <span className={`font-bold ${order.paymentStatus === "PAID" ? "text-emerald-600" : "text-amber-600"}`}>
            {order.paymentStatus}
          </span>{" "}
          ({order.paymentMethod || "Card"}) • Total:{" "}
          <span className="font-black text-primary">${Number(order.totalAmount).toFixed(2)}</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href={`/order-success?orderId=${order.id}&orderNumber=${order.orderNumber}`}
          className="px-4 py-2.5 rounded-xl border border-border text-xs sm:text-sm font-semibold text-primary hover:bg-muted transition-colors flex items-center gap-1.5"
        >
          Receipt <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
