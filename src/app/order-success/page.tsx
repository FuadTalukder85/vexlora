"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle,
  Package,
  ArrowRight,
  ShoppingBag,
  Clock,
  ShieldCheck,
  Truck,
  Copy,
  Check,
} from "lucide-react";
import { useIsMounted } from "@/lib/utils";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "ORD-SUCCESS";
  const orderId = searchParams.get("orderId");

  const [copied, setCopied] = React.useState(false);
  const mounted = useIsMounted();

  // Show success toast when the page mounts
  React.useEffect(() => {
    if (mounted) {
      toast.success("Your order has been placed successfully!", {
        duration: 5000,
      });
    }
  }, [mounted]);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-muted/50">
        <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/60 py-12 lg:py-16">
      <div className="layout-container max-w-2xl px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-10 shadow-sm text-center space-y-6">
          
          {/* Success Icon */}
          <div className="h-20 w-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs animate-in zoom-in-50 duration-300">
            <CheckCircle className="h-10 w-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1 block">
              Order Confirmed & Placed
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-secondary mt-1.5 max-w-md mx-auto">
              We have received your order. The respective merchants have been notified and will begin preparing your packages.
            </p>
          </div>

          {/* Order Reference Box */}
          <div className="bg-muted/80 rounded-2xl border border-border p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <span className="text-[11px] font-semibold text-secondary block">
                Order Reference Number
              </span>
              <span className="text-sm sm:text-base font-extrabold text-primary font-mono">
                {orderNumber}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-border text-xs font-bold text-primary hover:bg-muted transition-colors shadow-2xs cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-secondary" />
                  <span>Copy Number</span>
                </>
              )}
            </button>
          </div>

          {/* Key Details Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
            <div className="p-4 rounded-xl border border-border bg-muted/50 space-y-1">
              <Clock className="h-4 w-4 text-primary mb-1" />
              <h4 className="text-xs font-bold text-primary">Estimated Delivery</h4>
              <p className="text-[11px] text-secondary">3 - 5 business days</p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/50 space-y-1">
              <Truck className="h-4 w-4 text-primary mb-1" />
              <h4 className="text-xs font-bold text-primary">Shipping Carrier</h4>
              <p className="text-[11px] text-secondary">Tracked Merchant Express</p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/50 space-y-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600 mb-1" />
              <h4 className="text-xs font-bold text-primary">Buyer Protection</h4>
              <p className="text-[11px] text-secondary">100% Guaranteed</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/products"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-sm transition-all text-center flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Link>

            <Link
              href="/cart"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-border bg-white hover:bg-muted text-primary font-bold text-xs transition-colors text-center"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
