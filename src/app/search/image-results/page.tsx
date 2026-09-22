"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  X,
  Sparkles,
  Search,
  ArrowLeft,
  SlidersHorizontal,
  ChevronDown,
  RefreshCw,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";
import { useImageSearchStore } from "@/stores/imageSearch.store";
import { ProductCard } from "@/components/ui/ProductCard";
import { ImageSearchDropdown } from "@/components/search/ImageSearchDropdown";

export default function ImageSearchResultsPage() {
  const router = useRouter();
  const {
    activeQueryPreview,
    activeResults,
    isSearching,
    clearActiveSearch,
  } = useImageSearchStore();

  const [sortBy, setSortBy] = React.useState<"match" | "price-asc" | "price-desc" | "rating">("match");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  // Extract unique categories from active results
  const categories = React.useMemo(() => {
    const map = new Map<string, string>();
    activeResults.forEach((p) => {
      if (p.category?.id && p.category?.name) {
        map.set(p.category.id, p.category.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [activeResults]);

  // Filter & Sort
  const filteredAndSortedProducts = React.useMemo(() => {
    let list = [...activeResults];

    // Filter by Category
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category?.id === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "match":
        list.sort((a, b) => (b.similarityPercentage || 0) - (a.similarityPercentage || 0));
        break;
      case "price-asc":
        list.sort((a, b) => {
          const priceA = Number(a.discountPrice || a.basePrice || 0);
          const priceB = Number(b.discountPrice || b.basePrice || 0);
          return priceA - priceB;
        });
        break;
      case "price-desc":
        list.sort((a, b) => {
          const priceA = Number(a.discountPrice || a.basePrice || 0);
          const priceB = Number(b.discountPrice || b.basePrice || 0);
          return priceB - priceA;
        });
        break;
      case "rating":
        list.sort((a, b) => Number(b.ratingAvg || 0) - Number(a.ratingAvg || 0));
        break;
    }

    return list;
  }, [activeResults, selectedCategory, sortBy]);

  const handleClearAndReturn = () => {
    clearActiveSearch();
    router.push("/products");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-16">
      {/* Top Banner / Breadcrumb Bar */}
      <div className="bg-white border-b border-border py-4 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClearAndReturn}
              className="h-9 w-9 rounded-xl border border-border bg-white hover:bg-muted text-primary flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Back to all products"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Visual Match
                </span>
                <span className="text-xs text-secondary">
                  {filteredAndSortedProducts.length} similar item{filteredAndSortedProducts.length === 1 ? "" : "s"} found
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight mt-0.5">
                Image Search Results
              </h1>
            </div>
          </div>

          {/* New Image Search Trigger */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-secondary hidden sm:inline">Try another photo:</span>
            <div className="inline-flex items-center rounded-2xl border border-border bg-muted/60 p-1">
              <span className="pl-3 pr-2 text-xs font-semibold text-primary">Upload new image</span>
              <ImageSearchDropdown variant="desktop" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-6">
        {/* ACTIVE QUERY BANNER */}
        {activeQueryPreview && (
          <div className="bg-white rounded-3xl border border-border p-4 sm:p-5 shadow-xs mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-primary/20 bg-muted shrink-0 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeQueryPreview}
                  alt="Searching with query"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                    Searching with Image
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-primary mt-0.5">
                  Visual Vector Similarity Match
                </h3>
                <p className="text-xs text-secondary mt-0.5">
                  Products ranked by color balance, contours, and visual textures
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearAndReturn}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-muted/50 hover:bg-red-50 hover:border-red-200 hover:text-red-700 text-xs font-semibold text-primary transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Clear image & return to catalog</span>
            </button>
          </div>
        )}

        {/* FILTERS & CONTROLS ROW */}
        {activeResults.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white rounded-2xl border border-border p-3">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-primary text-white shadow-xs"
                    : "bg-muted text-secondary hover:text-primary hover:bg-muted/80"
                }`}
              >
                All Categories ({activeResults.length})
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-primary text-white shadow-xs"
                      : "bg-muted text-secondary hover:text-primary hover:bg-muted/80"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-medium text-secondary hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-muted text-xs font-bold text-primary pl-3 pr-8 py-1.5 rounded-xl border border-border outline-none cursor-pointer hover:bg-muted/80 appearance-none"
                >
                  <option value="match">Highest Visual Match</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-secondary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* RESULTS GRID */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
            {filteredAndSortedProducts.map((product) => {
              const matchPercent = product.similarityPercentage || Math.round((product.similarityScore || 0) * 100);

              return (
                <div key={product.id} className="relative group">
                  {/* Visual Match Badge Overlay */}
                  {matchPercent > 0 && (
                    <div className="absolute top-2 left-2 z-20 bg-primary/90 backdrop-blur-xs text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 pointer-events-none">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{matchPercent}% Match</span>
                    </div>
                  )}

                  <ProductCard
                    id={product.id}
                    slug={product.slug}
                    name={product.title}
                    price={Number(product.discountPrice || product.basePrice || 0)}
                    originalPrice={product.discountPrice ? Number(product.basePrice) : undefined}
                    vendor={product.vendor?.storeName || "Vexlora Vendor"}
                    rating={Number(product.ratingAvg || 0)}
                    reviews={product.ratingCount || 0}
                    image={product.images && product.images[0] ? product.images[0] : "/images/placeholder.jpg"}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white rounded-3xl border border-border p-8 sm:p-16 text-center space-y-5 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto text-secondary">
              <Search className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-primary tracking-tight">
                No Visually Similar Products Found
              </h3>
              <p className="text-xs text-secondary max-w-md mx-auto">
                We couldn&apos;t find an exact visual match in the current catalog for this photo. Try uploading a clearer photo with good lighting or browse our categories.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/products"
                className="px-5 py-2.5 rounded-xl bg-primary hover:opacity-90 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Browse All Products
              </Link>
              <button
                type="button"
                onClick={handleClearAndReturn}
                className="px-5 py-2.5 rounded-xl border border-border bg-white hover:bg-muted text-primary text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
