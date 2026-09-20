import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Flame } from "lucide-react";

export function WishlistEmptyState() {
  return (
    <div className="w-full min-h-[55vh] flex flex-col items-center justify-center p-8 text-center space-y-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
      <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100/80 shadow-2xs">
        <Heart className="w-10 h-10 fill-rose-100 text-rose-500" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h2 className="text-xl sm:text-2xl font-black text-primary tracking-tight">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs sm:text-sm text-secondary leading-relaxed">
          Save your favorite products while you explore. Keep track of price drops and order whenever you&apos;re ready!
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/products"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-xs transition-all hover:scale-102"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Explore Products</span>
        </Link>
        <Link
          href="/products?sortBy=ratingAvg"
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Top Rated Deals</span>
        </Link>
      </div>
    </div>
  );
}
