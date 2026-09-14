"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  Sparkles,
  ChevronDown,
  Store,
  HelpCircle,
  Package,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { useUIStore } from "@/stores/ui.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useCartStore } from "@/stores/cart.store";
import { formatCurrency, useIsMounted } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const { toggleMobileMenu, activeCurrency, setCurrency } = useUIStore();
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const cartCount = useCartStore((s) => s.getItemCount());
  const cartSubtotal = useCartStore((s) => s.getSubtotal());

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const mounted = useIsMounted();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Planned search trigger for future product catalog hook
  };

  return (
    <header className="w-full bg-white border-b border-slate-200/90 sticky top-0 z-40">
      {/* Mobile Drawer */}
      <MobileNav />

      {/* 1. Top Utility / Announcement Bar (Full Width) */}
      <div className="w-full bg-slate-50 border-b border-slate-100 text-xs text-slate-500 py-1.5 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full flex items-center justify-between">
          {/* Left: Announcement / Trust indicator */}
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <span className="text-slate-500">
              Free nationwide delivery on orders over $50 across multi-vendor stores
            </span>
          </div>

          {/* Right: Quick Links, Language & Currency */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="#"
              className="hidden sm:inline-flex items-center gap-1.5 hover:text-indigo-600 transition-colors font-medium"
            >
              <Package className="h-3.5 w-3.5 text-slate-400" />
              <span>Track Order</span>
            </Link>

            <Link
              href="#"
              className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-colors font-semibold"
            >
              <Store className="h-3.5 w-3.5" />
              <span>Sell on Vexlora</span>
            </Link>

            <Link
              href="#"
              className="hidden lg:inline-flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              <span>Help Center</span>
            </Link>

            {/* Currency Selector */}
            <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
              <select
                value={activeCurrency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer hover:text-indigo-600"
                aria-label="Select Currency"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navbar Row (Full Width) */}
      <div className="w-full py-4 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full flex items-center justify-between gap-4 lg:gap-8">
          {/* Mobile Menu Button & Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="lg:hidden h-10 w-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tight text-slate-900 leading-none">
                  VEXLORA
                </span>
                <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase mt-0.5">
                  Marketplace
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar with Category Dropdown (Full Width stretch in center) */}
          <div className="hidden md:flex flex-1 max-w-3xl mx-4">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/70 p-1 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-200"
            >
              {/* Category Filter */}
              <div className="hidden sm:flex items-center pl-3 pr-2 py-1.5 border-r border-slate-200/80">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-600 outline-none cursor-pointer pr-1"
                >
                  <option value="all">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Living</option>
                  <option value="beauty">Beauty</option>
                </select>
              </div>

              {/* Input */}
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 50,000+ products, verified brands, or multi-vendor stores..."
                  className="w-full bg-transparent pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="h-9 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 transition-all duration-150 active:scale-[0.98] cursor-pointer"
              >
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Right Action Icons: Account, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Account Trigger */}
            <Link
              href="#"
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 transition-colors"
            >
              <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-[11px] font-medium text-slate-400 leading-none">
                  Sign In / Register
                </span>
                <span className="text-xs font-bold text-slate-800 leading-tight mt-0.5">
                  My Account
                </span>
              </div>
            </Link>

            {/* Wishlist Button with Live Counter Badge */}
            <Link
              href="#"
              className="relative p-2.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 transition-colors"
              aria-label="View Wishlist"
            >
              <Heart className="h-5 w-5 text-slate-700" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button with Live Counter Badge and Subtotal */}
            <Link
              href="#"
              className="relative flex items-center gap-2.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20 transition-all duration-150 active:scale-[0.98]"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="h-5 w-5 text-white" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-white text-[10px] font-black text-indigo-600 flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] font-medium text-indigo-100 leading-none">
                  Cart Subtotal
                </span>
                <span className="text-xs font-bold text-white leading-tight mt-0.5">
                  {mounted ? formatCurrency(cartSubtotal) : "$0.00"}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar Row (visible on small mobile screens) */}
        <div className="mt-3 md:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full relative flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 focus-within:border-indigo-500 focus-within:bg-white"
          >
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products & vendors..."
              className="w-full bg-transparent pl-10 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </form>
        </div>
      </div>

      {/* 3. Secondary Category & Deal Navigation Bar (Full Width) */}
      <div className="hidden md:block w-full border-t border-slate-100 bg-white text-[14px] font-medium text-slate-600 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full flex items-center justify-between py-2.5">
          {/* Categories & Links */}
          <nav className="flex items-center gap-6 lg:gap-8 overflow-x-auto text-[14px]">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-indigo-600 transition-colors py-1 cursor-pointer text-[14px]"
            >
              <span>All Categories</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            <Link
              href="#"
              className="inline-flex items-center gap-1.5 font-semibold text-rose-600 hover:text-rose-700 transition-colors py-1 text-[14px]"
            >
              <Flame className="h-3.5 w-3.5" />
              <span>Today&apos;s Hot Deals</span>
            </Link>

            <Link
              href="#"
              className="hover:text-indigo-600 transition-colors py-1 text-slate-700"
            >
              Electronics & Tech
            </Link>
            <Link
              href="#"
              className="hover:text-indigo-600 transition-colors py-1 text-slate-700"
            >
              Fashion & Apparel
            </Link>
            <Link
              href="#"
              className="hover:text-indigo-600 transition-colors py-1 text-slate-700"
            >
              Home & Kitchen
            </Link>
            <Link
              href="#"
              className="hover:text-indigo-600 transition-colors py-1 text-slate-700"
            >
              Beauty & Wellness
            </Link>
            <Link
              href="#"
              className="hover:text-indigo-600 transition-colors py-1 text-slate-700"
            >
              Verified Stores
            </Link>
          </nav>

          {/* Trust Badges */}
          <div className="hidden xl:flex items-center gap-4 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>100% Escrow Buyer Protection</span>
            </span>
            <span>•</span>
            <span>Fast Dispatch across 500+ Vendors</span>
          </div>
        </div>
      </div>
    </header>
  );
}
