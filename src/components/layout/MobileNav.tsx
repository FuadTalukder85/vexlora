"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Store,
  HelpCircle,
  Package,
  Heart,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  User,
} from "lucide-react";
import { useUIStore } from "@/stores/ui.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { useIsMounted } from "@/lib/utils";
import { toast } from "sonner";

const categories = [
  { name: "Electronics & Gadgets", href: "/products?category=electronics", count: "500k+ items" },
  { name: "Laptops & Computers", href: "/products?category=laptops-computers", count: "500k+ items" },
  { name: "Fashion & Apparel", href: "/products?category=fashion-apparel", count: "Popular" },
  { name: "Home & Kitchen", href: "/products?category=home-kitchen", count: "Trending" },
  { name: "Beauty & Wellness", href: "/products?category=beauty-welness", count: "Verified" },
];

export function MobileNav() {
  const { isMobileMenuOpen, setMobileMenuOpen, setCartDrawerOpen } = useUIStore();
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const cartCount = useCartStore((s) => s.getItemCount());
  const { user, isAuthenticated, logout } = useAuthStore();
  const mounted = useIsMounted();

  // Close drawer on escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, setMobileMenuOpen]);

  // Prevent background scroll when open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  if (!isMobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over Panel */}
      <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-slate-100">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 group"
          >
            <Image
              src="/images/vexlora.png"
              alt="Vexlora Logo"
              width={130}
              height={32}
              className="h-8 w-auto object-contain"
            />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="h-9 w-9 rounded-lg flex items-center justify-center text-secondary hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-3 gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <Link
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200/80 text-center hover:border-primary transition-colors"
          >
            <div className="relative">
              <Heart className="h-4 w-4 text-primary mb-1" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-secondary">Wishlist</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setCartDrawerOpen(true);
            }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200/80 text-center hover:border-primary transition-colors cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="h-4 w-4 text-primary mb-1" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-secondary">Cart</span>
          </button>

          {isAuthenticated && user ? (
            <button
              onClick={async () => {
                setMobileMenuOpen(false);
                await logout();
                toast.success("Signed out successfully");
              }}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-rose-200 text-center hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <User className="h-4 w-4 text-rose-500 mb-1" />
              <span className="text-[11px] font-medium text-rose-600">Sign Out</span>
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200/80 text-center hover:border-primary transition-colors"
            >
              <User className="h-4 w-4 text-primary mb-1" />
              <span className="text-[11px] font-medium text-secondary">Account</span>
            </Link>
          )}
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Main Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Explore Categories
            </h4>
            <div className="space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-medium text-secondary hover:bg-slate-100 hover:text-primary transition-colors"
                >
                  <span>{category.name}</span>
                  <div className="flex items-center gap-1.5 text-xs text-secondary">
                    <span>{category.count}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
              Customer Services
            </h4>
            <div className="space-y-1">
              <Link
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 py-2 px-3 rounded-xl text-sm font-medium text-secondary hover:bg-slate-100 hover:text-primary transition-colors"
              >
                <Package className="h-4 w-4 text-secondary" />
                <span>Track Your Order</span>
              </Link>
              <Link
                href="/vendor-apply"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 py-2 px-3 rounded-xl text-sm font-medium text-secondary hover:bg-slate-100 hover:text-primary transition-colors"
              >
                <Store className="h-4 w-4 text-secondary" />
                <span>Sell on Vexlora</span>
              </Link>
              <Link
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 py-2 px-3 rounded-xl text-sm font-medium text-secondary hover:bg-slate-100 hover:text-primary transition-colors"
              >
                <HelpCircle className="h-4 w-4 text-secondary" />
                <span>Help & Support</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pt-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-secondary text-center">
            Multi-Vendor E-Commerce Platform
          </p>
        </div>
      </div>
    </div>
  );
}
