"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { useIsMounted } from "@/lib/utils";

import { CartEmptyState } from "./components/CartEmptyState";
import { CartVendorGroupList } from "./components/CartVendorGroupList";
import { SavedForLaterSection } from "./components/SavedForLaterSection";
import { CartSummaryCard } from "./components/CartSummaryCard";

const FREE_SHIPPING_THRESHOLD = 100;

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
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
      router.push("/login?redirect=/checkout");
      return;
    }
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
    return <CartEmptyState />;
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 lg:py-12">
      <div className="layout-container px-4 sm:px-6 lg:px-8">
        {/* Page Title & Actions */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
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
          {/* LEFT COLUMN: Cart Items & Saved for Later (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <CartVendorGroupList
              activeItems={activeItems}
              vendorGroups={vendorGroups}
              selectedItemIds={selectedItemIds}
              isAllSelected={isAllSelected}
              selectedCount={selectedCount}
              onSelectAll={selectAllItems}
              onToggleSelectVendor={toggleSelectVendor}
              onToggleSelectItem={toggleSelectItem}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onToggleSaveForLater={toggleSaveForLater}
            />

            <SavedForLaterSection
              savedForLater={savedForLater}
              onMoveToCart={(id) => toggleSaveForLater(id, false)}
              onRemoveItem={removeItem}
            />
          </div>

          {/* RIGHT COLUMN: Order Summary Card (4 cols) */}
          <div className="lg:col-span-4">
            <CartSummaryCard
              selectedCount={selectedCount}
              selectedSubtotal={selectedSubtotal}
              remainingForFreeShipping={remainingForFreeShipping}
              freeShippingProgress={freeShippingProgress}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              couponApplied={couponApplied}
              couponDiscount={couponDiscount}
              couponError={couponError}
              onApplyCoupon={handleApplyCoupon}
              finalTotal={finalTotal}
              onProceedToCheckout={handleProceedToCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
