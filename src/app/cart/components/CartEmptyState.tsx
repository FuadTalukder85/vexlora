import * as React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

export function CartEmptyState() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-muted/50">
      <div className="h-28 w-28 rounded-3xl bg-muted flex items-center justify-center mb-6 text-primary shadow-sm">
        <ShoppingBag className="h-14 w-14" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-primary">
        Your Shopping Cart is Empty
      </h1>
      <p className="text-sm text-secondary mt-2 max-w-md">
        Explore top products from verified vendors across the marketplace and add them to your cart.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-md active:scale-[0.98]"
      >
        <span>Explore Products</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
