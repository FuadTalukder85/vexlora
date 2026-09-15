"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart, Eye, BarChart2 } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import { formatCurrency } from "@/lib/utils";

export interface ProductCardProps {
  id?: string;
  name?: string;
  price?: number;
  originalPrice?: number;
  vendor?: string;
  rating?: number;
  reviews?: number;
  discount?: string;
  image?: string;
  product?: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    vendor?: string;
    rating?: number;
    reviews?: number;
    discount?: string;
    image: string;
  };
}

export function ProductCard(props: ProductCardProps) {
  const item = props.product || props;
  const { id, name, price, originalPrice, vendor, rating, reviews, discount, image } = item;

  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);

  const activeInWishlist = id ? isInWishlist(id) : false;

  const handleAddToCart = () => {
    if (!id || !name || price === undefined || !image) return;
    addItem({
      id,
      productId: id,
      vendorId: "vendor-1",
      vendorName: vendor || "Vexlora",
      title: name,
      slug: id,
      price,
      image,
    });
  };

  return (
    <div className="group relative flex flex-col bg-white transition-all duration-300">
      {/* Image Box */}
      <div className="relative w-full h-56 sm:h-64 mb-4 flex items-center justify-center p-2 group/image overflow-hidden">
        {discount && (
          <span className="absolute top-2 left-2 z-10 bg-rose-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow-xs">
            {discount}
          </span>
        )}

        {image && (
          <Image
            src={image}
            alt={name || "Product image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain p-2 transition-transform duration-300 group-hover/image:scale-105"
          />
        )}

        {/* Action Icons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 z-10">
          <button
            type="button"
            onClick={() =>
              id &&
              name &&
              price !== undefined &&
              toggleWishlist({
                productId: id,
                title: name,
                slug: id,
                price,
                vendorName: vendor || "Vexlora",
              })
            }
            className={`p-1.5 transition-colors cursor-pointer rounded-full bg-white/80 backdrop-blur-xs shadow-xs ${
              activeInWishlist ? "text-rose-600" : "text-slate-600 hover:text-rose-600"
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`h-4.5 w-4.5 ${activeInWishlist ? "fill-rose-600" : ""}`} />
          </button>
          <button
            type="button"
            className="p-1.5 text-slate-600 hover:text-primary transition-colors cursor-pointer rounded-full bg-white/80 backdrop-blur-xs shadow-xs"
            aria-label="Quick View"
          >
            <Eye className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            className="p-1.5 text-slate-600 hover:text-primary transition-colors cursor-pointer rounded-full bg-white/80 backdrop-blur-xs shadow-xs"
            aria-label="Compare"
          >
            <BarChart2 className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute bottom-2 inset-x-2 opacity-0 translate-y-2 group-hover/image:opacity-100 group-hover/image:translate-y-0 transition-all duration-300 z-20">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-sm py-2.5 rounded-lg shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col space-y-1.5">
        {vendor && (
          <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
            {vendor}
          </span>
        )}

        <h3 className="text-sm font-bold text-primary group-hover:text-primary/80 transition-colors line-clamp-2 leading-snug">
          <Link href="#">{name}</Link>
        </h3>

        {rating !== undefined && (
          <div className="flex items-center gap-1.5 text-xs py-0.5">
            <div className="flex items-center text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            {reviews !== undefined && (
              <span className="text-secondary text-xs font-medium">
                {reviews.toLocaleString()} reviews
              </span>
            )}
          </div>
        )}

        {/* Price Row */}
        {price !== undefined && (
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-base sm:text-lg font-black text-primary">
              {formatCurrency(price)}
            </span>
            {originalPrice !== undefined && (
              <span className="text-xs font-semibold text-secondary line-through">
                ${originalPrice}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
