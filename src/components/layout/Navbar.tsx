"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ShieldCheck, Flame } from "lucide-react";

export function Navbar() {
  return (
    <div className="hidden md:block w-full border-t border-border bg-white text-[14px] font-medium text-secondary px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
      <div className="w-full flex items-center justify-between py-2.5">
        {/* Categories & Links */}
        <nav className="flex items-center gap-6 lg:gap-8 overflow-x-auto text-[14px]">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 font-bold text-primary hover:opacity-80 transition-colors py-1 cursor-pointer text-[14px]"
          >
            <span>All Categories</span>
            <ChevronDown className="h-3.5 w-3.5 text-secondary" />
          </Link>

          {/* Today's Hot Deals */}
          <Link
            href="/products?sortBy=basePrice&sortOrder=asc"
            className="inline-flex items-center gap-1.5 font-semibold text-highlight hover:text-highlight transition-colors py-1 text-[14px]"
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Today&apos;s Hot Deals</span>
          </Link>

          <Link
            href="/products?category=electronics"
            className="text-secondary hover:text-primary transition-colors py-1"
          >
            Electronics & Tech
          </Link>
          <Link
            href="/products?category=laptops-computers"
            className="text-secondary hover:text-primary transition-colors py-1"
          >
            Laptops & Computers
          </Link>
          <Link
            href="/products?category=fashion-apparel"
            className="text-secondary hover:text-primary transition-colors py-1"
          >
            Fashion & Apparel
          </Link>
          <Link
            href="/products?category=home-kitchen"
            className="text-secondary hover:text-primary transition-colors py-1"
          >
            Home & Kitchen
          </Link>
          <Link
            href="/products?category=beauty-welness"
            className="text-secondary hover:text-primary transition-colors py-1"
          >
            Beauty & Wellness
          </Link>
          <Link
            href="/products"
            className="text-secondary hover:text-primary transition-colors py-1"
          >
            Verified Stores
          </Link>
        </nav>

        {/* Trust Badges */}
        <div className="hidden xl:flex items-center gap-4 text-secondary text-[11px]">
          <span className="flex items-center gap-1 text-secondary">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>100% Escrow Buyer Protection</span>
          </span>
          <span>•</span>
          <span>Fast Dispatch across 500+ Vendors</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
