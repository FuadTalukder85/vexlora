"use client";

import * as React from "react";
import { Star, RotateCcw, X, Check, ChevronDown, ChevronRight, SlidersHorizontal } from "lucide-react";
import { ProductSearchParams } from "@/types/product";

interface ProductFiltersSidebarProps {
  searchParams: ProductSearchParams;
  onFilterChange: (newParams: Partial<ProductSearchParams>) => void;
  onClearAll: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const CATEGORIES = [
  { id: "all", name: "All Categories" },
  { id: "electronics", name: "Electronics & Gadgets" },
  { id: "laptops-computers", name: "Laptops & Computers" },
  { id: "fashion-apparel", name: "Fashion & Apparel" },
  { id: "home-kitchen", name: "Home & Kitchen" },
  { id: "beauty-welness", name: "Beauty & Wellness" },
];

const PRICE_PRESETS = [
  { label: "Under $25", min: "", max: "25" },
  { label: "$25 to $50", min: "25", max: "50" },
  { label: "$50 to $100", min: "50", max: "100" },
  { label: "$100 to $200", min: "100", max: "200" },
  { label: "$200 & Above", min: "200", max: "" },
];

const BRANDS = [
  "ASUS",
  "Apple",
  "Samsung",
  "Sony",
  "Logitech",
  "Dell",
  "Lenovo",
  "Nike",
  "Anker",
];

export function ProductFiltersSidebar({
  searchParams,
  onFilterChange,
  onClearAll,
  isOpenMobile = false,
  onCloseMobile,
}: ProductFiltersSidebarProps) {
  const [minInput, setMinInput] = React.useState(searchParams.minPrice?.toString() || "");
  const [maxInput, setMaxInput] = React.useState(searchParams.maxPrice?.toString() || "");

  React.useEffect(() => {
    setMinInput(searchParams.minPrice?.toString() || "");
    setMaxInput(searchParams.maxPrice?.toString() || "");
  }, [searchParams.minPrice, searchParams.maxPrice]);

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      minPrice: minInput ? Number(minInput) : undefined,
      maxPrice: maxInput ? Number(maxInput) : undefined,
    });
  };

  const selectedCategory = searchParams.category || searchParams.categoryId || "all";
  const selectedBrand = searchParams.brand;
  const selectedMinRating = searchParams.minRating ? Number(searchParams.minRating) : undefined;

  const content = (
    <div className="space-y-6 text-xs text-primary">
      {/* Header / Clear All */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <span className="font-extrabold text-sm text-primary tracking-tight flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filter Products
        </span>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-semibold text-secondary hover:text-highlight transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-2.5">
        <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-primary">
          Category
        </h4>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === cat.id.toLowerCase() ||
              (cat.id === "all" && (!selectedCategory || selectedCategory === "all"));

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  onFilterChange({
                    category: cat.id === "all" ? undefined : cat.id,
                    categoryId: cat.id === "all" ? undefined : cat.id,
                  })
                }
                className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white font-bold"
                    : "text-secondary hover:bg-slate-100 hover:text-primary font-medium"
                }`}
              >
                <span>{cat.name}</span>
                {isSelected ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Price Range Filter */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-primary">
          Price Range
        </h4>

        {/* Presets */}
        <div className="space-y-1">
          {PRICE_PRESETS.map((preset, idx) => {
            const isPresetActive =
              searchParams.minPrice?.toString() === preset.min &&
              searchParams.maxPrice?.toString() === preset.max;

            return (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  onFilterChange({
                    minPrice: preset.min ? Number(preset.min) : undefined,
                    maxPrice: preset.max ? Number(preset.max) : undefined,
                  })
                }
                className={`w-full text-left py-1 px-2 rounded-md transition-colors cursor-pointer ${
                  isPresetActive
                    ? "text-primary font-bold bg-slate-100"
                    : "text-secondary hover:text-primary font-medium"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Custom Min / Max Form */}
        <form onSubmit={handlePriceApply} className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
            <input
              type="number"
              placeholder="Min"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-primary focus:outline-none focus:border-primary focus:bg-white"
            />
          </div>
          <span className="text-slate-300">-</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
            <input
              type="number"
              placeholder="Max"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-primary focus:outline-none focus:border-primary focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="h-8 px-3 rounded-lg bg-primary hover:opacity-90 text-white font-bold text-xs cursor-pointer transition-opacity"
          >
            Go
          </button>
        </form>
      </div>

      {/* 3. Customer Rating */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-primary">
          Customer Rating
        </h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((stars) => {
            const isRatingSelected = selectedMinRating === stars;

            return (
              <button
                key={stars}
                type="button"
                onClick={() =>
                  onFilterChange({
                    minRating: isRatingSelected ? undefined : stars,
                  })
                }
                className={`w-full flex items-center justify-between py-1 px-2 rounded-md transition-colors cursor-pointer ${
                  isRatingSelected ? "bg-amber-50 text-amber-900 font-bold" : "text-secondary hover:text-primary"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < stars ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-100"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs">& Up</span>
                </div>
                {isRatingSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Brand Filter */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-primary">
          Brand
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {BRANDS.map((brand) => {
            const isBrandSelected = selectedBrand?.toLowerCase() === brand.toLowerCase();

            return (
              <label
                key={brand}
                className="flex items-center gap-2.5 py-1 px-1.5 rounded-md hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={isBrandSelected}
                  onChange={() =>
                    onFilterChange({
                      brand: isBrandSelected ? undefined : brand,
                    })
                  }
                  className="w-3.5 h-3.5 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Availability Filter */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2.5 py-1.5 cursor-pointer text-xs font-bold text-primary">
          <input
            type="checkbox"
            checked={Boolean(searchParams.inStock)}
            onChange={(e) =>
              onFilterChange({
                inStock: e.target.checked ? "true" : undefined,
              })
            }
            className="w-3.5 h-3.5 rounded border-slate-300 text-primary focus:ring-primary"
          />
          <span>In Stock Items Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs h-fit sticky top-24">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <span className="font-extrabold text-base text-primary">Filters</span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-secondary hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
