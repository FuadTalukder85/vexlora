import { http } from "./client";
import { ApiResponse } from "./types";
import {
  ProductReview,
  ReviewStats,
  CanReviewResult,
  CreateReviewPayload,
} from "@/types/product";

export interface ReviewQueryParams {
  rating?: number | string;
  isVerified?: boolean | string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "rating";
  sortOrder?: "asc" | "desc";
}

export const getProductReviews = async (
  productId: string,
  params?: ReviewQueryParams
): Promise<ApiResponse<ProductReview[]>> => {
  return await http.get<ProductReview[]>(`/reviews/product/${productId}`, params as Record<string, unknown>);
};

export const getProductReviewStats = async (
  productId: string
): Promise<ApiResponse<ReviewStats>> => {
  return await http.get<ReviewStats>(`/reviews/product/${productId}/stats`);
};

export const canReviewProduct = async (
  productId: string
): Promise<ApiResponse<CanReviewResult>> => {
  return await http.get<CanReviewResult>(`/reviews/can-review/${productId}`);
};

export const createReview = async (
  payload: CreateReviewPayload
): Promise<ApiResponse<ProductReview>> => {
  return await http.post<ProductReview, CreateReviewPayload>("/reviews", payload);
};

export const updateReview = async (
  reviewId: string,
  payload: Partial<CreateReviewPayload>
): Promise<ApiResponse<ProductReview>> => {
  return await http.patch<ProductReview, Partial<CreateReviewPayload>>(`/reviews/${reviewId}`, payload);
};
