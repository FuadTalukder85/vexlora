"use client";

import * as React from "react";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Filter,
  Check,
  Package,
  Layers,
  Award,
  Zap,
} from "lucide-react";
import { Product, ReviewStats } from "@/types/product";
import { WriteReviewModal } from "./WriteReviewModal";
import { useProductReviews, useProductReviewStats, useCanReview } from "@/hooks/useProductDetails";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

interface ProductTabsProps {
  product: Product;
  activeTab: "overview" | "specs" | "reviews" | "shipping";
  onTabChange: (tab: "overview" | "specs" | "reviews" | "shipping") => void;
}

export function ProductTabs({ product, activeTab, onTabChange }: ProductTabsProps) {
  const { user } = useAuthStore();
  const [isWriteReviewOpen, setIsWriteReviewOpen] = React.useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = React.useState<number | null>(null);
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<"createdAt" | "rating">("createdAt");

  // Fetch reviews and stats from backend
  const { data: reviews = [], isLoading: isReviewsLoading } = useProductReviews(product.id, {
    rating: selectedRatingFilter || undefined,
    isVerified: verifiedOnly ? true : undefined,
    sortBy,
    sortOrder: "desc",
  });

  const { data: serverStats } = useProductReviewStats(product.id);
  const { data: canReviewData } = useCanReview(product.id, Boolean(user));

  // Compute stats or fallback to product ratingAvg / ratingCount
  const reviewStats: ReviewStats = React.useMemo(() => {
    if (serverStats) return serverStats;
    const avg = Number(product.ratingAvg) || 0;
    const count = product.ratingCount || 0;
    return {
      averageRating: avg,
      totalReviews: count,
      ratingDistribution: { 5: count, 4: 0, 3: 0, 2: 0, 1: 0 },
      ratingPercentages: { 5: count > 0 ? 100 : 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      verifiedPurchaseCount: count,
      withImagesCount: 0,
    };
  }, [serverStats, product]);

  const handleWriteReviewClick = () => {
    if (!user) {
      toast.error("Please sign in to write a product review.");
      return;
    }
    if (canReviewData && !canReviewData.canReview) {
      toast.info(canReviewData.message || "You have already reviewed this product.");
      return;
    }
    setIsWriteReviewOpen(true);
  };

  // Structured specifications key-value map
  const specifications = React.useMemo(() => {
    const list: { label: string; value: string }[] = [];
    if (product.brand) list.push({ label: "Brand", value: product.brand });
    if (product.category?.name) list.push({ label: "Category", value: product.category.name });
    if (product.vendor?.storeName) list.push({ label: "Store / Vendor", value: product.vendor.storeName });
    list.push({ label: "Product SKU", value: product.variants?.[0]?.sku || product.slug || product.id });
    list.push({ label: "Availability", value: product.totalStock > 0 ? `${product.totalStock} in stock` : "Out of stock" });
    list.push({ label: "Authenticity", value: "100% Genuine & Verified" });
    list.push({ label: "Warranty", value: "1 Year Official Merchant Warranty" });
    list.push({ label: "Origin", value: "Verified Supplier" });
    if (product.tags && product.tags.length > 0) {
      list.push({ label: "Tags", value: product.tags.join(", ") });
    }
    return list;
  }, [product]);

  return (
    <div id="product-tabs-section" className="w-full bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* 1. Tab Navigation Header */}
      <div className="flex border-b border-border bg-muted/70 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => onTabChange("overview")}
          className={`px-5 py-4 text-xs sm:text-sm font-black transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === "overview"
              ? "border-primary text-primary bg-white shadow-2xs"
              : "border-transparent text-secondary hover:text-primary hover:bg-muted/50"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Overview & Features</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("specs")}
          className={`px-5 py-4 text-xs sm:text-sm font-black transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === "specs"
              ? "border-primary text-primary bg-white shadow-2xs"
              : "border-transparent text-secondary hover:text-primary hover:bg-muted/50"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Specifications</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("reviews")}
          className={`px-5 py-4 text-xs sm:text-sm font-black transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === "reviews"
              ? "border-primary text-primary bg-white shadow-2xs"
              : "border-transparent text-secondary hover:text-primary hover:bg-muted/50"
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Customer Reviews ({reviewStats.totalReviews})</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("shipping")}
          className={`px-5 py-4 text-xs sm:text-sm font-black transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === "shipping"
              ? "border-primary text-primary bg-white shadow-2xs"
              : "border-transparent text-secondary hover:text-primary hover:bg-muted/50"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Shipping & Returns</span>
        </button>
      </div>

      {/* 2. Tab Content Areas */}
      <div className="p-6 sm:p-8 lg:p-10">
        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Description Body */}
            <div className="prose prose-slate max-w-none">
              <h3 className="text-lg font-bold text-primary mb-3">About this item</h3>
              <p className="text-secondary leading-relaxed text-sm whitespace-pre-line">
                {product.description ||
                  "Experience supreme quality craftsmanship and modern engineering with this authentic product from Vexlora's verified marketplace. Built to deliver exceptional performance and longevity."}
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div className="p-4 rounded-xl bg-muted border border-border/80 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-primary">100% Genuine</h4>
                <p className="text-[11px] text-secondary">
                  Guaranteed authentic item sourced directly from verified vendors.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted border border-border/80 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-primary">Fast Dispatch</h4>
                <p className="text-[11px] text-secondary">
                  Orders packed & dispatched within 24-48 business hours.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted border border-border/80 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-primary">14-Day Free Returns</h4>
                <p className="text-[11px] text-secondary">
                  Full refund or exchange if you are not completely satisfied.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted border border-border/80 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-primary">Buyer Protection</h4>
                <p className="text-[11px] text-secondary">
                  Protected end-to-end with secure SSL encryption.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Specifications */}
        {activeTab === "specs" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-primary mb-2">Technical Specifications</h3>
              <p className="text-xs text-secondary">
                Detailed product attributes and merchant technical specifications.
              </p>
            </div>

            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <tbody>
                  {specifications.map((spec, idx) => (
                    <tr
                      key={spec.label}
                      className={idx % 2 === 0 ? "bg-muted/50" : "bg-white"}
                    >
                      <td className="py-3 px-4 font-bold text-primary w-1/3 border-b border-border">
                        {spec.label}
                      </td>
                      <td className="py-3 px-4 text-secondary border-b border-border">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Ratings & Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Rating Analytics Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-muted/70 p-6 rounded-2xl border border-border">
              {/* Overall Score Box */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-2 p-4 border-b lg:border-b-0 lg:border-r border-border">
                <span className="text-4xl sm:text-5xl font-black text-primary">
                  {reviewStats.averageRating.toFixed(1)}
                </span>
                <div className="flex items-center text-amber-400 gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        reviewStats.averageRating >= star
                          ? "fill-amber-400 text-amber-400"
                          : reviewStats.averageRating >= star - 0.5
                          ? "fill-amber-400/50 text-amber-400"
                          : "text-secondary/40 fill-slate-100"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-secondary">
                  Based on {reviewStats.totalReviews.toLocaleString()} verified customer ratings
                </span>
                <button
                  type="button"
                  onClick={handleWriteReviewClick}
                  className="mt-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Write a Review</span>
                </button>
              </div>

              {/* 5-Star Distribution Bars */}
              <div className="lg:col-span-8 space-y-2.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const percent = reviewStats.ratingPercentages?.[star] || 0;
                  const count = reviewStats.ratingDistribution?.[star] || 0;
                  const isSelected = selectedRatingFilter === star;

                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setSelectedRatingFilter(isSelected ? null : star)
                      }
                      className={`w-full flex items-center gap-3 text-xs font-semibold group cursor-pointer p-1 rounded-lg transition-colors ${
                        isSelected ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted"
                      }`}
                    >
                      <span className="w-12 text-left font-bold text-primary flex items-center gap-1 shrink-0">
                        <span>{star}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </span>

                      {/* Progress bar container */}
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <span className="w-10 text-right text-secondary text-[11px] shrink-0 font-medium">
                        {percent}%
                      </span>
                      <span className="w-12 text-right text-secondary text-[11px] shrink-0 font-medium">
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter & Sort Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-secondary" />
                  <span>Filter:</span>
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedRatingFilter(null)}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                    selectedRatingFilter === null
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-white text-secondary hover:border-border"
                  }`}
                >
                  All ({reviewStats.totalReviews})
                </button>

                {[5, 4, 3, 2, 1].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedRatingFilter(selectedRatingFilter === s ? null : s)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                      selectedRatingFilter === s
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-white text-secondary hover:border-border"
                    }`}
                  >
                    {s} Stars
                  </button>
                ))}

                <label className="flex items-center gap-1.5 text-xs font-semibold text-secondary ml-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span>Verified Purchases Only</span>
                </label>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-secondary">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "createdAt" | "rating")}
                  className="p-1.5 border border-border rounded-lg text-primary font-bold bg-white text-xs outline-hidden"
                >
                  <option value="createdAt">Most Recent</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            {/* Customer Review List */}
            {isReviewsLoading ? (
              <div className="py-12 text-center text-xs text-secondary animate-pulse">
                Loading reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-muted/50 rounded-2xl border border-border">
                <MessageSquare className="w-8 h-8 text-secondary/60 mx-auto" />
                <h4 className="font-bold text-sm text-primary">No reviews matching this filter</h4>
                <p className="text-xs text-secondary max-w-sm mx-auto">
                  Be the first to share your thoughts on this product with the Vexlora community!
                </p>
                <button
                  type="button"
                  onClick={handleWriteReviewClick}
                  className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Write the First Review
                </button>
              </div>
            ) : (
              <div className="space-y-6 divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pt-6 first:pt-0 space-y-3">
                    {/* User Info & Rating Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {rev.customer?.name ? rev.customer.name.charAt(0).toUpperCase() : "C"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-primary">
                              {rev.customer?.name || "Verified Customer"}
                            </span>
                            {(rev.hasVerifiedPurchase || rev.subOrderId) && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                <Check className="w-2.5 h-2.5" />
                                <span>Verified Purchase</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-secondary">
                            {new Date(rev.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center text-amber-400 gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              rev.rating >= s
                                ? "fill-amber-400 text-amber-400"
                                : "text-secondary/40"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Body */}
                    {rev.comment && (
                      <p className="text-xs text-secondary leading-relaxed">
                        {rev.comment}
                      </p>
                    )}

                    {/* Review Photos */}
                    {rev.images && rev.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {rev.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative w-16 h-16 rounded-xl overflow-hidden border border-border bg-muted"
                          >
                            <Image
                              src={img}
                              alt="Customer review photo"
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Vendor Reply Thread */}
                    {rev.vendorReply && (
                      <div className="bg-muted rounded-xl p-3.5 border-l-3 border-primary text-xs space-y-1 mt-2">
                        <div className="flex items-center gap-1.5 font-bold text-primary">
                          <MessageSquare className="w-3.5 h-3.5 text-primary" />
                          <span>Merchant Response:</span>
                        </div>
                        <p className="text-secondary text-[11px] leading-relaxed">
                          {rev.vendorReply}
                        </p>
                      </div>
                    )}

                    {/* Helpful Vote Action */}
                    <div className="flex items-center gap-4 text-[11px] text-secondary pt-1">
                      <button
                        type="button"
                        onClick={() => toast.success("Thank you for your feedback!")}
                        className="flex items-center gap-1 text-secondary hover:text-primary transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Helpful</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Write Review Modal */}
            <WriteReviewModal
              productId={product.id}
              productTitle={product.title}
              isOpen={isWriteReviewOpen}
              onClose={() => setIsWriteReviewOpen(false)}
              canReviewData={canReviewData}
            />
          </div>
        )}

        {/* Tab 4: Shipping & Returns */}
        {activeTab === "shipping" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-primary mb-2">Shipping & Return Policies</h3>
              <p className="text-xs text-secondary">
                Comprehensive dispatch, shipping guarantees, and return guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-muted/80 border border-border space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>Delivery & Fulfillment</span>
                </div>
                <ul className="text-xs text-secondary space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Standard Delivery:</strong> Dispatched in 1-2 business days. Estimated transit 3-5 days.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Express Delivery:</strong> Available in select metropolitan zones with next-day dispatch.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Real-time Tracking:</strong> Full tracking links sent via email as soon as the courier scans your package.</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-muted/80 border border-border space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <RotateCcw className="w-4 h-4 text-primary" />
                  <span>14-Day Free Returns</span>
                </div>
                <ul className="text-xs text-secondary space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Hassle-free return window within 14 days of receipt for items in original unused packaging.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Instant wallet or original payment refund processed within 48 hours after merchant return inspection.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>100% money-back guarantee for damaged, defective, or misdescribed items.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
