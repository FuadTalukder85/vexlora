"use client";

import * as React from "react";
import { Search, Loader2, Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductListCard } from "./ProductListCard";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  onLoadMore: () => void;
  viewMode: "grid" | "list";
  onClearFilters: () => void;
  searchQuery?: string;
}

export function ProductGrid({
  products,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  viewMode,
  onClearFilters,
  searchQuery,
}: ProductGridProps) {
  // 1. Initial Loading Skeleton
  if (isLoading && products.length === 0) {
    return (
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5"
            : "space-y-4"
        }
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-border p-4 space-y-3 animate-pulse shadow-xs"
          >
            <div className="w-full h-48 bg-muted rounded-xl" />
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-5 w-24 bg-muted rounded pt-2" />
          </div>
        ))}
      </div>
    );
  }

  // 2. Empty State (Zero Results)
  if (!isLoading && products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-border p-8 sm:p-14 text-center space-y-5 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto text-secondary">
          <Search className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="text-lg sm:text-xl font-extrabold text-primary tracking-tight">
            {searchQuery ? (
              <>No matching products found for &ldquo;{searchQuery}&rdquo;</>
            ) : (
              "No products match your active filters"
            )}
          </h3>
          <p className="text-xs text-secondary leading-relaxed">
            Try checking for spelling errors, using more general keywords, or resetting your filter criteria to discover more products.
          </p>
        </div>

        {/* Suggestions Box */}
        <div className="bg-muted/80 border border-border/60 rounded-2xl p-4 max-w-sm mx-auto text-left space-y-1.5 text-xs text-secondary">
          <span className="font-bold text-primary block">Search Recommendations:</span>
          <p>• Try keywords like &ldquo;Keyboard&rdquo;, &ldquo;Wireless&rdquo;, &ldquo;Asus&rdquo;</p>
          <p>• Broaden your selected price range</p>
          <p>• Uncheck specific brands or ratings</p>
        </div>

        <div>
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:opacity-90 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. Render Product Cards (Grid vs List)
  return (
    <div className="space-y-8">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
          {products.map((product) => {
            const numPrice = Number(product.discountPrice || product.basePrice || 0);
            const origPrice = product.discountPrice ? Number(product.basePrice) : undefined;
            const primaryImage =
              product.images && product.images.length > 0
                ? product.images[0]
                : "/images/placeholder.png";

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-border p-4"
              >
                <ProductCard
                  id={product.id}
                  name={product.title}
                  price={numPrice}
                  originalPrice={origPrice}
                  vendor={product.vendor?.storeName || "Verified Vendor"}
                  rating={Number(product.ratingAvg || 4.8)}
                  reviews={product.ratingCount || 120}
                  image={primaryImage}
                  discount={
                    origPrice && origPrice > numPrice
                      ? `${Math.round(((origPrice - numPrice) / origPrice) * 100)}% OFF`
                      : undefined
                  }
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductListCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* 4. Amazon/Lazada-Style Cursor Stream Load More */}
      {hasNextPage ? (
        <div className="text-center pt-4 pb-6">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white border-2 border-primary/20 hover:border-primary text-primary hover:bg-primary hover:text-white text-xs font-black transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading Next Products...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Load More Products</span>
              </>
            )}
          </button>
        </div>
      ) : (
        products.length > 0 && (
          <div className="text-center py-6 border-t border-border/60">
            <p className="text-xs font-semibold text-secondary">
              You&apos;ve viewed all {products.length.toLocaleString()} matching products
            </p>
          </div>
        )
      )}
    </div>
  );
}
