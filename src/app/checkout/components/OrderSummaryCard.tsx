import * as React from "react";
import { CheckCircle2, Tag, Loader2, ShieldCheck, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface OrderSummaryCardProps {
  selectedCount: number;
  selectedSubtotal: number;
  shippingFee: number;
  isFreeShipping: boolean;
  freeShippingThreshold: number;
  couponCode: string;
  setCouponCode: (val: string) => void;
  couponApplied: boolean;
  couponDiscount: number;
  couponError: string;
  setCouponError: (val: string) => void;
  onApplyCoupon: (e: React.FormEvent) => void;
  finalTotal: number;
  isOrderInProgress: boolean;
  paymentMethod: string;
  selectedAddressId: string;
  onPlaceOrder: () => void;
}

export function OrderSummaryCard({
  selectedCount,
  selectedSubtotal,
  shippingFee,
  isFreeShipping,
  freeShippingThreshold,
  couponCode,
  setCouponCode,
  couponApplied,
  couponDiscount,
  couponError,
  setCouponError,
  onApplyCoupon,
  finalTotal,
  isOrderInProgress,
  paymentMethod,
  selectedAddressId,
  onPlaceOrder,
}: OrderSummaryCardProps) {
  return (
    <div className="space-y-5 lg:sticky lg:top-24">
      {/* Free Shipping Tier */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-2xs">
        <div className="text-center mb-1 text-xs font-medium text-secondary">
          {isFreeShipping ? (
            <span className="font-bold text-emerald-700 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              You&apos;ve unlocked FREE Shipping on this order!
            </span>
          ) : (
            <>
              Add{" "}
              <span className="font-bold text-primary">
                {formatCurrency(freeShippingThreshold - selectedSubtotal)}
              </span>{" "}
              more for <span className="font-bold text-primary">FREE Shipping</span>
            </>
          )}
        </div>
      </div>

      {/* Order Summary Breakdown Card */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-2xs space-y-5">
        <h3 className="text-lg font-bold text-primary pb-3 border-b border-border">
          Order Summary
        </h3>

        <div className="space-y-3 text-xs sm:text-sm text-secondary">
          <div className="flex justify-between">
            <span>Selected items ({selectedCount}):</span>
            <span className="font-bold text-primary">
              {formatCurrency(selectedSubtotal)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Shipping Fee:</span>
            <span className="font-bold text-emerald-600">
              {isFreeShipping ? "FREE" : formatCurrency(shippingFee)}
            </span>
          </div>

          {couponApplied && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Coupon Discount:</span>
              <span>-{formatCurrency(couponDiscount)}</span>
            </div>
          )}

          <div className="pt-3 border-t border-border flex justify-between items-baseline">
            <span className="text-base font-bold text-primary">Total to Pay:</span>
            <span className="text-2xl font-black text-primary">
              {formatCurrency(finalTotal)}
            </span>
          </div>
        </div>

        {/* Coupon Code Form */}
        <form onSubmit={onApplyCoupon} className="pt-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-secondary" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setCouponError("");
                }}
                placeholder="Coupon Code"
                className="w-full rounded-xl border border-border pl-8 pr-3 py-2 text-xs text-primary uppercase placeholder:normal-case focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-muted hover:bg-muted text-primary font-bold text-xs transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
          {couponError && (
            <p className="text-[11px] text-highlight font-medium mt-1">
              {couponError}
            </p>
          )}
          {couponApplied && (
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              Coupon applied successfully!
            </p>
          )}
        </form>

        {/* Place Order CTA */}
        <button
          type="button"
          disabled={isOrderInProgress || selectedCount === 0 || !selectedAddressId}
          onClick={onPlaceOrder}
          className="w-full py-4 px-6 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer text-center flex items-center justify-center gap-2"
        >
          {isOrderInProgress ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                {paymentMethod === "stripe"
                  ? "Authorizing Card Payment..."
                  : "Processing Order..."}
              </span>
            </>
          ) : (
            <span>
              {paymentMethod === "stripe" ? "Pay & Place Order" : "Place Order"} •{" "}
              {formatCurrency(finalTotal)}
            </span>
          )}
        </button>

        {/* Marketplace Guarantees */}
        <div className="space-y-2.5 pt-4 border-t border-border text-xs text-secondary">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>100% Secure Checkout & Buyer Protection</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary shrink-0" />
            <span>Fast trackable delivery direct from verified vendors</span>
          </div>
        </div>
      </div>
    </div>
  );
}
