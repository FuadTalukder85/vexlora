"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home, SlidersHorizontal } from "lucide-react";
import { useProductSearch } from "@/hooks/useProductSearch";
import { ProductSearchParams } from "@/types/product";
import { ProductFiltersSidebar } from "@/components/products/ProductFiltersSidebar";
import { ProductSortAndControls } from "@/components/products/ProductSortAndControls";
import { ProductGrid } from "@/components/products/ProductGrid";

function ProductListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);

  // Extract filters from URL query params
  const currentParams: ProductSearchParams = React.useMemo(() => {
    return {
      q: searchParams.get("q") || searchParams.get("searchTerm") || undefined,
      category: searchParams.get("category") || searchParams.get("categoryId") || undefined,
      brand: searchParams.get("brand") || undefined,
      minPrice: searchParams.get("minPrice") || undefined,
      maxPrice: searchParams.get("maxPrice") || undefined,
      minRating: searchParams.get("minRating") || undefined,
      inStock: searchParams.get("inStock") || undefined,
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
      limit: 16,
    };
  }, [searchParams]);

  // React Query Infinite Cursor Search
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useProductSearch(currentParams);

  // Flatten all cursor pages
  const products = React.useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data || []);
  }, [data]);

  const totalProducts = data?.pages?.[0]?.meta?.total ?? products.length;

  // Update URL search parameters
  const handleFilterChange = (newParams: Partial<ProductSearchParams>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    router.push(`/products?${params.toString()}`);
  };

  const handleClearAll = () => {
    router.push("/products");
  };

  const activeKeyword = currentParams.q || currentParams.searchTerm;

  return (
    <div className="w-full min-h-screen bg-muted/50 py-6 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-6">
      {/* 1. Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-secondary font-medium">
        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-secondary/60" />
        <Link href="/products" className="hover:text-primary transition-colors">
          Products
        </Link>
        {activeKeyword && (
          <>
            <ChevronRight className="w-3 h-3 text-secondary/60" />
            <span className="text-primary font-bold truncate max-w-xs">
              Search: &ldquo;{activeKeyword}&rdquo;
            </span>
          </>
        )}
      </nav>

      {/* 2. Main Search & Filter Grid Layout */}
      <div className="w-full flex items-start gap-8">
        {/* Left: Faceted Sidebar Filter */}
        <ProductFiltersSidebar
          searchParams={currentParams}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
          isOpenMobile={isMobileFiltersOpen}
          onCloseMobile={() => setIsMobileFiltersOpen(false)}
        />

        {/* Right: Results, Controls & Product Grid */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Top Controls: Sort, View Toggle, Active Chips */}
          <ProductSortAndControls
            searchParams={currentParams}
            totalProducts={totalProducts}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
            onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
          />

          {/* Product Results */}
          <ProductGrid
            products={products}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            onLoadMore={() => fetchNextPage()}
            viewMode={viewMode}
            onClearFilters={handleClearAll}
            searchQuery={activeKeyword}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="w-full min-h-[60vh] flex items-center justify-center text-xs text-secondary">
          Loading Vexlora marketplace products...
        </div>
      }
    >
      <ProductListingContent />
    </React.Suspense>
  );
}
