import { apiClient } from "./client";
import { ApiResponse } from "./types";
import { Product } from "@/types/product";

export interface SimilarProductItem extends Product {
  similarityScore?: number;
  similarityPercentage?: number;
}

export interface ImageSearchResponseData {
  queryPreview?: string;
  dimensions: number;
  totalFound: number;
  results: SimilarProductItem[];
}

/**
 * Searches the catalog using an uploaded image File/Blob
 */
export async function searchByImageFile(
  file: File | Blob,
  options?: {
    limit?: number;
    threshold?: number;
    onUploadProgress?: (progressEvent: { loaded: number; total?: number; progress?: number }) => void;
  }
): Promise<ApiResponse<ImageSearchResponseData>> {
  const formData = new FormData();
  formData.append("image", file);

  const queryParams = new URLSearchParams();
  if (options?.limit) queryParams.set("limit", String(options.limit));
  if (options?.threshold) queryParams.set("threshold", String(options.threshold));

  const url = `/image-search${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

  const res = await apiClient.post<ApiResponse<ImageSearchResponseData>>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (options?.onUploadProgress) {
        const total = progressEvent.total || (file instanceof File ? file.size : 0);
        const progress = total > 0 ? progressEvent.loaded / total : 0;
        options.onUploadProgress({
          loaded: progressEvent.loaded,
          total,
          progress,
        });
      }
    },
  });

  return res.data;
}

/**
 * Searches the catalog using an image URL or data URL
 */
export async function searchByImageUrl(
  imageUrl: string,
  limit = 24,
  threshold = 0.25
): Promise<ApiResponse<ImageSearchResponseData>> {
  const res = await apiClient.post<ApiResponse<ImageSearchResponseData>>("/image-search", {
    imageUrl,
    limit,
    threshold,
  });
  return res.data;
}

/**
 * Searches visually similar products for an existing product
 */
export async function searchSimilarProducts(
  productId: string,
  limit = 12
): Promise<ApiResponse<ImageSearchResponseData>> {
  const res = await apiClient.get<ApiResponse<ImageSearchResponseData>>(
    `/image-search/similar/${encodeURIComponent(productId)}?limit=${limit}`
  );
  return res.data;
}
