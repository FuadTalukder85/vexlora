"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tag, Sparkles, Copy, Check, Store, Clock, ArrowRight, ShieldCheck, Percent, Gift } from "lucide-react";
import { usePublicCoupons } from "@/hooks/useCoupons";
import { CouponItem } from "@/lib/api/coupons";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function PublicCouponsPage() {
  const { data: coupons = [], isLoading } = usePublicCoupons();
  const [filterScope, setFilterScope] = useState<"ALL" | "PLATFORM" | "VENDOR">("ALL");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredCoupons = coupons.filter((c: CouponItem) => {
    if (filterScope === "PLATFORM") return c.scope === "platform";
    if (filterScope === "VENDOR") return c.scope === "vendor";
    return true;
  });

  return (
    <div className="min-h-screen bg-muted/40 py-10 lg:py-16">
      <div className="layout-container px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-secondary text-white p-8 sm:p-12 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-highlight/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-highlight" />
              <span>Vexlora Verified Vouchers & Deals</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Exclusive Coupons & Discount Codes
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Save more on every order with authentic platform and verified merchant vouchers. Copy your promo code and apply it during checkout.
            </p>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {[
              { label: "All Vouchers", value: "ALL", icon: Gift },
              { label: "Platform-Wide", value: "PLATFORM", icon: Percent },
              { label: "Store Exclusives", value: "VENDOR", icon: Store },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = filterScope === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setFilterScope(tab.value as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white text-secondary hover:text-primary border border-border"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-secondary self-start sm:self-auto">
            Showing <span className="font-bold text-primary">{filteredCoupons.length}</span> active coupon(s)
          </p>
        </div>

        {/* Coupons Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-border animate-pulse space-y-4 shadow-2xs">
                <div className="h-6 bg-muted rounded w-1/2" />
                <div className="h-10 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="bg-white rounded-3xl border border-border p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Tag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-primary">No Promo Codes Available</h3>
            <p className="text-xs text-secondary">
              No active vouchers match your current filter. Please check back soon or browse other categories!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary/90 transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map((coupon: CouponItem) => {
              const isCopied = copiedCode === coupon.code;
              return (
                <div
                  key={coupon.id}
                  className="bg-white rounded-3xl border border-border p-6 shadow-2xs hover:shadow-md hover:border-primary/30 transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Badge & Scope */}
                    <div className="flex items-center justify-between gap-2">
                      {coupon.scope === "platform" ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Platform-Wide
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-flex items-center gap-1">
                          <Store className="w-3.5 h-3.5" />
                          {coupon.vendor?.storeName || "Store Exclusive"}
                        </span>
                      )}

                      {coupon.expiresAt && (
                        <span className="text-[10px] text-secondary flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Exp: {new Date(coupon.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Discount Value Headline */}
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-primary group-hover:text-highlight transition-colors">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}% OFF`
                          : `${formatCurrency(coupon.discountValue)} OFF`}
                      </h2>
                      <p className="text-xs text-secondary mt-1">
                        {coupon.minPurchase
                          ? `Minimum purchase of ${formatCurrency(Number(coupon.minPurchase))} required`
                          : "No minimum purchase required"}
                      </p>
                    </div>

                    {/* Code copy block */}
                    <div className="p-3 bg-muted/60 border border-border/80 rounded-2xl flex items-center justify-between">
                      <span className="font-mono font-extrabold text-sm text-primary tracking-widest">
                        {coupon.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(coupon.code)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-primary hover:text-white border border-border text-primary font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Bottom Footer */}
                  <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs text-secondary">
                    <span>{coupon.usedCount} redemptions so far</span>
                    <Link
                      href="/cart"
                      className="font-bold text-primary hover:text-highlight flex items-center gap-1 transition-colors"
                    >
                      <span>Shop Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
