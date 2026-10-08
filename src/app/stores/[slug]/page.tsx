"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { http } from "@/lib/api/client";
import { getProducts } from "@/lib/api/products";
import { useChatStore } from "@/stores/chat.store";
import { Product } from "@/types/product";
import { StoreProfileHeader, VendorStoreDetails } from "@/components/stores/StoreProfileHeader";
import { StoreProductGrid } from "@/components/stores/StoreProductGrid";
import { Store, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function VendorStoreFrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [vendor, setVendor] = useState<VendorStoreDetails | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { openChatWithVendor } = useChatStore();

  // 1. Fetch Vendor Profile Details
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        const res = await http.get<VendorStoreDetails>(`/vendor-profiles/store/${slug}`);
        setVendor(res.data);
      } catch {
        toast.error("Unable to load store information");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [slug]);

  // 2. Fetch Exclusively This Vendor's Products
  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        setProductsLoading(true);
        const res = await getProducts({
          vendorSlug: slug,
          q: searchQuery.trim() || undefined,
          sortBy,
          sortOrder,
          limit: 30,
        });
        setProducts(res.data || []);
      } catch {
        toast.error("Failed to load store catalog");
      } finally {
        setProductsLoading(false);
      }
    };

    fetchVendorProducts();
  }, [slug, searchQuery, sortBy, sortOrder]);

  const handleStartChatWithVendor = () => {
    if (!vendor) return;
    openChatWithVendor(vendor.id, {
      vendorPreview: {
        storeName: vendor.storeName,
        storeLogo: vendor.storeLogo,
      },
    });
  };

  if (loading) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-bold text-secondary">Loading storefront...</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="w-full max-w-3xl mx-auto py-24 text-center px-4">
        <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-primary">Store Not Found</h1>
        <p className="text-sm text-secondary mt-2">
          The merchant store you are looking for may have updated their URL or is currently offline.
        </p>
        <Link
          href="/stores"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Verified Stores
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-8">
      {/* Back Navigation */}
      <div>
        <Link
          href="/stores"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All Verified Stores
        </Link>
      </div>

      {/* Store Profile Hero Banner Header */}
      <StoreProfileHeader vendor={vendor} onStartChat={handleStartChatWithVendor} />

      {/* Store Catalog Section */}
      <StoreProductGrid
        storeName={vendor.storeName}
        products={products}
        loading={productsLoading}
        searchQuery={searchQuery}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={setSearchQuery}
        onSortChange={(sb, so) => {
          setSortBy(sb);
          setSortOrder(so);
        }}
      />
    </div>
  );
}
