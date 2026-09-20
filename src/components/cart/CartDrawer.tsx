"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Star,
  Loader2,
} from "lucide-react";
import { useUIStore } from "@/stores/ui.store";
import { useCartStore } from "@/stores/cart.store";
import { formatCurrency, useIsMounted } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 100; // Free shipping threshold in USD

export function CartDrawer() {
  const router = useRouter();
  const { isCartDrawerOpen, setCartDrawerOpen } = useUIStore();
  const {
    items,
    fetchCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getItemCount,
    isSyncing,
  } = useCartStore();

  const mounted = useIsMounted();

  // Fetch cart data on drawer mount / open
  React.useEffect(() => {
    if (isCartDrawerOpen) {
      fetchCart();
    }
  }, [isCartDrawerOpen, fetchCart]);

  // Close drawer on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartDrawerOpen) {
        setCartDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartDrawerOpen, setCartDrawerOpen]);

  // Prevent background body scroll when drawer is open
  React.useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartDrawerOpen]);

  // Smooth animation state for opening (left to right) and closing (right to left)
  const [isRendered, setIsRendered] = React.useState(isCartDrawerOpen);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isCartDrawerOpen) {
      setIsRendered(true);
      const timer = requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return () => cancelAnimationFrame(timer);
    } else {
      setIsVisible(false);
      const timeout = setTimeout(() => {
        setIsRendered(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isCartDrawerOpen]);

  if (!isRendered) return null;

  const activeItems = items.filter((item) => !item.savedForLater);
  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  // Free shipping progress calculations
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const handleCheckout = () => {
    setCartDrawerOpen(false);
    router.push("/cart");
  };

  const handleViewCart = () => {
    setCartDrawerOpen(false);
    router.push("/cart");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
      {/* Backdrop with smooth fade */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setCartDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Container (Placed on Right Side) */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10 pointer-events-none">
        {/* Slide-over panel: smoothly slides from right to left (open) and left to right (close) */}
        <div
          className={`w-screen max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out ${
            isVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-primary">Your Cart</h2>
              {mounted && itemCount > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-secondary">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setCartDrawerOpen(false)}
              className="h-9 w-9 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-secondary flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {isSyncing && activeItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
                <p className="text-xs font-medium">Loading your cart items...</p>
              </div>
            ) : activeItems.length === 0 ? (
              /* Empty Cart State */
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="h-20 w-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-primary">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-bold text-primary">Your cart is empty</h3>
                <p className="text-xs text-secondary mt-1 max-w-xs">
                  Looks like you haven&apos;t added any items to your cart yet. Explore our curated products!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCartDrawerOpen(false);
                    router.push("/products");
                  }}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
                >
                  <span>Start Shopping</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              /* Items List */
              <div className="divide-y divide-slate-100">
                {activeItems.map((item) => {
                  const itemTotal = item.price * item.quantity;
                  return (
                    <div key={item.id} className="py-4 first:pt-1 last:pb-2">
                      <div className="flex items-start gap-3.5">
                        {/* Thumbnail Image */}
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50/60 p-1 flex items-center justify-center">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="80px"
                              className="object-contain p-1"
                            />
                          ) : (
                            <ShoppingBag className="h-8 w-8 text-slate-300" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          {/* Top Row: Title + Delete Button */}
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/products/${item.slug || item.productId}`}
                              onClick={() => setCartDrawerOpen(false)}
                              className="text-sm font-semibold text-primary hover:text-primary/80 hover:underline line-clamp-2 leading-snug"
                            >
                              {item.title}
                            </Link>

                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer shrink-0"
                              title="Remove item"
                              aria-label="Remove item"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Vendor & Variant Info */}
                          {item.attributes && Object.keys(item.attributes).length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {Object.entries(item.attributes).map(([key, val]) => (
                                <span
                                  key={key}
                                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-secondary"
                                >
                                  {key}: {val}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Validation alerts if any */}
                          {item.isOutOfStock && (
                            <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-1">
                              <AlertTriangle className="h-3 w-3 shrink-0" />
                              <span>Out of stock</span>
                            </div>
                          )}
                          {item.isPriceChanged && (
                            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-medium mt-1">
                              <AlertTriangle className="h-3 w-3 shrink-0" />
                              <span>Price updated</span>
                            </div>
                          )}

                          {/* Bottom Row: Stepper + Price */}
                          <div className="mt-3 flex items-center justify-between">
                            {/* Quantity Stepper */}
                            <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-7 w-7 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors rounded-l-lg cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                {item.quantity === 1 ? (
                                  <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                                ) : (
                                  <Minus className="h-3.5 w-3.5" />
                                )}
                              </button>

                              <span className="w-8 text-center text-xs font-bold text-primary">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-7 w-7 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors rounded-r-lg cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Item Price */}
                            <div className="text-right">
                              <span className="text-sm font-bold text-primary">
                                {formatCurrency(itemTotal)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Section */}
          {activeItems.length > 0 && (
            <div className="border-t border-slate-100 px-6 py-5 bg-white space-y-4 shadow-lg">
              {/* Total Row */}
              <div className="flex items-center justify-between text-base font-bold text-primary">
                <span>Total:</span>
                <span className="text-lg font-black text-primary">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {/* Free Shipping Tier */}
              <div className="pt-2">
                <div className="text-center mb-2 text-xs font-medium text-slate-700">
                  {remainingForFreeShipping > 0 ? (
                    <>
                      Buy{" "}
                      <span className="font-bold text-primary">
                        {formatCurrency(remainingForFreeShipping)}
                      </span>{" "}
                      more to enjoy{" "}
                      <span className="font-bold text-primary">FREE Shipping</span>
                    </>
                  ) : (
                    <span className="font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      You&apos;ve unlocked FREE Shipping!
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-visible my-3">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />

                  {/* Star Badge Thumb */}
                  <div
                    className="absolute -top-2 transform -translate-x-1/2 h-6 w-6 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-xs transition-all duration-300"
                    style={{ left: `${Math.max(4, Math.min(96, freeShippingProgress))}%` }}
                  >
                    <Star className="h-3 w-3 fill-primary text-primary" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleViewCart}
                  className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white text-primary font-bold text-sm hover:bg-slate-50 hover:border-primary transition-colors cursor-pointer text-center shadow-2xs"
                >
                  View Cart
                </button>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-sm transition-all active:scale-[0.98] cursor-pointer text-center"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
