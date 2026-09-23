"use client";

import React, { useState } from "react";
import { X, Tag, Copy, Check, Sparkles, Store, Clock, AlertCircle } from "lucide-react";
import { usePublicCoupons } from "@/hooks/useCoupons";
import { CouponItem } from "@/lib/api/coupons";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface AvailableCouponsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCoupon?: (code: string) => void;
  vendorId?: string;
  currentSubtotal?: number;
}

export const AvailableCouponsModal: React.FC<AvailableCouponsModalProps> = ({
  isOpen,
  onClose,
  onSelectCoupon,
  vendorId,
  currentSubtotal = 0,
}) => {
  const { data: coupons = [], isLoading } = usePublicCoupons(vendorId);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApply = (code: string) => {
    if (onSelectCoupon) {
      onSelectCoupon(code);
      onClose();
    } else {
      handleCopy(code);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-primary text-base sm:text-lg">
                Available Promo Vouchers
              </h3>
              <p className="text-xs text-secondary mt-0.5">
                Apply a code to save extra on your order
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Coupon List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-2xl border border-border bg-muted/30 animate-pulse space-y-2">
                  <div className="h-5 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 text-secondary">
                <Tag className="w-6 h-6" />
              </div>
              <p className="font-bold text-primary text-sm">No Active Coupons Right Now</p>
              <p className="text-xs text-secondary mt-1">Check back later for exciting seasonal promos!</p>
            </div>
          ) : (
            coupons.map((c: CouponItem) => {
              const isEligible = !c.minPurchase || currentSubtotal >= Number(c.minPurchase);
              const isCopied = copiedCode === c.code;

              return (
                <div
                  key={c.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isEligible
                      ? "border-primary/20 bg-gradient-to-r from-primary/[0.02] to-highlight/[0.02] hover:border-primary/40 shadow-2xs"
                      : "border-border bg-muted/20 opacity-80"
                  }`}
                >
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-extrabold text-xs px-2.5 py-1 bg-primary text-white rounded-lg tracking-wider shadow-2xs flex items-center gap-1.5">
                        <Tag className="w-3 h-3" />
                        {c.code}
                      </span>
                      {c.scope === "platform" ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Platform-Wide
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                          <Store className="w-2.5 h-2.5" />
                          {c.vendor?.storeName || "Vendor Store"}
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-bold text-primary">
                      {c.discountType === "percentage"
                        ? `${c.discountValue}% OFF`
                        : `${formatCurrency(c.discountValue)} OFF`}
                      {c.minPurchase ? (
                        <span className="text-xs font-normal text-secondary ml-1.5">
                          on orders above {formatCurrency(Number(c.minPurchase))}
                        </span>
                      ) : (
                        <span className="text-xs font-normal text-secondary ml-1.5">
                          on all qualifying items
                        </span>
                      )}
                    </div>

                    {c.expiresAt && (
                      <div className="flex items-center gap-1 text-[11px] text-secondary">
                        <Clock className="w-3 h-3" />
                        <span>
                          Valid until {new Date(c.expiresAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    )}

                    {!isEligible && c.minPurchase && currentSubtotal > 0 && (
                      <div className="flex items-center gap-1 text-[10px] font-medium text-amber-600 pt-0.5">
                        <AlertCircle className="w-3 h-3" />
                        <span>Add {formatCurrency(Number(c.minPurchase) - currentSubtotal)} more to use this code</span>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-center gap-2">
                    {onSelectCoupon ? (
                      <button
                        type="button"
                        onClick={() => handleApply(c.code)}
                        className="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer text-center"
                      >
                        Apply Code
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCopy(c.code)}
                        className="w-full sm:w-auto px-3.5 py-2 bg-muted hover:bg-muted/80 text-primary font-bold text-xs rounded-xl border border-border flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? "Copied" : "Copy"}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
