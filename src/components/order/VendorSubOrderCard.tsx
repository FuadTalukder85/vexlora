"use client";

import React from "react";
import { SubOrder } from "@/lib/api/orders";
import { Building2, Truck, MessageSquare } from "lucide-react";

interface VendorSubOrderCardProps {
  subOrder: SubOrder;
  onContactVendor: (subOrder: SubOrder) => void;
}

export const VendorSubOrderCard: React.FC<VendorSubOrderCardProps> = ({
  subOrder,
  onContactVendor,
}) => {
  return (
    <div className="bg-card rounded-3xl p-6 border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-4 flex-1">
        {/* Vendor Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-muted text-primary">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary">
                {subOrder.vendor?.storeName || "Vendor Store"}
              </h4>
              <p className="text-xs text-secondary">
                Sub-Order ID: {subOrder.id.substring(0, 10)}...
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              subOrder.status === "DELIVERED"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : subOrder.status === "SHIPPED"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : subOrder.status === "CANCELLED"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {subOrder.status}
          </span>
        </div>

        {/* Items List */}
        <div className="space-y-2 pt-2 border-t border-border">
          {subOrder.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-semibold text-primary truncate max-w-[280px]">
                  {item.name}
                </span>
                <span className="text-secondary">x{item.quantity}</span>
              </div>
              <span className="font-bold text-primary shrink-0">
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Tracking Code if Shipped */}
        {subOrder.trackingNumber && (
          <div className="p-3 bg-muted rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-primary">
              <Truck className="w-4 h-4 text-secondary" />
              <span>
                Tracking #: <strong className="text-primary font-mono">{subOrder.trackingNumber}</strong>
              </span>
            </div>
            {subOrder.shippedAt && (
              <span className="text-secondary text-[11px]">
                Shipped {new Date(subOrder.shippedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex md:flex-col items-center gap-2 shrink-0 md:border-l md:border-border md:pl-6">
        <button
          onClick={() => onContactVendor(subOrder)}
          className="w-full px-4 py-2.5 bg-primary hover:bg-highlight text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Chat with Vendor
        </button>
      </div>
    </div>
  );
};
