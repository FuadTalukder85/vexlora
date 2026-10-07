"use client";

import React from "react";
import Link from "next/link";
import { useCompareStore } from "@/stores/compare.store";
import { useCartStore } from "@/stores/cart.store";
import { Product } from "@/types/product";
import { ArrowLeftRight, AlertCircle, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { CompareTableMatrix } from "@/components/compare/CompareTableMatrix";

export default function ComparePage() {
  const { items, removeFromCompare, clearCompare } = useCompareStore();
  const { addItem } = useCartStore();

  const handleAddToCart = async (product: Product) => {
    try {
      const price = Number(product.discountPrice ?? product.basePrice);
      await addItem({
        id: product.id,
        productId: product.id,
        vendorId: product.vendorId,
        vendorName: product.vendor?.storeName || "Vendor Store",
        title: product.title,
        slug: product.slug,
        price,
        image: product.images?.[0] || null,
      });
      toast.success(`Added "${product.title}" to cart`);
    } catch {
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Top Navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-highlight/10 text-highlight">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                Product Comparison
              </h1>
              <p className="text-xs sm:text-sm text-secondary">
                Compare features, pricing, and ratings across up to 4 selected items
              </p>
            </div>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCompare}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-secondary hover:text-highlight bg-muted hover:bg-highlight/10 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Clear All Items
          </button>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="py-24 text-center rounded-3xl bg-card border border-border p-6 shadow-xs">
          <AlertCircle className="w-14 h-14 text-muted-foreground mx-auto mb-3" />
          <h2 className="text-xl font-bold text-primary">Your comparison list is empty</h2>
          <p className="text-sm text-secondary mt-1 max-w-md mx-auto">
            Explore the marketplace and click the &quot;Compare&quot; button on any product card to see side-by-side specs here.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-md"
          >
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
          <CompareTableMatrix
            items={items}
            onRemoveItem={removeFromCompare}
            onAddToCart={handleAddToCart}
          />
        </div>
      )}
    </div>
  );
}
