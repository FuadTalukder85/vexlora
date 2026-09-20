"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Bookmark,
  BookmarkCheck,
  Plus,
  Minus,
  Check,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Store,
  AlertTriangle,
  Star,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { useCartStore, CartItem } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { formatCurrency, useIsMounted } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 100;

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, setAuthModalOpen } = useAuthStore();
  const {
    items,
    vendorGroups,
    savedForLater,
    selectedItemIds,
    fetchCart,
    updateQuantity,
    removeItem,
    toggleSaveForLater,
    toggleSelectItem,
    toggleSelectVendor,
    selectAllItems,
    getSelectedSubtotal,
    getSelectedCount,
    clearCart,
    isSyncing,
  } = useCartStore();

  const [couponCode, setCouponCode] = React.useState("");
  const [couponApplied, setCouponApplied] = React.useState(false);
  const [couponDiscount, setCouponDiscount] = React.useState(0);
  const [couponError, setCouponError] = React.useState("");

  const mounted = useIsMounted();

  React.useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const activeItems = items.filter((i) => !i.savedForLater);
  const selectedSubtotal = getSelectedSubtotal();
  const selectedCount = getSelectedCount();

  const isAllSelected =
    activeItems.length > 0 &&
    activeItems.every((item) => selectedItemIds.includes(item.id));

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - selectedSubtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((selectedSubtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const finalTotal = Math.max(0, selectedSubtotal - couponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (couponCode.toUpperCase() === "SAVE10") {
      const discount = selectedSubtotal * 0.1;
      setCouponDiscount(discount);
      setCouponApplied(true);
      setCouponError("");
    } else if (couponCode.toUpperCase() === "FREESHIP") {
      setCouponDiscount(15);
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid or expired coupon code");
      setCouponDiscount(0);
      setCouponApplied(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true, "login");
      return;
    }
    // Navigate to checkout with selected items
    router.push("/checkout");
  };

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50/50">
        <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (activeItems.length === 0 && savedForLater.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-slate-50/50">
        <div className="h-28 w-28 rounded-3xl bg-slate-100 flex items-center justify-center mb-6 text-primary shadow-sm">
          <ShoppingBag className="h-14 w-14" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-sm text-secondary mt-2 max-w-md">
          Explore top products from verified vendors across the marketplace and add them to your cart.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-md active:scale-[0.98]"
        >
          <span>Explore Products</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 lg:py-12">
      <div className="layout-container px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumb */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#062D54]">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage selected products, vendor packages, and discounts
            </p>
          </div>

          {activeItems.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {/* Main Grid: Left Items List + Right Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Cart Items by Vendor (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Global Select All Bar (Amazon / Lazada style) */}
            {activeItems.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-2xs">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => selectAllItems(e.target.checked)}
                    className="h-4 w-4 rounded-md border-slate-300 text-primary focus:ring-primary accent-[#062D54] cursor-pointer"
                  />
                  <span className="text-sm font-bold text-[#062D54]">
                    Select all items ({activeItems.length})
                  </span>
                </label>

                <span className="text-xs font-medium text-slate-500">
                  {selectedCount} of {activeItems.length} selected
                </span>
              </div>
            )}

            {/* Vendor Grouped Items */}
            {vendorGroups && vendorGroups.length > 0 ? (
              vendorGroups.map((group) => {
                const groupItems = group.items.filter((i) => !i.savedForLater);
                if (groupItems.length === 0) return null;

                const allGroupSelected = groupItems.every((it) =>
                  selectedItemIds.includes(it.id)
                );

                return (
                  <div
                    key={group.vendorId}
                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs"
                  >
                    {/* Vendor Header */}
                    <div className="bg-slate-50/70 px-6 py-3.5 border-b border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={allGroupSelected}
                          onChange={() => toggleSelectVendor(group.vendorId)}
                          className="h-4 w-4 rounded-md border-slate-300 text-primary focus:ring-primary accent-[#062D54] cursor-pointer"
                          aria-label={`Select all items from ${group.storeName}`}
                        />
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-[#062D54]" />
                          <span className="text-sm font-bold text-[#062D54]">
                            {group.storeName}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-semibold text-slate-500">
                        Package Subtotal: {formatCurrency(group.subtotal)}
                      </span>
                    </div>

                    {/* Vendor Item Rows */}
                    <div className="divide-y divide-slate-100 px-6">
                      {groupItems.map((item) => {
                        const isSelected = selectedItemIds.includes(item.id);
                        const itemTotal = item.currentPrice * item.quantity;

                        return (
                          <div
                            key={item.id}
                            className={`py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors ${
                              !isSelected ? "opacity-75" : ""
                            }`}
                          >
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={item.isOutOfStock || item.isUnavailable}
                              onChange={() => toggleSelectItem(item.id)}
                              className="h-4 w-4 rounded-md border-slate-300 text-primary focus:ring-primary accent-[#062D54] cursor-pointer mt-1 sm:mt-0"
                            />

                            {/* Product Thumbnail */}
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center p-2">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  sizes="96px"
                                  className="object-contain p-1"
                                />
                              ) : (
                                <ShoppingBag className="h-8 w-8 text-slate-300" />
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/products/${item.slug || item.productId}`}
                                className="text-sm sm:text-base font-bold text-[#062D54] hover:underline line-clamp-2"
                              >
                                {item.title}
                              </Link>

                              {/* Attributes */}
                              {item.variantAttributes && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {Object.entries(item.variantAttributes).map(([k, v]) => (
                                    <span
                                      key={k}
                                      className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                                    >
                                      {k}: {String(v)}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Status Badges */}
                              {item.isOutOfStock ? (
                                <p className="text-xs font-bold text-rose-600 flex items-center gap-1 mt-1">
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                  Out of Stock
                                </p>
                              ) : item.isPriceChanged ? (
                                <p className="text-xs font-bold text-amber-600 flex items-center gap-1 mt-1">
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                  Price updated: was {formatCurrency(item.priceSnapshot)}
                                </p>
                              ) : (
                                <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-1">
                                  <Check className="h-3 w-3" />
                                  In Stock
                                </p>
                              )}

                              {/* Actions: Save for later & Delete */}
                              <div className="flex items-center gap-4 mt-3">
                                <button
                                  type="button"
                                  onClick={() => toggleSaveForLater(item.id, true)}
                                  className="text-xs font-medium text-slate-500 hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Bookmark className="h-3.5 w-3.5" />
                                  <span>Save for later</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  className="text-xs font-medium text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>

                            {/* Stepper & Price Column */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0">
                              <span className="text-base font-extrabold text-[#062D54]">
                                {formatCurrency(itemTotal)}
                              </span>

                              {/* Quantity Stepper */}
                              <div className="flex items-center rounded-xl border border-slate-200 bg-white shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-l-xl cursor-pointer"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-10 text-center text-xs font-bold text-[#062D54]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-r-xl cursor-pointer"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              /* Fallback list if vendor grouping not yet loaded */
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 divide-y divide-slate-100">
                {activeItems.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#062D54]">{item.title}</span>
                    <span className="text-sm font-bold text-[#062D54]">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Save for Later Section (Amazon style) */}
            {savedForLater && savedForLater.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <BookmarkCheck className="h-5 w-5 text-[#062D54]" />
                  <h2 className="text-lg font-bold text-[#062D54]">
                    Saved for Later ({savedForLater.length})
                  </h2>
                </div>

                <div className="divide-y divide-slate-100">
                  {savedForLater.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-16 w-16 shrink-0 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="64px"
                              className="object-contain p-1"
                            />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-[#062D54] line-clamp-1">
                            {item.title}
                          </h4>
                          <span className="text-xs font-bold text-[#062D54]">
                            {formatCurrency(item.currentPrice)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleSaveForLater(item.id, false)}
                          className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-primary text-xs font-bold hover:bg-slate-50 hover:border-primary transition-colors cursor-pointer"
                        >
                          Move to Cart
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Order Summary Card (4 cols) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            
            {/* Free Shipping Tier Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
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

              {/* Progress Bar with Star */}
              <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-visible my-3">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
                <div
                  className="absolute -top-2 transform -translate-x-1/2 h-6 w-6 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-xs transition-all duration-300"
                  style={{ left: `${Math.max(4, Math.min(96, freeShippingProgress))}%` }}
                >
                  <Star className="h-3 w-3 fill-primary text-primary" />
                </div>
              </div>
            </div>

            {/* Order Summary Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
              <h3 className="text-lg font-bold text-primary pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm text-secondary">
                <div className="flex justify-between">
                  <span>Selected items ({selectedCount}):</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(selectedSubtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Shipping:</span>
                  <span className="font-bold text-emerald-600">
                    {remainingForFreeShipping === 0 ? "FREE" : "$15.00"}
                  </span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount:</span>
                    <span>-{formatCurrency(couponDiscount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-base font-bold text-primary">Total:</span>
                  <span className="text-2xl font-black text-primary">
                    {formatCurrency(
                      finalTotal + (remainingForFreeShipping === 0 ? 0 : 15)
                    )}
                  </span>
                </div>
              </div>

              {/* Coupon Code Box */}
              <form onSubmit={handleApplyCoupon} className="pt-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code (e.g. SAVE10)"
                      className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-primary uppercase placeholder:normal-case focus:border-primary focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-primary font-bold text-xs transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">
                    {couponError}
                  </p>
                )}
                {couponApplied && (
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">
                    Coupon applied successfully!
                  </p>
                )}
              </form>

              {/* Checkout Button */}
              <button
                type="button"
                disabled={selectedCount === 0}
                onClick={handleProceedToCheckout}
                className="w-full py-4 px-6 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-sm transition-all active:scale-[0.98] cursor-pointer text-center"
              >
                Proceed to Checkout ({selectedCount})
              </button>

              {/* Marketplace Guarantees */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>100% Buyer Protection & Money Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary shrink-0" />
                  <span>Fast tracked delivery from verified vendors</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Easy 14-day return & dispute resolution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
