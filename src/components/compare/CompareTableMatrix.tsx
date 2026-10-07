"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { X, Star, ShoppingBag, Check } from "lucide-react";

interface CompareTableMatrixProps {
  items: Product[];
  onRemoveItem: (id: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: () => void;
}

export const CompareTableMatrix: React.FC<CompareTableMatrixProps> = ({
  items,
  onRemoveItem,
  onAddToCart,
  onSelectProduct,
}) => {
  return (
    <div className="overflow-x-auto scrollbar-thin p-4 sm:p-6">
      <div
        className="grid gap-4 sm:gap-6 min-w-[720px]"
        style={{
          gridTemplateColumns: `180px repeat(${items.length}, minmax(220px, 1fr))`,
        }}
      >
        {/* Product Card Row */}
        <div className="font-bold text-xs uppercase tracking-wider text-secondary flex items-end pb-4">
          Products ({items.length}/4)
        </div>
        {items.map((item) => (
          <div
            key={`matrix-card-${item.id}`}
            className="relative p-4 rounded-2xl bg-muted/60 border border-border flex flex-col group hover:border-primary/30 transition-all"
          >
            <button
              onClick={() => onRemoveItem(item.id)}
              className="absolute top-2 right-2 p-1.5 text-secondary hover:text-highlight bg-card rounded-full shadow-xs hover:bg-highlight/10 transition-all cursor-pointer"
              title="Remove from comparison"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-card mb-3 border border-border">
              <Image
                src={item.images?.[0] || "/images/placeholder.png"}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="220px"
              />
            </div>

            <Link
              href={`/products/${item.slug}`}
              onClick={onSelectProduct}
              className="text-sm font-bold text-primary line-clamp-2 hover:text-highlight transition-colors mb-3"
            >
              {item.title}
            </Link>

            <button
              onClick={() => onAddToCart(item)}
              className="w-full py-2.5 px-3 bg-primary hover:bg-highlight text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 mt-auto"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
          </div>
        ))}

        {/* Price Row */}
        <div className="py-3.5 text-xs font-bold uppercase tracking-wider text-secondary border-t border-border flex items-center">
          Price
        </div>
        {items.map((item) => {
          const base = Number(item.basePrice);
          const discount = item.discountPrice ? Number(item.discountPrice) : null;
          return (
            <div
              key={`matrix-price-${item.id}`}
              className="py-3.5 border-t border-border flex items-center gap-2"
            >
              <span className="text-base font-black text-primary">
                ${(discount ?? base).toFixed(2)}
              </span>
              {discount && discount < base && (
                <span className="text-xs text-secondary line-through">
                  ${base.toFixed(2)}
                </span>
              )}
            </div>
          );
        })}

        {/* Rating Row */}
        <div className="py-3.5 text-xs font-bold uppercase tracking-wider text-secondary border-t border-border flex items-center">
          Rating & Reviews
        </div>
        {items.map((item) => (
          <div
            key={`matrix-rating-${item.id}`}
            className="py-3.5 border-t border-border flex items-center gap-1.5"
          >
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-primary">
              {Number(item.ratingAvg || 0).toFixed(1)}
            </span>
            <span className="text-xs text-secondary">
              ({item.ratingCount || 0} reviews)
            </span>
          </div>
        ))}

        {/* Stock Status Row */}
        <div className="py-3.5 text-xs font-bold uppercase tracking-wider text-secondary border-t border-border flex items-center">
          Availability
        </div>
        {items.map((item) => {
          const inStock = item.totalStock > 0 && item.status === "ACTIVE";
          return (
            <div
              key={`matrix-stock-${item.id}`}
              className="py-3.5 border-t border-border flex items-center"
            >
              {inStock ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check className="w-3 h-3" /> In Stock ({item.totalStock})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                  Out of Stock
                </span>
              )}
            </div>
          );
        })}

        {/* Brand Row */}
        <div className="py-3.5 text-xs font-bold uppercase tracking-wider text-secondary border-t border-border flex items-center">
          Brand
        </div>
        {items.map((item) => (
          <div
            key={`matrix-brand-${item.id}`}
            className="py-3.5 border-t border-border text-xs font-semibold text-primary flex items-center"
          >
            {item.brand || "Independent"}
          </div>
        ))}

        {/* Vendor Store Row */}
        <div className="py-3.5 text-xs font-bold uppercase tracking-wider text-secondary border-t border-border flex items-center">
          Merchant / Store
        </div>
        {items.map((item) => (
          <div
            key={`matrix-vendor-${item.id}`}
            className="py-3.5 border-t border-border text-xs text-secondary flex items-center gap-2"
          >
            <span className="font-semibold text-primary">
              {item.vendor?.storeName || "Official Merchant"}
            </span>
          </div>
        ))}

        {/* Category Row */}
        <div className="py-3.5 text-xs font-bold uppercase tracking-wider text-secondary border-t border-border flex items-center">
          Category
        </div>
        {items.map((item) => (
          <div
            key={`matrix-category-${item.id}`}
            className="py-3.5 border-t border-border text-xs text-secondary flex items-center"
          >
            {item.category?.name || "General"}
          </div>
        ))}
      </div>
    </div>
  );
};
