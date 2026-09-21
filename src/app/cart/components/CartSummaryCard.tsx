import * as React from "react";
import {
  CheckCircle2,
  Star,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CartSummaryCardProps {
  selectedCount: number;
  selectedSubtotal: number;
  remainingForFreeShipping: number;
  freeShippingProgress: number;
  couponCode: string;
  setCouponCode: (code: string) => void;
  couponApplied: boolean;
  couponDiscount: number;
  couponError: string;
  onApplyCoupon: (e: React.FormEvent) => void;
  finalTotal: number;
  onProceedToCheckout: () => void;
}

export function CartSummaryCard({
  selectedCount,
  selectedSubtotal,
  remainingForFreeShipping,
  freeShippingProgress,
  couponCode,
  setCouponCode,
  couponApplied,
  couponDiscount,
  couponError,
  onApplyCoupon,
  finalTotal,
  onProceedToCheckout,
}: CartSummaryCardProps) {
  return (
    <div className="space-y-5 lg:sticky lg:top-24">
      {/* Free Shipping Tier Card */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-2xs">
        <div className="text-center mb-2 text-xs font-medium text-secondary">
          {remainingForFreeShipping > 0 ? (
            <>
              Buy{" "}
              <span className="font-bold text-primary">
                {formatCurrency(remainingForFreeShipping)}
              </span>{" "}
              more to enjoy{" "}
              <span className="font-bold text-primary">FREE Shipping</span>
            </>
          ) : (
            <span className="font-bold text-emerald-700 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              You&apos;ve unlocked FREE Shipping!
            </span>
          )}
        </div>

        {/* Progress Bar with Star */}
        <div className="relative h-2 w-full rounded-full bg-muted overflow-visible my-3">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${freeShippingProgress}%` }}
          />
          <div
            className="absolute -top-2 transform -translate-x-1/2 h-6 w-6 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-xs transition-all duration-300"
            style={{
              left: `${Math.max(4, Math.min(96, freeShippingProgress))}%`,
            }}
          >
            <Star className="h-3 w-3 fill-primary text-primary" />
          </div>
        </div>
      </div>

      {/* Order Summary Details Card */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-2xs space-y-5">
        <h3 className="text-lg font-bold text-primary pb-3 border-b border-border">
          Order Summary
        </h3>

        <div className="space-y-3 text-sm text-secondary">
          <div className="flex justify-between">
            <span>Selected items ({selectedCount}):</span>
            <span className="font-bold text-primary">
              {formatCurrency(selectedSubtotal)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Estimated Shipping:</span>
            <span className="font-bold text-emerald-600">
              {remainingForFreeShipping === 0 ? "FREE" : "$15.00"}
            </span>
          </div>

          {couponApplied && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Coupon Discount:</span>
              <span>-{formatCurrency(couponDiscount)}</span>
            </div>
          )}

          <div className="pt-3 border-t border-border flex justify-between items-baseline">
            <span className="text-base font-bold text-primary">Total:</span>
            <span className="text-2xl font-black text-primary">
              {formatCurrency(
                finalTotal + (remainingForFreeShipping === 0 ? 0 : 15)
              )}
            </span>
          </div>
        </div>

        {/* Coupon Code Box */}
        <form onSubmit={onApplyCoupon} className="pt-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code (e.g. SAVE10)"
                className="w-full rounded-xl border border-border pl-9 pr-3 py-2 text-xs text-primary uppercase placeholder:normal-case focus:border-primary focus:outline-none"
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

        {/* Checkout Button */}
        <button
          type="button"
          disabled={selectedCount === 0}
          onClick={onProceedToCheckout}
          className="w-full py-4 px-6 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-sm transition-all active:scale-[0.98] cursor-pointer text-center"
        >
          Proceed to Checkout ({selectedCount})
        </button>

        {/* Marketplace Guarantees */}
        <div className="space-y-2.5 pt-4 border-t border-border text-xs text-secondary">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>100% Buyer Protection & Money Back Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary shrink-0" />
            <span>Fast tracked delivery from verified vendors</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-amber-500 shrink-0" />
            <span>Easy 14-day return & dispute resolution</span>
          </div>
        </div>
      </div>
    </div>
  );
}
