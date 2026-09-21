"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Clock, Sparkles, ShoppingBag, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { getActiveDeals, Deal } from "@/lib/api/deals";
import { useCartStore } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

// Countdown timer component for deals
function DealCountdown({ endAt }: { endAt: string }) {
  const [timeLeft, setTimeLeft] = React.useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  React.useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(endAt).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endAt]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs font-bold text-highlight">
      <Clock className="w-3.5 h-3.5" />
      <span>
        Ends in:{" "}
        <span className="bg-highlight/10 px-1.5 py-0.5 rounded text-highlight font-mono">
          {String(timeLeft.hours).padStart(2, "0")}h {String(timeLeft.minutes).padStart(2, "0")}m {String(timeLeft.seconds).padStart(2, "0")}s
        </span>
      </span>
    </div>
  );
}

export default function DealsPage() {
  const [deals, setDeals] = React.useState<Deal[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);

  React.useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      try {
        const res = await getActiveDeals({ limit: 50 });
        if (res?.data) {
          setDeals(res.data);
        }
      } catch (error) {
        console.error("Failed to load deals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleAddToCart = (deal: Deal, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const p = deal.product;
    if (!p) return;

    const img = p.images && p.images.length > 0 ? p.images[0] : "/images/placeholder-product.png";

    addItem(
      {
        id: deal.variantId ? `${p.id}_${deal.variantId}` : p.id,
        productId: p.id,
        variantId: deal.variantId || null,
        vendorId: p.vendorId || "vendor-1",
        vendorName: p.vendor?.storeName || "Verified Merchant",
        title: deal.title || p.title,
        slug: p.slug,
        price: Number(deal.dealPrice),
        image: img,
      },
      1
    );

    toast.success(`Added "${deal.title || p.title}" to cart at special deal price!`);
    setCartDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-muted/40 py-8 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-8">
      {/* 1. Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-primary text-white p-6 sm:p-10 lg:p-12 shadow-lg border border-primary/20">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-highlight/20 border border-highlight/30 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
            <Flame className="w-4 h-4 text-highlight" />
            <span>Limited-Time Flash Deals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Today&apos;s Hot Deals &amp; Steals
          </h1>
          <p className="text-secondary/80 text-sm sm:text-base font-medium">
            Grab top-rated verified products from multi-vendor merchants at exclusive flash discount prices before time runs out.
          </p>
        </div>
      </div>

      {/* 2. Deals Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-border p-5 space-y-4 animate-pulse">
              <div className="w-full aspect-square bg-muted rounded-xl" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : deals.length === 0 ? (
        <div className="bg-white rounded-3xl border border-border p-12 text-center space-y-4 shadow-sm max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-highlight/10 text-highlight flex items-center justify-center mx-auto">
            <Flame className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-primary">No Active Flash Deals Right Now</h2>
          <p className="text-xs text-secondary">
            Check back soon! New merchant promotions and daily hot deals are posted regularly.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow hover:bg-primary/90 transition-colors"
          >
            <span>Browse All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deals.map((deal) => {
            const p = deal.product;
            if (!p) return null;

            const img = p.images && p.images.length > 0 ? p.images[0] : "/images/placeholder-product.png";
            const origPrice = Number(deal.originalPrice);
            const dealPrice = Number(deal.dealPrice);
            const discountPercent =
              origPrice > dealPrice ? Math.round(((origPrice - dealPrice) / origPrice) * 100) : 0;

            return (
              <div
                key={deal.id}
                className="group relative bg-white rounded-2xl border border-border p-4 flex flex-col justify-between hover:shadow-xl hover:border-border transition-all duration-300 overflow-hidden"
              >
                {/* Top Badges */}
                <div className="relative w-full aspect-square bg-muted/30 rounded-xl overflow-hidden mb-4 p-3 flex items-center justify-center">
                  <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
                    <span className="inline-flex items-center gap-1 bg-highlight text-white font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      {discountPercent}% OFF
                    </span>
                    {deal.title && (
                      <span className="bg-primary text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs truncate max-w-[140px]">
                        {deal.title}
                      </span>
                    )}
                  </div>

                  <Link href={`/products/${p.slug}`} className="relative w-full h-full block">
                    <Image
                      src={img}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>

                {/* Content Section */}
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    {p.vendor?.storeName && (
                      <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1">
                        {p.vendor.storeName}
                      </span>
                    )}
                    <Link
                      href={`/products/${p.slug}`}
                      className="font-bold text-primary text-sm line-clamp-2 hover:text-primary/80 transition-colors leading-snug"
                    >
                      {p.title}
                    </Link>
                  </div>

                  {/* Pricing */}
                  <div className="pt-2 border-t border-border/60">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-primary">
                        {formatCurrency(dealPrice)}
                      </span>
                      {origPrice > dealPrice && (
                        <span className="text-xs text-secondary line-through font-semibold">
                          {formatCurrency(origPrice)}
                        </span>
                      )}
                    </div>

                    {/* Stock Quota Gauge */}
                    {deal.quantityLimit && deal.quantityLimit > 0 && (
                      <div className="mt-2.5 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-secondary">
                          <span>Claimed: {deal.soldPercentage}%</span>
                          <span>
                            {deal.soldCount} / {deal.quantityLimit} units
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-highlight h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(5, deal.soldPercentage)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Countdown */}
                    <div className="mt-3">
                      <DealCountdown endAt={deal.endAt} />
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(deal, e)}
                    className="w-full mt-3 bg-primary hover:bg-primary/90 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Claim Deal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
