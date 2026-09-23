"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { useIsMounted } from "@/lib/utils";
import { useValidateCoupon } from "@/hooks/useCoupons";
import { AvailableCouponsModal } from "@/components/coupons/AvailableCouponsModal";

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
  const [appliedCouponCode, setAppliedCouponCode] = React.useState("");
  const [couponApplied, setCouponApplied] = React.useState(false);
  const [couponDiscount, setCouponDiscount] = React.useState(0);
  const [couponError, setCouponError] = React.useState("");
  const [isCouponsModalOpen, setIsCouponsModalOpen] = React.useState(false);

  const validateCouponMutation = useValidateCoupon();
  const mounted = useIsMounted();

  React.useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const activeItems = items.filter((i) => !i.savedForLater);
  const selectedItems = activeItems.filter((item) => selectedItemIds.includes(item.id));
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

  // Re-validate coupon if cart items change while coupon is applied
  React.useEffect(() => {
    if (couponApplied && appliedCouponCode && selectedItems.length > 0) {
      validateCouponMutation.mutate(
        {
          code: appliedCouponCode,
          items: selectedItems.map((it) => ({
            productId: it.productId,
            vendorId: it.vendorId,
            price: Number(it.price),
            quantity: it.quantity,
          })),
          subtotal: selectedSubtotal,
        },
        {
          onSuccess: (res) => {
            setCouponDiscount(res.discountAmount);
          },
          onError: (err: any) => {
            const msg = err?.message || "Cart changed: coupon conditions no longer satisfied";
            setCouponError(msg);
            setCouponApplied(false);
            setCouponDiscount(0);
            setAppliedCouponCode("");
          },
        }
      );
    } else if (selectedItems.length === 0 && couponApplied) {
      setCouponApplied(false);
      setCouponDiscount(0);
      setAppliedCouponCode("");
    }
  }, [selectedSubtotal, selectedItems.length]);

  const handleApplyCoupon = (e?: React.FormEvent, overrideCode?: string) => {
    if (e) e.preventDefault();
    const codeToApply = (overrideCode || couponCode).trim().toUpperCase();
    if (!codeToApply) return;

    if (selectedItems.length === 0) {
      setCouponError("Please select at least one item to apply a coupon");
      return;
    }

    setCouponError("");

    validateCouponMutation.mutate(
      {
        code: codeToApply,
        items: selectedItems.map((it) => ({
          productId: it.productId,
          vendorId: it.vendorId,
          price: Number(it.price),
          quantity: it.quantity,
        })),
        subtotal: selectedSubtotal,
      },
      {
        onSuccess: (data) => {
          setAppliedCouponCode(data.coupon.code);
          setCouponCode(data.coupon.code);
          setCouponDiscount(data.discountAmount);
          setCouponApplied(true);
          setCouponError("");
          toast.success(data.message || `Coupon "${data.coupon.code}" applied!`);
        },
        onError: (err: any) => {
          const message = err?.message || "Invalid or ineligible coupon code";
          setCouponError(message);
          setCouponApplied(false);
          setCouponDiscount(0);
        },
      }
    );
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponDiscount(0);
    setAppliedCouponCode("");
    setCouponCode("");
    setCouponError("");
    toast.info("Coupon removed");
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }
    // If coupon is applied, we can store it or pass in query / state
    if (couponApplied && appliedCouponCode) {
      sessionStorage.setItem("vexlora_checkout_coupon", appliedCouponCode);
    } else {
      sessionStorage.removeItem("vexlora_checkout_coupon");
    }
    router.push("/checkout");
  };

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-muted/50">
        <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (activeItems.length === 0 && savedForLater.length === 0) {
    return <CartEmptyState />;
  }

  return (
    <div className="min-h-screen bg-muted/60 py-8 lg:py-12">
      <div className="layout-container px-4 sm:px-6 lg:px-8">
        {/* Page Title & Actions */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-secondary mt-0.5">
              Manage selected products, vendor packages, and discounts
            </p>
          </div>

          {activeItems.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold text-highlight hover:text-highlight flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
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
              isApplyingCoupon={validateCouponMutation.isPending}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              onOpenCouponsModal={() => setIsCouponsModalOpen(true)}
              finalTotal={finalTotal}
              onProceedToCheckout={handleProceedToCheckout}
            />
          </div>
        </div>
      </div>

      {/* Available Coupons Modal */}
      <AvailableCouponsModal
        isOpen={isCouponsModalOpen}
        onClose={() => setIsCouponsModalOpen(false)}
        onSelectCoupon={(code) => handleApplyCoupon(undefined, code)}
        currentSubtotal={selectedSubtotal}
      />
    </div>
  );
}
