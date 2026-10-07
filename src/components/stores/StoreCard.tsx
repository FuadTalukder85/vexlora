"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Star, Package, MessageSquare, ArrowRight } from "lucide-react";

export interface VendorStoreItem {
  id: string;
  storeName: string;
  storeSlug: string;
  storeLogo?: string | null;
  storeBanner?: string | null;
  description?: string;
  ratingAvg?: number;
  ratingCount?: number;
  _count?: {
    products?: number;
  };
}

interface StoreCardProps {
  store: VendorStoreItem;
  onStartChat: (store: VendorStoreItem) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onStartChat }) => {
  const productCount = store._count?.products ?? 12;
  const rating = Number(store.ratingAvg || 4.9);

  return (
    <div className="bg-card rounded-3xl border border-border shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Store Card Banner Header */}
      <div className="relative h-28 w-full bg-primary overflow-hidden">
        {store.storeBanner ? (
          <Image
            src={store.storeBanner}
            alt={store.storeName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
        ) : (
          <div className="w-full h-full opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        )}

        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1 border border-white/10">
          <Package className="w-3 h-3 text-highlight" />
          <span>{productCount} Products</span>
        </div>
      </div>

      {/* Body Details */}
      <div className="p-6 pt-0 relative flex-1 flex flex-col">
        {/* Store Logo */}
        <div className="-mt-9 mb-3 relative w-16 h-16 rounded-2xl overflow-hidden bg-card border-2 border-card shadow-md">
          {store.storeLogo ? (
            <Image
              src={store.storeLogo}
              alt={store.storeName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary text-white flex items-center justify-center font-black text-xl">
              {store.storeName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Store Title & Rating */}
        <div className="mb-2">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-bold text-primary truncate">
              {store.storeName}
            </h3>
            <span title="Verified Store">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs">
            <div className="flex items-center text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-secondary font-medium">Fast Shipper</span>
          </div>
        </div>

        <p className="text-xs text-secondary line-clamp-2 leading-relaxed mb-6">
          {store.description || "Official verified merchant offering certified genuine products and fast nationwide fulfillment."}
        </p>

        {/* Action Buttons */}
        <div className="mt-auto pt-4 border-t border-border grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onStartChat(store)}
            className="py-2.5 px-3 bg-muted hover:bg-highlight/10 text-primary hover:text-highlight rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5 text-highlight" />
            <span>Chat</span>
          </button>

          <Link
            href={`/stores/${store.storeSlug}`}
            className="py-2.5 px-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Visit Store</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
