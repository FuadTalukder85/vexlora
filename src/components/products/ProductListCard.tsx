"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, Check } from "lucide-react";
import { Product } from "@/types/product";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useUIStore } from "@/stores/ui.store";
import { formatCurrency } from "@/lib/utils";

interface ProductListCardProps {
  product: Product;
}

export function ProductListCard({ product }: ProductListCardProps) {
  const { id, title, slug, basePrice, discountPrice, brand, images, ratingAvg, ratingCount, vendor, totalStock, tags } = product;

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);

  const [addedAnimation, setAddedAnimation] = React.useState(false);

  const numPrice = Number(discountPrice || basePrice || 0);
  const originalPrice = discountPrice ? Number(basePrice) : undefined;
  const numRating = Number(ratingAvg || 0);
  const primaryImage = images && images.length > 0 ? images[0] : "/images/placeholder.png";
  const vendorName = vendor?.storeName || "Verified Merchant";
  const activeInWishlist = isInWishlist(id);

  const discountPercent = originalPrice && originalPrice > numPrice
    ? Math.round(((originalPrice - numPrice) / originalPrice) * 100)
    : undefined;

  const handleAddToCart = () => {
    addItem({
      id,
      productId: id,
      vendorId: product.vendorId || "vendor-1",
      vendorName,
      title,
      slug,
      price: numPrice,
      image: primaryImage,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
    setCartDrawerOpen(true);
  };

  return (
    <div className="group relative flex flex-col sm:flex-row bg-white rounded-2xl border border-border p-4 sm:p-5 hover:shadow-lg hover:border-border transition-all duration-200 gap-5">
      {/* 1. Image Area */}
      <div className="relative w-full sm:w-56 h-52 sm:h-52 shrink-0 bg-muted/80 rounded-xl overflow-hidden flex items-center justify-center p-3">
        {discountPercent && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-highlight text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-md shadow-xs">
            {discountPercent}% OFF
          </span>
        )}

        <Image
          src={primaryImage}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, 240px"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() =>
            toggleWishlist({
              productId: id,
              title,
              slug,
              price: numPrice,
              image: primaryImage,
              vendorName,
            })
          }
          className={`absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-xs transition-colors cursor-pointer ${
            activeInWishlist ? "text-highlight" : "text-secondary hover:text-highlight"
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`h-4 w-4 ${activeInWishlist ? "fill-highlight" : ""}`} />
        </button>
      </div>

      {/* 2. Middle Content Area */}
      <div className="flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Brand & Vendor Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            {brand && (
              <span className="text-[11px] font-extrabold uppercase text-secondary tracking-wider">
                {brand}
              </span>
            )}
            <span className="text-secondary/60">•</span>
            <span className="text-xs font-semibold text-primary/80 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {vendorName}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-primary group-hover:text-primary/80 transition-colors line-clamp-2 mt-1">
            <Link href={`/products/${slug || id}`}>{title}</Link>
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(numRating) ? "fill-amber-400 text-amber-400" : "text-secondary/40 fill-slate-100"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-primary">{numRating > 0 ? numRating.toFixed(1) : "4.8"}</span>
            <span className="text-xs text-secondary">
              ({ratingCount > 0 ? ratingCount.toLocaleString() : "140"} reviews)
            </span>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
              {tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Shipping badge */}
        <div className="flex items-center gap-4 text-xs text-secondary pt-2">
          <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
            <Truck className="w-3.5 h-3.5" />
            Free 2-Day Delivery
          </span>
          <span>
            {totalStock > 0 ? (
              <span className="text-secondary font-medium">In Stock ({totalStock} units)</span>
            ) : (
              <span className="text-highlight font-medium">Low Stock</span>
            )}
          </span>
        </div>
      </div>

      {/* 3. Right Price & Actions Area */}
      <div className="sm:w-48 shrink-0 flex flex-col justify-between sm:border-l sm:border-border sm:pl-5 pt-3 sm:pt-0">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-primary">
              {formatCurrency(numPrice)}
            </span>
          </div>
          {originalPrice && (
            <div className="text-xs font-semibold text-secondary line-through">
              {formatCurrency(originalPrice)}
            </div>
          )}
        </div>

        <div className="pt-4 sm:pt-0">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer shadow-xs active:scale-[0.98] ${
              addedAnimation
                ? "bg-emerald-600 text-white"
                : "bg-primary hover:opacity-90 text-white"
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
