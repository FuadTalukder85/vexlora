import { http } from "./client";
import { ApiResponse } from "./types";
import { Product } from "@/types/product";

export interface WishlistApiItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: Product;
}

export interface ToggleWishlistResponse {
  inWishlist: boolean;
  productId: string;
  wishlist?: WishlistApiItem;
}

export interface CheckWishlistResponse {
  inWishlist: boolean;
  productId: string;
  wishlistId: string | null;
}

export const wishlistApi = {
  getMyWishlist: async (params?: Record<string, unknown>): Promise<ApiResponse<WishlistApiItem[]>> => {
    return await http.get<WishlistApiItem[]>("/wishlists/my-wishlist", params);
  },

  toggle: async (productId: string): Promise<ApiResponse<ToggleWishlistResponse>> => {
    return await http.post<ToggleWishlistResponse>("/wishlists/toggle", { productId });
  },

  add: async (productId: string): Promise<ApiResponse<WishlistApiItem>> => {
    return await http.post<WishlistApiItem>("/wishlists", { productId });
  },

  remove: async (productId: string): Promise<ApiResponse<{ message: string }>> => {
    return await http.delete<{ message: string }>(`/wishlists/product/${productId}`);
  },

  clear: async (): Promise<ApiResponse<{ message: string }>> => {
    return await http.delete<{ message: string }>("/wishlists/clear");
  },

  check: async (productId: string): Promise<ApiResponse<CheckWishlistResponse>> => {
    return await http.get<CheckWishlistResponse>(`/wishlists/check/${productId}`);
  },
};
