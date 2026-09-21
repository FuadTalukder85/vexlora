import * as React from "react";

export function ProductDetailSkeleton() {
  return (
    <div className="w-full min-h-screen bg-muted/50 py-6 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-64 bg-muted rounded-md" />

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Gallery Skeleton */}
        <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-4">
          <div className="flex sm:flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-xl" />
            ))}
          </div>
          <div className="flex-1 aspect-square bg-muted rounded-2xl" />
        </div>

        {/* Center: Info Skeleton */}
        <div className="lg:col-span-4 space-y-4">
          <div className="h-4 w-28 bg-muted rounded" />
          <div className="h-8 w-full bg-muted rounded" />
          <div className="h-8 w-3/4 bg-muted rounded" />
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-10 w-48 bg-muted rounded" />
          <div className="h-24 w-full bg-muted rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-9 w-16 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Buy Box Skeleton */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-border shadow-xs space-y-4">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="h-10 w-full bg-muted rounded-xl" />
          <div className="h-11 w-full bg-muted rounded-xl" />
          <div className="h-11 w-full bg-muted rounded-xl" />
          <div className="h-28 w-full bg-muted rounded-xl" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="h-64 w-full bg-white rounded-2xl border border-border" />
    </div>
  );
}
