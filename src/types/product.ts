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

export interface ProductReviewCustomer {
  id: string;
  name: string;
  image?: string | null;
}

export interface ProductReviewReply {
  id: string;
  vendorId: string;
  comment: string;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerId: string;
  subOrderId?: string | null;
  rating: number;
  comment?: string | null;
  images: string[];
  vendorReply?: string | null;
  vendorRepliedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: ProductReviewCustomer;
  hasVerifiedPurchase?: boolean;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
  ratingPercentages: Record<number, number>;
  verifiedPurchaseCount: number;
  withImagesCount: number;
}

export interface CanReviewResult {
  canReview: boolean;
  alreadyReviewed: boolean;
  isVerifiedPurchase: boolean;
  existingReviewId?: string;
  eligibleSubOrderId?: string;
  message: string;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment?: string;
  images?: string[];
  subOrderId?: string;
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
  reviews?: ProductReview[];
  _count?: {
    reviews: number;
  };
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

