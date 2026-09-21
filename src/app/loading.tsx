import * as React from "react";

export default function GlobalLoading() {
  return (
    <div className="w-full flex-1 flex flex-col py-6 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-10 animate-pulse">
      {/* 1. Hero Banner & Deals Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Main Hero Banner Skeleton */}
        <div className="lg:col-span-8 w-full h-[280px] sm:h-[360px] lg:h-[420px] bg-slate-100/90 rounded-2xl relative overflow-hidden flex flex-col justify-end p-6 sm:p-10 space-y-3">
          <div className="h-4 w-28 bg-slate-200/80 rounded-full" />
          <div className="h-8 sm:h-12 w-3/4 bg-slate-200/80 rounded-xl" />
          <div className="h-4 w-1/2 bg-slate-200/80 rounded-md" />
          <div className="h-10 w-36 bg-slate-200/80 rounded-xl mt-2" />
        </div>

        {/* Right: Side Deals Cards Skeleton */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          <div className="h-[130px] sm:h-[170px] lg:h-[198px] bg-slate-100/90 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="h-3.5 w-20 bg-slate-200 rounded" />
              <div className="h-6 w-32 bg-slate-200 rounded-lg" />
              <div className="h-4 w-16 bg-slate-200 rounded" />
            </div>
            <div className="w-24 h-24 bg-slate-200/80 rounded-xl shrink-0" />
          </div>

          <div className="h-[130px] sm:h-[170px] lg:h-[198px] bg-slate-100/90 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="h-3.5 w-20 bg-slate-200 rounded" />
              <div className="h-6 w-32 bg-slate-200 rounded-lg" />
              <div className="h-4 w-16 bg-slate-200 rounded" />
            </div>
            <div className="w-24 h-24 bg-slate-200/80 rounded-xl shrink-0" />
          </div>
        </div>
      </div>

      {/* 2. Flash Deals / Trending Products Section Skeleton */}
      <div className="space-y-6">
        {/* Section Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-40 bg-slate-200 rounded-lg" />
            <div className="h-6 w-28 bg-slate-200/70 rounded-full" />
          </div>
          <div className="h-4 w-20 bg-slate-200/70 rounded" />
        </div>

        {/* Product Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-3.5 space-y-3 shadow-2xs"
            >
              {/* Product Image Box */}
              <div className="w-full aspect-square bg-slate-100 rounded-xl" />

              {/* Title & Vendor */}
              <div className="space-y-1.5">
                <div className="h-3 w-16 bg-slate-200/80 rounded" />
                <div className="h-4 w-full bg-slate-200 rounded" />
                <div className="h-4 w-3/4 bg-slate-200 rounded" />
              </div>

              {/* Star Rating */}
              <div className="h-3 w-24 bg-slate-100 rounded" />

              {/* Price & Add to Cart button */}
              <div className="flex items-center justify-between pt-1">
                <div className="h-5 w-16 bg-slate-200 rounded" />
                <div className="h-8 w-8 bg-slate-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Category Showcase Grid Skeleton */}
      <div className="space-y-6">
        <div className="h-7 w-52 bg-slate-200 rounded-lg" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-2xs"
            >
              <div className="h-5 w-32 bg-slate-200 rounded" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="aspect-square bg-slate-100 rounded-xl" />
                ))}
              </div>
              <div className="h-4 w-20 bg-slate-200/70 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
