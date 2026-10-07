"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Star, MessageSquare } from "lucide-react";

export interface VendorStoreDetails {
  id: string;
  storeName: string;
  storeSlug: string;
  storeLogo?: string | null;
  storeBanner?: string | null;
  description?: string;
  ratingAvg?: number;
  ratingCount?: number;
  createdAt?: string;
  owner?: {
    name: string;
    image?: string | null;
  };
}

interface StoreProfileHeaderProps {
  vendor: VendorStoreDetails;
  onStartChat: () => void;
}

export const StoreProfileHeader: React.FC<StoreProfileHeaderProps> = ({ vendor, onStartChat }) => {
  return (
    <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
      {/* Cover Banner */}
      <div className="relative h-44 sm:h-64 w-full bg-primary overflow-hidden">
        {vendor.storeBanner ? (
          <Image
            src={vendor.storeBanner}
            alt={vendor.storeName}
            fill
            className="object-cover opacity-90"
            priority
          />
        ) : (
          <div className="w-full h-full opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        )}
      </div>

      {/* Store Profile Header Body */}
      <div className="p-6 sm:p-8 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
          {/* Logo */}
          <div className="-mt-14 sm:-mt-16 relative w-24 sm:w-28 h-24 sm:h-28 rounded-3xl overflow-hidden bg-card border-4 border-card shadow-xl shrink-0">
            {vendor.storeLogo ? (
              <Image
                src={vendor.storeLogo}
                alt={vendor.storeName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary text-white flex items-center justify-center font-black text-3xl">
                {vendor.storeName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Store Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                {vendor.storeName}
              </h1>
              <span title="Verified Vexlora Partner">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              </span>
            </div>

            <p className="text-xs sm:text-sm text-secondary max-w-xl leading-relaxed">
              {vendor.description || "Official storefront on Vexlora marketplace with guaranteed genuine products and direct vendor customer support."}
            </p>

            {/* Rating & Dispatch Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
              <div className="flex items-center text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                <span>{Number(vendor.ratingAvg || 4.9).toFixed(1)}</span>
                <span className="text-muted-foreground font-normal ml-1">
                  ({vendor.ratingCount || 120} reviews)
                </span>
              </div>
              <span className="text-border">•</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                ✓ Verified Merchant
              </span>
              <span className="text-border">•</span>
              <span className="text-secondary font-medium">Response: &lt; 2 hrs</span>
            </div>
          </div>
        </div>

        {/* Primary Action: Direct Chat with this Seller */}
        <div className="shrink-0">
          <button
            onClick={onStartChat}
            className="w-full sm:w-auto px-6 py-3.5 bg-primary hover:bg-highlight text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>Chat with {vendor.storeName}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
