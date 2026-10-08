"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, Store, ShieldCheck, ChevronRight, Loader2 } from "lucide-react";

export interface VendorItem {
  id: string;
  storeName: string;
  storeSlug: string;
  storeLogo?: string | null;
  ratingAvg?: number;
  description?: string;
}

interface VendorStorePickerProps {
  vendors: VendorItem[];
  loading: boolean;
  onSelectVendor: (vendor: VendorItem) => void;
  onBackToConversations?: () => void;
  showBackOption?: boolean;
}

export const VendorStorePicker: React.FC<VendorStorePickerProps> = ({
  vendors,
  loading,
  onSelectVendor,
  onBackToConversations,
  showBackOption = false,
}) => {
  const [search, setSearch] = useState("");

  const filteredVendors = vendors.filter((v) =>
    search.trim()
      ? v.storeName.toLowerCase().includes(search.toLowerCase()) ||
        v.storeSlug.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-card">
      <div className="p-3 border-b border-border bg-muted/40">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search verified seller stores..."
            className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-xs text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border p-2">
        {loading ? (
          <div className="py-16 text-center text-xs text-secondary flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span>Loading verified merchants...</span>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="py-12 text-center text-secondary px-4">
            <Store className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs font-semibold text-primary">No seller stores found</p>
            <p className="text-[11px] text-secondary mt-0.5">
              You can also click &quot;Chat with Seller&quot; on any product page.
            </p>
          </div>
        ) : (
          filteredVendors.map((v) => (
            <div
              key={v.id}
              className="p-3 hover:bg-muted/50 rounded-2xl flex items-center justify-between gap-3 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted border border-border shrink-0">
                  {v.storeLogo ? (
                    <Image
                      src={v.storeLogo}
                      alt={v.storeName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-primary">
                      {v.storeName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="text-xs font-bold text-primary truncate">
                      {v.storeName}
                    </h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-[11px] text-secondary truncate">
                    {v.description || "Verified Seller"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectVendor(v)}
                className="px-3 py-1.5 bg-primary hover:bg-highlight text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shrink-0 shadow-xs flex items-center gap-1 active:scale-95"
              >
                <span>Chat</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {showBackOption && onBackToConversations && (
        <div className="p-3 bg-muted/40 border-t border-border text-center">
          <button
            onClick={onBackToConversations}
            className="text-xs font-semibold text-primary hover:text-highlight transition-colors cursor-pointer"
          >
            ← Back to Active Chats
          </button>
        </div>
      )}
    </div>
  );
};
