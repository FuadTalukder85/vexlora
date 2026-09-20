"use client";

import * as React from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { useRelatedProducts } from "@/hooks/useProductDetails";
import { Sparkles } from "lucide-react";

interface RelatedProductsProps {
  categoryId?: string | null;
  currentProductId: string;
}

export function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const { data: relatedProducts = [], isLoading } = useRelatedProducts(
    categoryId,
    currentProductId
  );

  if (!isLoading && relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-highlight/10 text-highlight flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-primary tracking-tight">
              Recommended Products
            </h3>
            <p className="text-xs text-secondary">
              Customers who viewed this item also explored these popular picks
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
              <div className="w-full h-48 bg-slate-100 rounded-xl" />
              <div className="h-4 w-3/4 bg-slate-100 rounded" />
              <div className="h-4 w-1/2 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {relatedProducts.slice(0, 4).map((p) => {
            const hasDiscount =
              p.discountPrice && Number(p.discountPrice) < Number(p.basePrice);
            const discountTag = hasDiscount
              ? `${Math.round(
                  ((Number(p.basePrice) - Number(p.discountPrice)) /
                    Number(p.basePrice)) *
                    100
                )}% OFF`
              : undefined;

            return (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.title}
                price={
                  p.discountPrice ? Number(p.discountPrice) : Number(p.basePrice)
                }
                originalPrice={hasDiscount ? Number(p.basePrice) : undefined}
                vendor={p.vendor?.storeName || p.brand || "Vexlora"}
                rating={Number(p.ratingAvg) || 0}
                reviews={p.ratingCount || 0}
                discount={discountTag}
                image={p.images?.[0] || "/images/placeholder-product.png"}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
