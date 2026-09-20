"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, Home, ChevronRight, ShoppingCart, Trash2, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";
import { ProductCard } from "@/components/ui/ProductCard";
import { WishlistEmptyState } from "./components/WishlistEmptyState";

export default function WishlistPage() {
  const { user } = useAuthStore();
  const items = useWishlistStore((s) => s.items);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);

  const [isMounted, setIsMounted] = React.useState(false);
  const [isAddingAll, setIsAddingAll] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    fetchWishlist();
  }, [fetchWishlist]);

  const handleAddAllToCart = async () => {
    const availableItems = items.filter((i) => i.inStock !== false);
    if (availableItems.length === 0) {
      toast.info("No in-stock items available to add.");
      return;
    }

    setIsAddingAll(true);
    try {
      for (const item of availableItems) {
        await addItem({
          id: item.productId,
          productId: item.productId,
          vendorId: "vendor-1",
          vendorName: item.vendorName || "Vexlora Merchant",
          title: item.title,
          slug: item.slug || item.productId,
          price: item.price,
          image: item.image || "/images/placeholder-product.png",
        });
      }
      toast.success(`Added ${availableItems.length} items to your cart!`);
      setCartDrawerOpen(true);
    } catch {
      toast.error("Failed to add all items to cart.");
    } finally {
      setIsAddingAll(false);
    }
  };

  const handleClearAll = async () => {
    if (items.length === 0) return;
    try {
      await clearWishlist();
      toast.info("Wishlist cleared.");
    } catch {
      toast.error("Failed to clear wishlist.");
    }
  };

  if (!isMounted) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center text-xs text-secondary animate-pulse">
        Loading your wishlist...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-6 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-6">
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-secondary font-medium">
        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-primary font-bold">Wishlist</span>
      </nav>

      {/* 2. Page Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <Heart className="w-5 h-5 fill-rose-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-primary tracking-tight">
              My Saved Wishlist
            </h1>
            <p className="text-xs text-secondary">
              {items.length} {items.length === 1 ? "item saved" : "items saved"}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:text-rose-600 text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>

            <button
              type="button"
              onClick={handleAddAllToCart}
              disabled={isAddingAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isAddingAll ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShoppingCart className="w-3.5 h-3.5" />
              )}
              <span>Add All to Cart</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Guest Sync Callout (if not logged in) */}
      {!user && items.length > 0 && (
        <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 text-xs">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span>
              Sign in to sync your wishlist across all your mobile and desktop devices.
            </span>
          </div>
          <Link
            href="/login"
            className="text-primary font-black underline underline-offset-2 hover:opacity-80 shrink-0"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* 4. Wishlist Grid or Empty State */}
      {items.length === 0 ? (
        <WishlistEmptyState />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {items.map((item) => {
            const hasDiscount =
              item.originalPrice && item.originalPrice > item.price;
            const discountTag = hasDiscount
              ? `${Math.round(
                  ((item.originalPrice! - item.price) / item.originalPrice!) * 100
                )}% OFF`
              : undefined;

            return (
              <ProductCard
                key={item.productId}
                id={item.productId}
                slug={item.slug || item.productId}
                name={item.title}
                price={item.price}
                originalPrice={item.originalPrice}
                vendor={item.vendorName || "Vexlora"}
                rating={item.rating || 0}
                reviews={item.reviews || 0}
                discount={discountTag}
                image={item.image || "/images/placeholder-product.png"}
              />
            );
          })}
        </div>
      )}

      {/* 5. Trust Footnote */}
      {items.length > 0 && (
        <div className="pt-6 border-t border-slate-200/80 flex items-center justify-center gap-6 text-xs text-secondary">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Authentic Products</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Automatic Price Drop Alerts</span>
          </div>
        </div>
      )}
    </div>
  );
}
