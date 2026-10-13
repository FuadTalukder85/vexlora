"use client";

import * as React from "react";
import Link from "next/link";
import {
  Laptop,
  Shirt,
  Home as HomeIcon,
  Sparkles,
  Dumbbell,
  Layers,
  Zap,
  ShieldCheck,
  ChevronRight,
  Store,
} from "lucide-react";
import { useCategoryTree } from "@/hooks/useCategories";
import { useVendorStats } from "@/hooks/useVendorStats";
import { useIsMounted } from "@/lib/utils";

function getCategoryIcon(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes("electr") || s.includes("laptop") || s.includes("tech") || s.includes("computer")) {
    return Laptop;
  }
  if (s.includes("fashion") || s.includes("apparel") || s.includes("cloth")) {
    return Shirt;
  }
  if (s.includes("home") || s.includes("kitchen")) {
    return HomeIcon;
  }
  if (s.includes("beauty") || s.includes("welness") || s.includes("care")) {
    return Sparkles;
  }
  if (s.includes("fit") || s.includes("sport")) {
    return Dumbbell;
  }
  return Layers;
}

export function CategorySidebar() {
  const mounted = useIsMounted();
  const { data: categoryTree = [] } = useCategoryTree();
  const { data: vendorCount } = useVendorStats();

  // Dynamic category list mapped from database
  const displayCategories = React.useMemo(() => {
    const dbCategories = (categoryTree || []).slice(0, 6).map((cat, idx) => {
      let tag: string | undefined;
      if (idx === 0) tag = "Popular";
      if (idx === 1 || idx === 2) tag = "Hot";

      const childCount = cat.children ? cat.children.length : 0;
      const countLabel = childCount > 0 ? `${childCount} sub-taxonomies` : "Trending";

      return {
        id: cat.id || cat.slug,
        name: cat.name,
        slug: cat.slug,
        href: `/products?category=${cat.slug}`,
        icon: getCategoryIcon(cat.slug),
        count: countLabel,
        tag,
      };
    });

    // Add Top Rated Stores
    const vendorCountLabel =
      typeof vendorCount === "number" ? `${vendorCount}+ vendors` : "Verified vendors";

    dbCategories.push({
      id: "stores",
      name: "Top Rated Stores",
      slug: "stores",
      href: "/stores",
      icon: Store,
      count: vendorCountLabel,
      tag: "Verified",
    });

    return dbCategories;
  }, [categoryTree, vendorCount]);

  return (
    <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-border p-4 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-border px-2">
          <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span>Categories</span>
          </h3>
          <span className="text-[10px] font-semibold text-secondary uppercase bg-muted px-2 py-0.5 rounded-full">
            50k+ Products
          </span>
        </div>

        <nav className="space-y-1">
          {!mounted ? (
            Array.from({ length: 7 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl animate-pulse"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-muted shrink-0" />
                  <div className="h-3.5 w-24 bg-muted rounded" />
                </div>
                <div className="h-3 w-3 bg-muted rounded" />
              </div>
            ))
          ) : (
            displayCategories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <Link
                  key={cat.id || cat.slug}
                  href={cat.href}
                  className="flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold text-primary hover:bg-muted hover:text-primary transition-all group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="h-8 w-8 rounded-lg bg-muted group-hover:bg-primary group-hover:text-white flex items-center justify-center text-primary transition-colors shrink-0">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {cat.tag && (
                      <span className="text-[9px] font-semibold text-white bg-highlight px-1.5 py-0.5 rounded">
                        {cat.tag}
                      </span>
                    )}
                    <ChevronRight className="h-3.5 w-3.5 text-secondary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })
          )}
        </nav>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-muted border border-border flex items-center gap-2.5">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
        <div className="text-[11px] text-secondary">
          <span className="font-bold text-primary block">Buyer Escrow Safe</span>
          <span>Protected payments on all orders</span>
        </div>
      </div>
    </div>
  );
}
