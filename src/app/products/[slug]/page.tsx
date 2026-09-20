"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, Home, ArrowLeft, AlertCircle, ShoppingBag } from "lucide-react";
import { useProductDetails } from "@/hooks/useProductDetails";
import { ProductGallery } from "./components/ProductGallery";
import { ProductInfo } from "./components/ProductInfo";
import { ProductBuyBox } from "./components/ProductBuyBox";
import { ProductTabs } from "./components/ProductTabs";
import { RelatedProducts } from "./components/RelatedProducts";
import { MobileStickyBuyBar } from "./components/MobileStickyBuyBar";
import { ProductDetailSkeleton } from "./components/ProductDetailSkeleton";
import { ProductVariant } from "@/types/product";

export default function SingleProductPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : (rawSlug as string) || "";

  const { data: product, isLoading, isError } = useProductDetails(slug);

  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | null>(null);
  const [activeTab, setActiveTab] = React.useState<"overview" | "specs" | "reviews" | "shipping">("overview");

  // Select default variant when product is loaded
  React.useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      // Find first in-stock variant or default to first variant
      const defaultVar = product.variants.find((v) => v.stock > 0) || product.variants[0];
      setSelectedVariant(defaultVar);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  const handleScrollToReviews = () => {
    setActiveTab("reviews");
    const el = document.getElementById("product-tabs-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-primary">Product Not Found</h2>
        <p className="text-xs sm:text-sm text-secondary max-w-md">
          The item you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 bg-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <Link
            href="/products"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Products</span>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate discount badge
  const hasDiscount =
    product.discountPrice && Number(product.discountPrice) < Number(product.basePrice);
  const discountBadge = hasDiscount
    ? `${Math.round(
        ((Number(product.basePrice) - Number(product.discountPrice)) /
          Number(product.basePrice)) *
          100
      )}% OFF`
    : null;

  const isOutOfStock =
    (selectedVariant ? selectedVariant.stock : product.totalStock) <= 0;

  return (
    <div className="w-full min-h-screen bg-slate-50/50 py-6 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-8 pb-24 lg:pb-12">
      {/* 1. Breadcrumb Trail */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-secondary font-medium flex-wrap">
        <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
        <Link href="/products" className="hover:text-primary transition-colors">
          Products
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-primary transition-colors truncate max-w-xs"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
        <span className="text-primary font-bold truncate max-w-sm sm:max-w-md">
          {product.title}
        </span>
      </nav>

      {/* 2. Main Hero Product Section (Gallery + Info + Buy Box) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product Gallery (5 Columns) */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm sticky top-24">
          <ProductGallery
            images={product.images || []}
            title={product.title}
            discountBadge={discountBadge}
            selectedVariantImage={selectedVariant?.image}
            isOutOfStock={isOutOfStock}
          />
        </div>

        {/* Center: Main Product Info (4 Columns) */}
        <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            onVariantChange={setSelectedVariant}
            onScrollToReviews={handleScrollToReviews}
          />
        </div>

        {/* Right: Buy Box & Urgency / Delivery (3 Columns) */}
        <div className="lg:col-span-3 sticky top-24">
          <ProductBuyBox
            product={product}
            selectedVariant={selectedVariant}
          />
        </div>
      </div>

      {/* 3. Deep-Dive Tabbed Suite (Overview, Specs, Reviews, Shipping) */}
      <ProductTabs
        product={product}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 4. Related & Recommended Products */}
      <RelatedProducts
        categoryId={product.categoryId}
        currentProductId={product.id}
      />

      {/* 5. Mobile Sticky Bottom Buy Bar */}
      <MobileStickyBuyBar
        product={product}
        selectedVariant={selectedVariant}
      />
    </div>
  );
}
