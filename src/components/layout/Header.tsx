"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  Store,
  HelpCircle,
  Package,
  LogOut,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { useUIStore } from "@/stores/ui.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { formatCurrency, useIsMounted } from "@/lib/utils";
import { toast } from "sonner";
import { MobileNav } from "./MobileNav";
import { Navbar } from "./Navbar";
import { ImageSearchDropdown } from "@/components/search/ImageSearchDropdown";

export function Header() {
  const router = useRouter();
  const { toggleMobileMenu, activeCurrency, setCurrency, setCartDrawerOpen } = useUIStore();
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const cartCount = useCartStore((s) => s.getItemCount());
  const cartSubtotal = useCartStore((s) => s.getSubtotal());

  const {
    user,
    isAuthenticated,
    vendorProfile,
    logout,
  } = useAuthStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const mounted = useIsMounted();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <>
      {/* Mobile Drawer */}
      <MobileNav />

      {/* 1. Top Utility / Announcement Bar */}
      <div className="w-full bg-muted border-b border-border text-xs text-secondary py-1.5 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full flex items-center justify-between">
          {/* Left: Announcement */}
          <div className="flex items-center gap-2 text-secondary font-medium">
            <span>
              Free nationwide delivery on orders over $50 across multi-vendor stores
            </span>
          </div>

          {/* Right: Quick Links, Language & Currency */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="#"
              className="hidden sm:inline-flex items-center gap-1.5 hover:text-primary transition-colors font-medium text-secondary"
            >
              <Package className="h-3.5 w-3.5 text-secondary" />
              <span>Track Order</span>
            </Link>

            <Link
              href="/vendor-apply"
              className="inline-flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity font-semibold"
            >
              <Store className="h-3.5 w-3.5 text-primary" />
              <span>Sell on Vexlora</span>
            </Link>

            <Link
              href="#"
              className="hidden lg:inline-flex items-center gap-1.5 text-secondary hover:text-primary transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5 text-secondary" />
              <span>Help Center</span>
            </Link>

            {/* Currency Selector */}
            <div className="flex items-center gap-1 pl-2 border-l border-border">
              <select
                value={activeCurrency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-xs font-semibold text-secondary outline-none cursor-pointer hover:text-primary transition-colors"
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

      {/* STICKY HEADER */}
      <header className="w-full bg-white border-b border-border sticky top-0 z-40 shadow-xs">
        {/* Main Navbar Row */}
        <div className="w-full py-2.5 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="w-full flex items-center justify-between gap-4 lg:gap-8">
            {/* Mobile Menu Button & Brand Logo */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="lg:hidden h-10 w-10 rounded-xl border border-border bg-white flex items-center justify-center text-primary hover:bg-muted transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <Image
                  src="/images/vexlora.png"
                  alt="Vexlora Logo"
                  width={150}
                  height={40}
                  priority
                />
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-3xl mx-4">
              <form
                onSubmit={handleSearchSubmit}
                className="w-full relative flex items-center rounded-2xl border border-border bg-muted/70 p-1 focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-200"
              >
                {/* Image Search Button (Left side, replacing all categories) */}
                <div className="flex items-center pl-1.5 pr-1 border-r border-border/80">
                  <ImageSearchDropdown variant="desktop" />
                </div>

                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-3.5 h-4 w-4 text-secondary pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 50,000+ products, verified brands, or multi-vendor stores..."
                    className="w-full bg-transparent pl-10 pr-4 py-2 text-sm text-primary placeholder:text-secondary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-primary hover:opacity-90 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all duration-150 active:scale-[0.98] cursor-pointer"
                >
                  <span>Search</span>
                </button>
              </form>
            </div>

            {/* Right Action Icons: Account, Wishlist, Cart */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Account Trigger */}
              {mounted && (isAuthenticated || !!user) ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl border border-border bg-white hover:bg-muted text-primary transition-colors cursor-pointer"
                  >
                    <div className="h-7 w-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="hidden xl:flex flex-col text-left">
                      <span className="text-[11px] font-medium text-secondary leading-none truncate max-w-[120px]">
                        Hi, {user?.name ? user.name.split(" ")[0] : "Account"}
                      </span>
                      <span className="text-xs font-bold text-primary leading-tight mt-0.5">
                        My Account
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-secondary hidden xl:block" />
                  </button>

                  {userDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-4 py-2 border-b border-border">
                          <p className="text-xs font-bold text-primary truncate">{user?.name || "Vexlora User"}</p>
                          <p className="text-[11px] text-secondary truncate">{user?.email || ""}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-muted text-primary text-[10px] font-semibold uppercase">
                            Role: {user?.role || "CUSTOMER"}
                          </span>
                        </div>

                        <div className="py-1">
                          <Link
                            href="/vendor-apply"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-primary font-semibold hover:bg-muted text-left"
                          >
                            <Store className="w-4 h-4 text-primary" />
                            {vendorProfile
                              ? vendorProfile.status === "APPROVED"
                                ? "Manage Store Profile"
                                : "Vendor Application Status"
                              : "Apply for Vendor Store"}
                          </Link>

                          {vendorProfile?.status === "APPROVED" && (
                            <a
                              href={process.env.NEXT_PUBLIC_VENDOR_URL || "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-amber-700 font-semibold hover:bg-amber-50 text-left"
                            >
                              <ExternalLink className="w-4 h-4 text-amber-600" />
                              Open Vendor Dashboard
                            </a>
                          )}
                        </div>

                        <div className="pt-1 border-t border-border">
                          <button
                            onClick={async () => {
                              setUserDropdownOpen(false);
                              await logout();
                              toast.success("Signed out successfully");
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-highlight font-semibold hover:bg-highlight/10 text-left cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-highlight" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl border border-border bg-white hover:bg-muted text-primary transition-colors"
                >
                  <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-[11px] font-medium text-secondary leading-none">
                      Sign In / Register
                    </span>
                    <span className="text-xs font-bold text-primary leading-tight mt-0.5">
                      My Account
                    </span>
                  </div>
                </Link>
              )}

              {/* Wishlist Button with Counter */}
              <Link
                href="/wishlist"
                className="relative p-2.5 rounded-xl border border-border bg-white hover:bg-muted text-primary transition-colors"
                aria-label="View Wishlist"
              >
                <Heart className="h-5 w-5 text-primary" />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <button
                type="button"
                onClick={() => setCartDrawerOpen(true)}
                className="relative flex items-center gap-2.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-primary hover:opacity-90 text-white shadow-sm transition-all duration-150 active:scale-[0.98] cursor-pointer"
                aria-label="Open Shopping Cart Drawer"
              >
                <div className="relative">
                  <ShoppingBag className="h-5 w-5 text-white" />
                  {mounted && cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-white text-[10px] font-black text-primary flex items-center justify-center shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[10px] font-medium text-white leading-none">
                    Cart Subtotal
                  </span>
                  <span className="text-xs font-bold text-white leading-tight mt-0.5">
                    {mounted ? formatCurrency(cartSubtotal) : "$0.00"}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar Row */}
          <div className="mt-3 md:hidden">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full relative flex items-center rounded-xl border border-border bg-muted p-1 focus-within:border-primary focus-within:bg-white"
            >
              <div className="flex items-center pl-1 pr-1 border-r border-border/80">
                <ImageSearchDropdown variant="mobile" />
              </div>
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-3 h-3.5 w-3.5 text-secondary pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products & vendors..."
                  className="w-full bg-transparent pl-8 pr-2 py-1.5 text-xs text-primary placeholder:text-secondary focus:outline-none"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Category & Deal Navigation Bar */}
        <Navbar />
      </header>
    </>
  );
}

export default Header;
