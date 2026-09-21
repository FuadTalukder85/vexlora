import { http } from "./client";
import { ApiResponse } from "./types";
import { Product } from "@/types/product";

export interface Deal {
  id: string;
  productId: string;
  variantId?: string | null;
  vendorId: string;
  title?: string | null;
  dealPrice: number;
  originalPrice: number;
  quantityLimit?: number | null;
  soldCount: number;
  maxPerCustomer?: number | null;
  startAt: string;
  endAt: string;
  status: "SCHEDULED" | "ACTIVE" | "EXPIRED" | "SOLD_OUT" | "CANCELLED";
  discountPercent: number;
  soldPercentage: number;
  isExpired: boolean;
  product: Product;
}

export interface DealQueryParams {
  categoryId?: string;
  page?: number;
  limit?: number;
}

export const getActiveDeals = async (
  params?: DealQueryParams
): Promise<ApiResponse<Deal[]>> => {
  return await http.get<Deal[]>("/deals", params as Record<string, unknown>);
};

export const getDealById = async (id: string): Promise<ApiResponse<Deal>> => {
  return await http.get<Deal>(`/deals/${id}`);
};
