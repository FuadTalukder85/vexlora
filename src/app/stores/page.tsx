"use client";

import React, { useState, useEffect } from "react";
import { chatApi } from "@/lib/api/chat";
import { useChatStore } from "@/stores/chat.store";
import { StoreHeroBanner } from "@/components/stores/StoreHeroBanner";
import { StoreCard, VendorStoreItem } from "@/components/stores/StoreCard";
import { Store, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function VerifiedStoresPage() {
  const [stores, setStores] = useState<VendorStoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { openChatWithVendor } = useChatStore();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const data = await chatApi.getVendors();
        setStores((data as unknown as VendorStoreItem[]) || []);
      } catch {
        toast.error("Failed to load verified stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleStartChat = (store: VendorStoreItem) => {
    openChatWithVendor(store.id, {
      vendorPreview: {
        storeName: store.storeName,
        storeLogo: store.storeLogo,
      },
      initialMessage: `Hi ${store.storeName}, I have an inquiry about your store products.`,
    });
  };

  const filteredStores = stores.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.storeName.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q);
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Hero Header */}
      <StoreHeroBanner />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stores by name or keyword..."
            className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-2xl text-xs sm:text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
          />
        </div>

        <div className="text-xs font-semibold text-secondary">
          Showing <strong className="text-primary">{filteredStores.length}</strong> verified {filteredStores.length === 1 ? "store" : "stores"}
        </div>
      </div>

      {/* Store Grid */}
      {loading ? (
        <div className="py-24 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-bold text-secondary">Loading verified merchants...</p>
        </div>
      ) : filteredStores.length === 0 ? (
        <div className="py-20 text-center bg-card rounded-3xl border border-border p-6">
          <Store className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-bold text-primary">No stores found</h3>
          <p className="text-xs text-secondary mt-1 max-w-sm mx-auto">
            We couldn&apos;t find any merchant stores matching &ldquo;{searchQuery}&rdquo;. Try another search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <StoreCard key={store.id} store={store} onStartChat={handleStartChat} />
          ))}
        </div>
      )}
    </div>
  );
}
