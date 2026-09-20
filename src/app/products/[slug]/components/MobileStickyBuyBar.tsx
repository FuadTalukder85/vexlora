"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Product, ProductVariant } from "@/types/product";
import { useCartStore } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import { formatCurrency } from "@/lib/utils";

interface MobileStickyBuyBarProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

export function MobileStickyBuyBar({ product, selectedVariant }: MobileStickyBuyBarProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);

  const [isAdding, setIsAdding] = React.useState(false);

  const { id, title, slug, vendor, basePrice, discountPrice, totalStock, images } = product;

  const activeStock = selectedVariant ? selectedVariant.stock : totalStock;
  const isOutOfStock = activeStock <= 0;

  const activePrice = selectedVariant
    ? selectedVariant.price
    : discountPrice
    ? Number(discountPrice)
    : Number(basePrice);

  const activeImage = selectedVariant?.image || images[0] || "/images/placeholder-product.png";

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    try {
      await addItem({
        id: selectedVariant?.id ? `${id}_${selectedVariant.id}` : id,
        productId: id,
        variantId: selectedVariant?.id || null,
        vendorId: product.vendorId || "vendor-1",
        vendorName: vendor?.storeName || "Vexlora Merchant",
        title,
        slug,
        price: activePrice,
        image: activeImage,
      });
      toast.success("Added to cart!");
      setCartDrawerOpen(true);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    try {
      await addItem({
        id: selectedVariant?.id ? `${id}_${selectedVariant.id}` : id,
        productId: id,
        variantId: selectedVariant?.id || null,
        vendorId: product.vendorId || "vendor-1",
        vendorName: vendor?.storeName || "Vexlora Merchant",
        title,
        slug,
        price: activePrice,
        image: activeImage,
      });
      router.push("/checkout");
    } catch {
      toast.error("Failed to proceed to checkout");
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2.5 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
      {/* Product snapshot */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
          <Image
            src={activeImage}
            alt={title}
            fill
            sizes="40px"
            className="object-contain p-1"
          />
        </div>
        <div className="min-w-0">
          <span className="text-xs font-black text-primary block truncate leading-tight">
            {formatCurrency(activePrice)}
          </span>
          <span className="text-[10px] text-secondary truncate block">
            {isOutOfStock ? (
              <span className="text-rose-600 font-bold">Out of stock</span>
            ) : (
              <span>{selectedVariant?.sku ? `Variant: ${selectedVariant.sku}` : "In stock"}</span>
            )}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className="bg-primary hover:bg-primary/90 text-white font-bold text-xs py-2.5 px-3.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isAdding ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ShoppingCart className="w-3.5 h-3.5" />
          )}
          <span>Add</span>
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="bg-highlight hover:bg-highlight/90 text-white font-bold text-xs py-2.5 px-3.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Zap className="w-3.5 h-3.5 fill-white" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
