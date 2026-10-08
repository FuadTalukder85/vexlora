"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { ShoppingBag } from "lucide-react";

interface AIProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelectProduct?: () => void;
}

export const AIProductCard: React.FC<AIProductCardProps> = ({
  product,
  onAddToCart,
  onSelectProduct,
}) => {
  const price = Number(product.discountPrice ?? product.basePrice);
  const original = product.discountPrice ? Number(product.basePrice) : null;

  return (
    <div className="bg-card rounded-2xl p-2.5 border border-border shadow-xs flex flex-col justify-between group hover:border-primary/30 transition-colors">
      <div className="flex items-start gap-2.5 mb-2">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
          <Image
            src={product.images?.[0] || "/images/placeholder.png"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="min-w-0 flex-1">
          <Link
            href={`/products/${product.slug}`}
            onClick={onSelectProduct}
            className="text-xs font-bold text-primary line-clamp-2 hover:text-highlight transition-colors leading-snug"
          >
            {product.title}
          </Link>

          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xs font-black text-primary">
              ${price.toFixed(2)}
            </span>
            {original && (
              <span className="text-[10px] text-secondary line-through">
                ${original.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border">
        <Link
          href={`/products/${product.slug}`}
          onClick={onSelectProduct}
          className="py-1.5 px-2 bg-muted hover:bg-muted/80 text-primary rounded-lg text-[11px] font-bold text-center transition-colors"
        >
          View
        </Link>

        <button
          onClick={() => onAddToCart(product)}
          className="py-1.5 px-2 bg-primary hover:bg-highlight text-white rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
        >
          <ShoppingBag className="w-3 h-3" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};
