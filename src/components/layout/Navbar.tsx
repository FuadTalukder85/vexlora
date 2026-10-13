"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, ShieldCheck, Flame, Ticket, Store } from "lucide-react";
import { AllCategoriesMegaMenu } from "./AllCategoriesMegaMenu";
import { useVendorStats } from "@/hooks/useVendorStats";
import { useIsMounted } from "@/lib/utils";

export function Navbar() {
  const mounted = useIsMounted();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const { data: vendorCount } = useVendorStats();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 150);
  };

  return (
    <div
      className="hidden md:block w-full border-t border-border bg-white text-[14px] font-medium text-secondary relative"
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full flex items-center justify-between py-2.5 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Categories & Links */}
        <nav className="flex items-center gap-6 lg:gap-8 text-[14px]">
          {/* All Categories Trigger */}
          <div onMouseEnter={handleMouseEnter}>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-bold text-primary hover:text-highlight transition-colors py-1 cursor-pointer text-[14px]"
            >
              <Menu className="h-4 w-4 text-primary" />
              <span>All Categories</span>
            </Link>
          </div>

          {/* Today's Hot Deals */}
          <Link
            href="/deals"
            className="inline-flex items-center gap-1.5 font-semibold text-highlight hover:opacity-80 transition-opacity py-1 text-[14px]"
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Today&apos;s Hot Deals</span>
          </Link>

          {/* Coupons */}
          <Link
            href="/coupons"
            className="inline-flex items-center gap-1.5 text-secondary hover:text-primary transition-colors py-1"
          >
            <Ticket className="h-3.5 w-3.5 text-secondary" />
            <span>Coupons</span>
          </Link>

          {/* Sell */}
          <Link
            href="/vendor-apply"
            className="inline-flex items-center gap-1.5 text-secondary hover:text-primary transition-colors py-1"
          >
            <span>Sell</span>
          </Link>

          {/* Verified Stores */}
          <Link
            href="/stores"
            className="inline-flex items-center gap-1.5 text-secondary hover:text-primary transition-colors py-1"
          >
            <Store className="h-3.5 w-3.5 text-secondary" />
            <span>Verified Stores</span>
          </Link>
        </nav>

        {/* Trust Badges */}
        <div className="hidden xl:flex items-center gap-4 text-secondary text-[11px]">
          <span className="flex items-center gap-1 text-secondary">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>100% Escrow Buyer Protection</span>
          </span>
          <span>•</span>
          <span className="font-medium">
            Fast Dispatch across {mounted && typeof vendorCount === "number" ? `${vendorCount}+` : ""} Vendors
          </span>
        </div>
      </div>

      {/* Full Width Mega Menu Dropdown with Smooth Downward Slide */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`absolute top-full left-0 right-0 w-full bg-white border-b border-border shadow-2xl z-50 origin-top transform transition-all duration-300 ease-out ${isMegaMenuOpen
            ? "opacity-100 translate-y-0 scale-y-100 pointer-events-auto visible"
            : "opacity-0 -translate-y-3 scale-y-95 pointer-events-none invisible"
          }`}
      >
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          {mounted && <AllCategoriesMegaMenu onClose={() => setIsMegaMenuOpen(false)} />}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
