import * as React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";

export function CheckoutEmptyState() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-muted/50">
      <div className="h-24 w-24 rounded-3xl bg-muted flex items-center justify-center mb-5 text-primary">
        <ShoppingBag className="h-12 w-12" />
      </div>
      <h1 className="text-2xl font-bold text-primary">No Items Selected for Checkout</h1>
      <p className="text-xs sm:text-sm text-secondary mt-1 max-w-sm">
        Please select the items you wish to purchase from your shopping cart first.
      </p>
      <Link
        href="/cart"
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all shadow-sm"
      >
        <span>Return to Cart</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
