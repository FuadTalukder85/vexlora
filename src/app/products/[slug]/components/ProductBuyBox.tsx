"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
  Loader2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Product, ProductVariant } from "@/types/product";
import { useCartStore } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import { formatCurrency } from "@/lib/utils";

interface ProductBuyBoxProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

export function ProductBuyBox({ product, selectedVariant }: ProductBuyBoxProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);

  const [quantity, setQuantity] = React.useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);
  const [isBuyingNow, setIsBuyingNow] = React.useState(false);

  const { id, title, slug, vendor, basePrice, discountPrice, totalStock, images } = product;

  // Active pricing and stock
  const activeStock = selectedVariant ? selectedVariant.stock : totalStock;
  const isOutOfStock = activeStock <= 0;
  const safeQuantity = Math.min(quantity, Math.max(1, activeStock));

  const activePrice = selectedVariant
    ? selectedVariant.price
    : discountPrice
    ? Number(discountPrice)
    : Number(basePrice);

  const rawVariantImg = selectedVariant?.image?.trim();
  const validVariantImg = rawVariantImg && !rawVariantImg.startsWith("blob:") ? rawVariantImg : null;
  const activeImage =
    validVariantImg ||
    images.find((img) => img && !img.startsWith("blob:")) ||
    "/images/placeholder-product.png";

  // Delivery estimation calculations
  const deliveryDates = React.useMemo(() => {
    const today = new Date();
    const standardStart = new Date(today);
    standardStart.setDate(today.getDate() + 2);
    const standardEnd = new Date(today);
    standardEnd.setDate(today.getDate() + 4);

    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return {
      standard: `${standardStart.toLocaleDateString("en-US", options)} - ${standardEnd.toLocaleDateString(
        "en-US",
        options
      )}`,
      express: `Tomorrow by 8 PM`,
    };
  }, []);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > activeStock) return activeStock;
      return next;
    });
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    setIsAddingToCart(true);
    try {
      await addItem(
        {
          id: selectedVariant?.id ? `${id}_${selectedVariant.id}` : id,
          productId: id,
          variantId: selectedVariant?.id || null,
          vendorId: product.vendorId || "vendor-1",
          vendorName: vendor?.storeName || "Vexlora Merchant",
          title,
          slug,
          price: activePrice,
          image: activeImage,
          attributes: selectedVariant?.attributes
            ? (selectedVariant.attributes as Record<string, string>)
            : undefined,
        },
        safeQuantity
      );
      toast.success(`Added ${safeQuantity} ${safeQuantity === 1 ? "item" : "items"} to cart!`);
      setCartDrawerOpen(true);
    } catch {
      toast.error("Failed to add product to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    setIsBuyingNow(true);
    try {
      await addItem(
        {
          id: selectedVariant?.id ? `${id}_${selectedVariant.id}` : id,
          productId: id,
          variantId: selectedVariant?.id || null,
          vendorId: product.vendorId || "vendor-1",
          vendorName: vendor?.storeName || "Vexlora Merchant",
          title,
          slug,
          price: activePrice,
          image: activeImage,
          attributes: selectedVariant?.attributes
            ? (selectedVariant.attributes as Record<string, string>)
            : undefined,
        },
        safeQuantity
      );
      router.push("/checkout");
    } catch {
      toast.error("Could not proceed to checkout. Please try again.");
      setIsBuyingNow(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-5 sm:p-6 space-y-6">
      {/* 1. Pricing Snapshot */}
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-xs font-semibold text-secondary block">Total Price:</span>
          <span className="text-2xl sm:text-3xl font-black text-primary">
            {formatCurrency(activePrice * safeQuantity)}
          </span>
        </div>
        {safeQuantity > 1 && (
          <span className="text-xs text-secondary font-medium">
            ({formatCurrency(activePrice)} / each)
          </span>
        )}
      </div>

      {/* 2. Stock Urgency Meter */}
      <div className="space-y-1.5">
        {isOutOfStock ? (
          <div className="flex items-center gap-2 text-highlight bg-highlight/10 p-2.5 rounded-xl text-xs font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Currently Out of Stock. Check back soon.</span>
          </div>
        ) : activeStock <= 10 ? (
          <div className="flex items-center gap-2 text-amber-800 bg-amber-50/80 p-2.5 rounded-xl text-xs font-bold border border-amber-200">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Only {activeStock} units left in stock — order soon!</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>In Stock and ready to ship</span>
          </div>
        )}
      </div>

      {/* 3. Quantity Stepper Controls */}
      {!isOutOfStock && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-primary block">Quantity:</label>
          <div className="flex items-center border border-border rounded-xl max-w-[140px] bg-muted/50 p-1">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              disabled={safeQuantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-primary hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="flex-1 text-center font-black text-sm text-primary">
              {safeQuantity}
            </span>
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              disabled={safeQuantity >= activeStock}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-primary hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Action Buttons: Add to Cart & Buy Now */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className="w-full bg-primary hover:bg-primary/90 text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAddingToCart ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
          <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock || isBuyingNow}
          className="w-full bg-highlight hover:bg-highlight/90 text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBuyingNow ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4 fill-white" />
          )}
          <span>Buy Now</span>
        </button>
      </div>



      {/* 6. Shipping & Delivery Estimator Box */}
      <div className="pt-4 border-t border-border space-y-3 text-xs">
        <div className="flex items-start gap-3 text-secondary">
          <Truck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-primary block">Standard Delivery</span>
            <span className="text-secondary text-[11px]">
              Est. Arrival: <strong className="text-primary">{deliveryDates.standard}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3 text-secondary">
          <RotateCcw className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-primary block">14-Day Free Returns</span>
            <span className="text-secondary text-[11px]">
              Hassle-free return policy if item is unopened
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3 text-secondary">
          <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-primary block">Secure Transaction</span>
            <span className="text-secondary text-[11px]">
              256-bit encrypted checkout protection
            </span>
          </div>
        </div>
      </div>

      {/* 7. Seller / Vendor Profile Snapshot */}
      {vendor && (
        <div className="pt-4 border-t border-border bg-muted/70 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-5 sm:p-6 rounded-b-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                {vendor.storeName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-primary">{vendor.storeName}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-[10px] text-secondary font-medium">
                  Verified Vexlora Partner
                </span>
              </div>
            </div>

            <Link
              href={`/products?brand=${vendor.storeSlug}`}
              className="text-primary hover:text-primary/80 font-bold text-xs bg-white px-2.5 py-1.5 rounded-lg border border-border shadow-2xs hover:shadow-xs transition-all"
            >
              Visit Store
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
            <div className="bg-white p-1.5 rounded-lg border border-border">
              <span className="block font-black text-primary">98.4%</span>
              <span className="text-secondary">Positive</span>
            </div>
            <div className="bg-white p-1.5 rounded-lg border border-border">
              <span className="block font-black text-primary">&lt; 2 hrs</span>
              <span className="text-secondary">Response</span>
            </div>
            <div className="bg-white p-1.5 rounded-lg border border-border">
              <span className="block font-black text-primary">99.1%</span>
              <span className="text-secondary">On Time</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
