"use client";

import React from "react";
import { Order } from "@/lib/api/orders";
import { MapPin, CreditCard } from "lucide-react";

interface OrderSummaryCardsProps {
  order: Order;
}

export const OrderSummaryCards: React.FC<OrderSummaryCardsProps> = ({ order }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-highlight" /> Shipping Destination
          </h4>
          <p className="text-sm font-bold text-primary">
            {order.shippingAddress.label || "Customer Address"}
          </p>
          <p className="text-xs text-secondary mt-1 leading-relaxed">
            {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.zip}
          </p>
          {order.shippingAddress.phone && (
            <p className="text-xs text-secondary mt-1">Phone: {order.shippingAddress.phone}</p>
          )}
        </div>
      )}

      {/* Payment Breakdown */}
      <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-highlight" /> Payment Breakdown
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-secondary">
            <span>Subtotal</span>
            <span>${Number(order.totalAmount).toFixed(2)}</span>
          </div>
          {order.couponDiscount && Number(order.couponDiscount) > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Coupon Discount ({order.couponCode})</span>
              <span>-${Number(order.couponDiscount).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-primary font-bold pt-2 border-t border-border text-sm">
            <span>Total Paid</span>
            <span>${Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
