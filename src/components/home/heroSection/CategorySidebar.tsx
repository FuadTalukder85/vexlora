"use client";

import * as React from "react";
import Link from "next/link";
import {
  Laptop,
  Shirt,
  Home as HomeIcon,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Store,
} from "lucide-react";

const categories = [
  { name: "Electronics & Tech", icon: Laptop, count: "1,240 items", tag: "Popular" },
  { name: "Fashion & Apparel", icon: Shirt, count: "3,890 items", tag: "Hot" },
  { name: "Home & Kitchen", icon: HomeIcon, count: "980 items" },
  { name: "Beauty & Wellness", icon: Sparkles, count: "640 items" },
  { name: "Top Rated Stores", icon: Store, count: "500+ vendors", tag: "Verified" },
  { name: "Trending Products", icon: TrendingUp, count: "850 items" },
];

export function CategorySidebar() {
  return (
    <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 px-2">
          <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span>Categories</span>
          </h3>
          <span className="text-[10px] font-semibold text-secondary uppercase bg-slate-100 px-2 py-0.5 rounded-full">
            50k+ Products
          </span>
        </div>

        <nav className="space-y-1">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.name}
                href="#"
                className="flex items-center justify-between p-2.5 rounded-xl text-sm font-normal text-primary hover:bg-slate-50 hover:text-primary transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 group-hover:bg-primary group-hover:text-white flex items-center justify-center text-primary transition-colors">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <span>{cat.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {cat.tag && (
                    <span className="text-[9px] font-bold text-white bg-highlight px-1.5 py-0.5 rounded">
                      {cat.tag}
                    </span>
                  )}
                  <ChevronRight className="h-3.5 w-3.5 text-secondary group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
        <div className="text-[11px] text-secondary">
          <span className="font-bold text-primary block">Buyer Escrow Safe</span>
          <span>Protected payments on all orders</span>
        </div>
      </div>
    </div>
  );
}
