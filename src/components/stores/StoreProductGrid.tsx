"use client";

import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/ui/ProductCard";
import { Search, Package, Loader2 } from "lucide-react";

interface StoreProductGridProps {
  storeName: string;
  products: Product[];
  loading: boolean;
  searchQuery: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

export const StoreProductGrid: React.FC<StoreProductGridProps> = ({
  storeName,
  products,
  loading,
  searchQuery,
  sortBy,
  sortOrder,
  onSearchChange,
  onSortChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Search & Sort Filter Bar */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Search within ${storeName}...`}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-xl text-xs text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-semibold text-secondary">
            <strong className="text-primary">{products.length}</strong> items in store
          </span>

          <select
            value={`${sortBy}_${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split("_");
              onSortChange(sb, so as "asc" | "desc");
            }}
            className="px-3 py-2 bg-muted border border-border rounded-xl text-xs font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="createdAt_desc">Newest Arrivals</option>
            <option value="basePrice_asc">Price: Low to High</option>
            <option value="basePrice_desc">Price: High to Low</option>
            <option value="ratingAvg_desc">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Product Catalog Grid */}
      {loading ? (
        <div className="py-24 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-bold text-secondary">Loading store catalog...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center bg-card rounded-3xl border border-border p-8">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-bold text-primary">No matching products found</h3>
          <p className="text-xs text-secondary mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No items matching "${searchQuery}" in this store.`
              : "This merchant currently has no active products listed."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.map((prod) => (
            <ProductCard
              key={prod.id}
              id={prod.id}
              slug={prod.slug}
              name={prod.title}
              price={Number(prod.discountPrice ?? prod.basePrice)}
              originalPrice={prod.discountPrice ? Number(prod.basePrice) : undefined}
              vendor={storeName}
              rating={Number(prod.ratingAvg || 5)}
              reviews={prod.ratingCount || 0}
              discount={
                prod.discountPrice
                  ? `${Math.round(((Number(prod.basePrice) - Number(prod.discountPrice)) / Number(prod.basePrice)) * 100)}% OFF`
                  : undefined
              }
              image={prod.images?.[0] || "/images/placeholder.png"}
            />
          ))}
        </div>
      )}
    </div>
  );
};
