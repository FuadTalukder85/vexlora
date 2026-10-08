"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { orderApi, Order } from "@/lib/api/orders";
import { LiveOrderTracker } from "@/components/order/LiveOrderTracker";
import { OrderLookupForm } from "@/components/order/OrderLookupForm";
import { PackageCheck, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("orderNumber") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialOrderNumber) {
      handleLookup(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleLookup = async (lookupNumber?: string) => {
    const num = (lookupNumber ?? orderNumber).trim();
    if (!num) {
      toast.error("Please enter a valid order number");
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const data = await orderApi.trackOrder(num);
      setOrder(data);
    } catch {
      setOrder(null);
      toast.error(`Order #${num} not found. Please verify the order number.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-highlight/10 text-highlight text-xs font-bold mb-3 border border-highlight/20">
          <PackageCheck className="w-3.5 h-3.5" /> Real-Time Tracking
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
          Track Your Order
        </h1>
        <p className="text-sm text-secondary mt-2">
          Enter your order number to see live delivery status, vendor shipments, and dispatch milestones.
        </p>
      </div>

      {/* Search Lookup Form */}
      <OrderLookupForm
        orderNumber={orderNumber}
        loading={loading}
        onOrderNumberChange={setOrderNumber}
        onSubmit={handleSubmit}
      />

      {/* Result View */}
      {order ? (
        <LiveOrderTracker initialOrder={order} />
      ) : searched && !loading ? (
        <div className="py-16 text-center bg-card rounded-3xl border border-border p-6 shadow-xs">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-bold text-primary">Order Not Found</h3>
          <p className="text-xs text-secondary mt-1 max-w-sm mx-auto">
            We couldn&apos;t find an active order matching that number. Please check the receipt sent to your email.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full py-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
