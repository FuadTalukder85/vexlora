"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { formatCurrency } from "@/lib/utils";

export const AccountCartTab: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getItemCount,
    getSubtotal,
    isLoading,
  } = useCartStore();

  const totalItems = getItemCount();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-border p-12 text-center text-secondary shadow-xs">
        <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center text-primary mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h4 className="text-base font-bold text-primary">Your Cart is Currently Empty</h4>
        <p className="text-xs text-secondary mt-1 max-w-sm mx-auto">
          Explore tens of thousands of top products from verified stores across all categories.
        </p>
        <Link
          href="/products"
          className="mt-5 inline-flex items-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-[14px]">
      {/* Items list */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-border p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-primary">Shopping Cart</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-muted text-primary text-xs font-bold">
              {totalItems} item{totalItems === 1 ? "" : "s"}
            </span>
          </div>

          <button
            onClick={() => clearCart()}
            className="text-[14px] font-bold text-highlight hover:opacity-85 transition-opacity cursor-pointer"
          >
            Clear Cart
          </button>
        </div>

        <div className="divide-y divide-border">
          {items.map((item) => {
            const itemPrice = item.price;
            const itemTotal = itemPrice * item.quantity;
            const imageSrc = item.image || "/images/placeholder.png";

            return (
              <div
                key={item.id}
                className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-muted border border-border shrink-0">
                    <Image
                      src={imageSrc}
                      alt={item.title || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <Link
                      href={`/products/${item.slug || item.productId}`}
                      className="text-[14px] font-bold text-primary hover:underline line-clamp-1"
                    >
                      {item.title || "Product"}
                    </Link>

                    {item.vendorName && (
                      <p className="text-xs text-secondary mt-0.5">
                        Sold by: <span className="font-semibold text-primary">{item.vendorName}</span>
                      </p>
                    )}

                    <p className="text-base font-black text-primary mt-1">
                      {formatCurrency(itemPrice)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 pl-20 sm:pl-0">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-border rounded-xl bg-muted/40 p-1">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      disabled={isLoading || item.quantity <= 1}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-primary hover:bg-muted disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-[14px] font-bold text-primary">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={isLoading}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-primary hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total & Delete */}
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-black text-primary w-20 text-right">
                      {formatCurrency(itemTotal)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-secondary hover:text-highlight hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Summary Card */}
      <div className="bg-white rounded-3xl border border-border p-6 shadow-xs flex flex-col justify-between h-fit space-y-6">
        <div>
          <h3 className="text-base font-bold text-primary pb-4 border-b border-border">
            Order Summary
          </h3>

          <div className="mt-4 space-y-3 text-[14px]">
            <div className="flex items-center justify-between text-secondary">
              <span>Cart Subtotal</span>
              <span className="font-bold text-primary">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-secondary">
              <span>Shipping</span>
              <span className="text-emerald-700 font-bold">Calculated at Checkout</span>
            </div>
            <div className="flex items-center justify-between text-secondary">
              <span>Taxes & Duties</span>
              <span className="text-secondary font-medium">Included</span>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-base">
              <span className="font-bold text-primary">Estimated Total</span>
              <span className="text-xl font-black text-primary">
                {formatCurrency(subtotal)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/checkout"
            className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl text-[14px] font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/products"
            className="w-full py-2.5 bg-muted hover:bg-muted/80 text-primary rounded-2xl text-[14px] font-bold flex items-center justify-center transition-colors"
          >
            Continue Shopping
          </Link>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-secondary font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>100% Escrow Protection via Vexlora</span>
          </div>
        </div>
      </div>
    </div>
  );
};
