import { http } from "./client";
import { ApiResponse } from "./types";

export interface CouponVendor {
  id: string;
  storeName: string;
  storeSlug: string;
  storeLogo?: string | null;
}

export interface CouponItem {
  id: string;
  code: string;
  scope: "platform" | "vendor";
  vendorId?: string | null;
  vendor?: CouponVendor | null;
  discountType: "percentage" | "flat";
  discountValue: number;
  minPurchase?: number | null;
  expiresAt?: string | null;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CartItemForCoupon {
  productId: string;
  vendorId: string;
  price: number;
  quantity: number;
}

export interface ValidateCouponPayload {
  code: string;
  items?: CartItemForCoupon[];
  subtotal?: number;
}

export interface ValidateCouponResult {
  valid: boolean;
  coupon: {
    id: string;
    code: string;
    scope: "platform" | "vendor";
    vendorId: string | null;
    discountType: "percentage" | "flat";
    discountValue: number;
    minPurchase: number | null;
    expiresAt: string | null;
  };
  eligibleSubtotal: number;
  discountAmount: number;
  finalPayable: number;
  message: string;
}

export const couponApi = {
  /**
   * Fetch active, non-expired public coupons (optionally scoped to a vendor)
   */
  getPublicCoupons: async (params?: { vendorId?: string; limit?: number; page?: number }): Promise<ApiResponse<CouponItem[]>> => {
    return await http.get<CouponItem[]>("/coupons", params);
  },

  /**
   * Fetch details of a single coupon by code
   */
  getCouponByCode: async (code: string): Promise<ApiResponse<CouponItem>> => {
    return await http.get<CouponItem>(`/coupons/code/${encodeURIComponent(code)}`);
  },

  /**
   * Validate a coupon against active cart items and subtotal
   */
  validateCoupon: async (payload: ValidateCouponPayload): Promise<ApiResponse<ValidateCouponResult>> => {
    return await http.post<ValidateCouponResult, ValidateCouponPayload>("/coupons/validate", payload);
  },
};
