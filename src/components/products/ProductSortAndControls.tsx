"use client";

import * as React from "react";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { ProductSearchParams } from "@/types/product";

interface ProductSortAndControlsProps {
  searchParams: ProductSearchParams;
  totalProducts?: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onFilterChange: (newParams: Partial<ProductSearchParams>) => void;
  onClearAll: () => void;
  onOpenMobileFilters: () => void;
}

const SORT_OPTIONS = [
  { label: "Featured & Best Match", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Price: Low to High", sortBy: "basePrice", sortOrder: "asc" },
  { label: "Price: High to Low", sortBy: "basePrice", sortOrder: "desc" },
  { label: "Top Customer Rated", sortBy: "ratingAvg", sortOrder: "desc" },
  { label: "Newest Arrivals", sortBy: "createdAt", sortOrder: "desc" },
];

export function ProductSortAndControls({
  searchParams,
  totalProducts,
  viewMode,
  onViewModeChange,
  onFilterChange,
  onClearAll,
  onOpenMobileFilters,
}: ProductSortAndControlsProps) {
  const currentSortKey = `${searchParams.sortBy || "createdAt"}:${searchParams.sortOrder || "desc"}`;

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split(":");
    onFilterChange({
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
    });
  };

  // Active filters list
  const activeFilters: Array<{ key: string; label: string; onRemove: () => void }> = [];

  if (searchParams.q || searchParams.searchTerm) {
    activeFilters.push({
      key: "q",
      label: `"${searchParams.q || searchParams.searchTerm}"`,
      onRemove: () => onFilterChange({ q: undefined, searchTerm: undefined }),
    });
  }

  if (searchParams.category && searchParams.category !== "all") {
    activeFilters.push({
      key: "category",
      label: `Category: ${searchParams.category}`,
      onRemove: () => onFilterChange({ category: undefined, categoryId: undefined }),
    });
  }

  if (searchParams.brand) {
    activeFilters.push({
      key: "brand",
      label: `Brand: ${searchParams.brand}`,
      onRemove: () => onFilterChange({ brand: undefined }),
    });
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    activeFilters.push({
      key: "price",
      label: `Price: $${searchParams.minPrice || "0"} - $${searchParams.maxPrice || "Any"}`,
      onRemove: () => onFilterChange({ minPrice: undefined, maxPrice: undefined }),
    });
  }

  if (searchParams.minRating) {
    activeFilters.push({
      key: "rating",
      label: `${searchParams.minRating}★ & Up`,
      onRemove: () => onFilterChange({ minRating: undefined }),
    });
  }

  if (searchParams.inStock) {
    activeFilters.push({
      key: "stock",
      label: "In Stock Only",
      onRemove: () => onFilterChange({ inStock: undefined }),
    });
  }

  return (
    <div className="w-full space-y-4">
      {/* Top Bar: Headline, Mobile Filter Trigger, Sort, View Mode */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Headline & Total */}
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-primary tracking-tight">
            {searchParams.q || searchParams.searchTerm ? (
              <>
                Results for <span className="text-highlight">&ldquo;{searchParams.q || searchParams.searchTerm}&rdquo;</span>
              </>
            ) : searchParams.category && searchParams.category !== "all" ? (
              <span className="capitalize">{searchParams.category} Catalog</span>
            ) : (
              "All Marketplace Products"
            )}
          </h1>
          {totalProducts !== undefined && (
            <p className="text-xs text-secondary mt-0.5 font-medium">
              Over {totalProducts.toLocaleString()} verified products available
            </p>
          )}
        </div>

        {/* Right Controls */}
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 flex-wrap">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeFilters.length > 0 && (
              <span className="h-4 w-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-semibold text-secondary whitespace-nowrap">
              Sort by:
            </span>
            <select
              value={currentSortKey}
              onChange={handleSortChange}
              className="bg-muted border border-border rounded-xl px-3 py-2 text-xs font-bold text-primary focus:outline-none focus:border-primary focus:bg-white cursor-pointer transition-all"
            >
              {SORT_OPTIONS.map((opt, idx) => (
                <option key={idx} value={`${opt.sortBy}:${opt.sortOrder}`}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Grid / List View Switcher */}
          <div className="flex items-center bg-muted p-1 rounded-xl border border-border/60">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-secondary hover:text-primary"
              }`}
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-primary shadow-xs font-bold"
                  : "text-secondary hover:text-primary"
              }`}
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-secondary text-[11px] uppercase tracking-wider">
            Active:
          </span>
          {activeFilters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-border text-xs font-semibold text-primary shadow-2xs"
            >
              <span>{filter.label}</span>
              <button
                type="button"
                onClick={filter.onRemove}
                className="hover:text-highlight transition-colors cursor-pointer"
                aria-label={`Remove filter ${filter.label}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-bold text-highlight hover:underline cursor-pointer ml-1"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
