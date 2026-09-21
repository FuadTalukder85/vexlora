"use client";

import * as React from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { CreateAddressPayload } from "@/lib/api/addresses";
import { useAddresses, useCreateAddress } from "@/hooks/useAddresses";
import { useCreateOrder } from "@/hooks/useOrders";
import { useIsMounted } from "@/lib/utils";
import { orderApi } from "@/lib/api/orders";

import { CheckoutEmptyState } from "./components/CheckoutEmptyState";
import { ShippingAddressSection } from "./components/ShippingAddressSection";
import { PaymentMethodSection } from "./components/PaymentMethodSection";
import { VendorOrderReviewSection } from "./components/VendorOrderReviewSection";
import { OrderSummaryCard } from "./components/OrderSummaryCard";
import { AddressModal } from "./components/AddressModal";

const FREE_SHIPPING_THRESHOLD = 100;

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isInitialChecking } = useAuthStore();
  const {
    items,
    vendorGroups,
    selectedItemIds,
    getSelectedSubtotal,
    getSelectedCount,
    fetchCart,
  } = useCartStore();

  // TanStack Query: Addresses
  const { data: addresses = [] } = useAddresses();
  const createAddressMutation = useCreateAddress();

  // TanStack Query: Orders
  const createOrderMutation = useCreateOrder();

  const [selectedAddressId, setSelectedAddressId] = React.useState<string>("");
  const [paymentMethod, setPaymentMethod] = React.useState<string>("cod");
  const [couponCode, setCouponCode] = React.useState<string>("");
  const [couponApplied, setCouponApplied] = React.useState<boolean>(false);
  const [couponDiscount, setCouponDiscount] = React.useState<number>(0);
  const [couponError, setCouponError] = React.useState<string>("");

  // Stripe-specific loading state (controlled prop for StripePaymentSection)
  const [isPlacingOrder, setIsPlacingOrder] = React.useState<boolean>(false);
  const [stripePublishableKey, setStripePublishableKey] = React.useState<string>("");
  const stripeSubmitRef = React.useRef<(() => void) | null>(null);

  // Address modal state
  const [addressModalOpen, setAddressModalOpen] = React.useState<boolean>(false);
  const [newAddress, setNewAddress] = React.useState<CreateAddressPayload>({
    label: "Home",
    street: "",
    city: "",
    zip: "",
    phone: "",
    isDefault: true,
  });

  const mounted = useIsMounted();

  // Redirect unauthenticated users to login with redirect param
  React.useEffect(() => {
    if (mounted && !isInitialChecking && !isAuthenticated) {
      router.replace("/login?redirect=/checkout");
    }
  }, [mounted, isInitialChecking, isAuthenticated, router]);

  // Fetch cart on mount
  React.useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Auto-select default address when addresses load
  React.useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  const selectedSubtotal = getSelectedSubtotal();
  const selectedCount = getSelectedCount();
  const selectedItems = items.filter(
    (i) => selectedItemIds.includes(i.id) && !i.savedForLater
  );

  const isFreeShipping = selectedSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping ? 0 : 15;
  const finalTotal = Math.max(0, selectedSubtotal - couponDiscount + shippingFee);

  const handleCreatePaymentIntent = React.useCallback(async () => {
    if (selectedItems.length === 0 || !isAuthenticated) return null;
    return await orderApi.createPaymentIntent({
      selectedCartItemIds: selectedItems.map((i) => i.id),
      shippingAddressId: selectedAddressId || undefined,
      couponCode: couponApplied ? couponCode : undefined,
    });
  }, [selectedItems, isAuthenticated, selectedAddressId, couponApplied, couponCode]);

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.zip) {
      return;
    }

    try {
      const created = await createAddressMutation.mutateAsync(newAddress);
      if (created) {
        setSelectedAddressId(created.id);
        setAddressModalOpen(false);
        setNewAddress({
          label: "Home",
          street: "",
          city: "",
          zip: "",
          phone: "",
          isDefault: true,
        });
      }
    } catch {
      // Error toast is handled by useCreateAddress hook
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (couponCode.toUpperCase() === "SAVE10") {
      const discount = selectedSubtotal * 0.1;
      setCouponDiscount(discount);
      setCouponApplied(true);
      setCouponError("");
      toast.success("Coupon applied successfully!");
    } else if (couponCode.toUpperCase() === "FREESHIP") {
      setCouponDiscount(15);
      setCouponApplied(true);
      setCouponError("");
      toast.success("Coupon applied successfully!");
    } else {
      setCouponError("Invalid or expired coupon code");
      toast.error("Invalid or expired coupon code");
      setCouponDiscount(0);
      setCouponApplied(false);
    }
  };

  // Called ONLY after Stripe confirms the card payment was successful
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      const order = await createOrderMutation.mutateAsync({
        selectedCartItemIds: selectedItems.map((i) => i.id),
        shippingAddressId: selectedAddressId,
        paymentMethod: "stripe",
        paymentIntentId,
        couponCode: couponApplied ? couponCode : undefined,
      });

      router.push(`/order-success?orderNumber=${order.orderNumber}&orderId=${order.id}`);
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ||
        "Payment was captured but creating the order record failed. Please contact support.";
      toast.error(message);
      setIsPlacingOrder(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }

    if (selectedCount === 0) {
      toast.error("Please select at least one item from your cart to checkout.");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Please select or add a shipping delivery address.");
      return;
    }

    if (paymentMethod === "stripe") {
      if (stripeSubmitRef.current) {
        setIsPlacingOrder(true);
        stripeSubmitRef.current();
      } else {
        toast.error("Stripe payment form is not ready yet. Please try again.");
      }
      return;
    }

    // Cash on Delivery (COD) Flow
    try {
      const order = await createOrderMutation.mutateAsync({
        selectedCartItemIds: selectedItems.map((i) => i.id),
        shippingAddressId: selectedAddressId,
        paymentMethod: "cod",
        couponCode: couponApplied ? couponCode : undefined,
      });

      router.push(`/order-success?orderNumber=${order.orderNumber}&orderId=${order.id}`);
    } catch (err: unknown) {
      const message =
        (err as { message?: string })?.message ||
        "An error occurred while placing your order. Please try again.";
      toast.error(message);
    }
  };

  const isOrderInProgress = createOrderMutation.isPending || isPlacingOrder;

  if (!mounted || isInitialChecking || !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-muted/50">
        <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (selectedItems.length === 0) {
    return <CheckoutEmptyState />;
  }

  return (
    <div className="min-h-screen bg-muted/60 py-8 lg:py-12">
      <div className="layout-container px-4 sm:px-6 lg:px-8">
        {/* Checkout Header / Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-secondary mb-2">
            <Link href="/cart" className="hover:text-primary transition-colors">
              Cart
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-primary">Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
            Checkout & Order Confirmation
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Checkout Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <ShippingAddressSection
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
              onOpenAddAddress={() => {
                if (!isAuthenticated) {
                  router.push("/login?redirect=/checkout");
                  return;
                }
                setAddressModalOpen(true);
              }}
            />

            <PaymentMethodSection
              paymentMethod={paymentMethod}
              onSelectPaymentMethod={setPaymentMethod}
              finalTotal={finalTotal}
              stripePublishableKey={stripePublishableKey}
              handleCreatePaymentIntent={handleCreatePaymentIntent}
              handlePaymentSuccess={handlePaymentSuccess}
              isPlacingOrder={isPlacingOrder}
              setIsPlacingOrder={setIsPlacingOrder}
              stripeSubmitRef={stripeSubmitRef}
            />

            <VendorOrderReviewSection
              vendorGroups={vendorGroups}
              selectedItemIds={selectedItemIds}
              selectedCount={selectedCount}
            />
          </div>

          {/* RIGHT COLUMN: Order Summary Card (5 cols) */}
          <div className="lg:col-span-5">
            <OrderSummaryCard
              selectedCount={selectedCount}
              selectedSubtotal={selectedSubtotal}
              shippingFee={shippingFee}
              isFreeShipping={isFreeShipping}
              freeShippingThreshold={FREE_SHIPPING_THRESHOLD}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              couponApplied={couponApplied}
              couponDiscount={couponDiscount}
              couponError={couponError}
              setCouponError={setCouponError}
              onApplyCoupon={handleApplyCoupon}
              finalTotal={finalTotal}
              isOrderInProgress={isOrderInProgress}
              paymentMethod={paymentMethod}
              selectedAddressId={selectedAddressId}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>

      {/* Add New Address Modal */}
      <AddressModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        newAddress={newAddress}
        setNewAddress={setNewAddress}
        onSubmit={handleCreateAddress}
        isSaving={createAddressMutation.isPending}
      />
    </div>
  );
}
