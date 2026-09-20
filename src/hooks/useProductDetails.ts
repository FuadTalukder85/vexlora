import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductBySlug, getRelatedProducts } from "@/lib/api/products";
import {
  getProductReviews,
  getProductReviewStats,
  canReviewProduct,
  createReview,
  ReviewQueryParams,
} from "@/lib/api/reviews";
import { CreateReviewPayload } from "@/types/product";

export function useProductDetails(slugOrId: string) {
  return useQuery({
    queryKey: ["product", "details", slugOrId],
    queryFn: async () => {
      const res = await getProductBySlug(slugOrId);
      return res.data;
    },
    enabled: Boolean(slugOrId),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useProductReviews(productId?: string, params?: ReviewQueryParams) {
  return useQuery({
    queryKey: ["reviews", "list", productId, params],
    queryFn: async () => {
      if (!productId) return [];
      const res = await getProductReviews(productId, params);
      return res.data || [];
    },
    enabled: Boolean(productId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useProductReviewStats(productId?: string) {
  return useQuery({
    queryKey: ["reviews", "stats", productId],
    queryFn: async () => {
      if (!productId) return null;
      const res = await getProductReviewStats(productId);
      return res.data;
    },
    enabled: Boolean(productId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCanReview(productId?: string, enabled = true) {
  return useQuery({
    queryKey: ["reviews", "can-review", productId],
    queryFn: async () => {
      if (!productId) return null;
      const res = await canReviewProduct(productId);
      return res.data;
    },
    enabled: Boolean(productId) && enabled,
    staleTime: 1000 * 60,
  });
}

export function useRelatedProducts(categoryId?: string | null, excludeProductId?: string) {
  return useQuery({
    queryKey: ["products", "related", categoryId, excludeProductId],
    queryFn: async () => {
      const res = await getRelatedProducts(categoryId, excludeProductId, 8);
      return res.data || [];
    },
    enabled: Boolean(categoryId || excludeProductId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const res = await createReview(payload);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "list", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "stats", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "can-review", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product", "details"] });
    },
  });
}
