export type ProductStatus = "DRAFT" | "ACTIVE" | "OUT_OF_STOCK" | "BLOCKED" | "REJECTED";

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  image?: string | null;
  attributes?: Record<string, string | number>;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

export interface ProductVendor {
  id: string;
  storeName: string;
  storeSlug: string;
  storeLogo?: string | null;
}

export interface Product {
  id: string;
  vendorId: string;
  title: string;
  slug: string;
  description?: string | null;
  categoryId?: string | null;
  brand?: string | null;
  images: string[];
  basePrice: number | string;
  discountPrice?: number | string | null;
  totalStock: number;
  status: ProductStatus;
  ratingAvg: number | string;
  ratingCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  variants?: ProductVariant[];
  category?: ProductCategory | null;
  vendor?: ProductVendor;
}

export interface ProductSearchParams {
  q?: string;
  searchTerm?: string;
  category?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  minRating?: number | string;
  inStock?: boolean | string;
  sortBy?: "createdAt" | "basePrice" | "ratingAvg" | "totalStock" | string;
  sortOrder?: "asc" | "desc";
  cursor?: string;
  limit?: number;
}
