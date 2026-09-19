import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";
import { ProductSearchParams } from "@/types/product";

export function useProductSearch(params: ProductSearchParams) {
  return useInfiniteQuery({
    queryKey: [
      "products",
      "search",
      {
        q: params.q || "",
        category: params.category || "",
        categoryId: params.categoryId || "",
        brand: params.brand || "",
        minPrice: params.minPrice || "",
        maxPrice: params.maxPrice || "",
        minRating: params.minRating || "",
        sortBy: params.sortBy || "createdAt",
        sortOrder: params.sortOrder || "desc",
        limit: params.limit || 16,
      },
    ],
    queryFn: async ({ pageParam = "" }) => {
      const response = await getProducts({
        ...params,
        cursor: pageParam as string,
        limit: params.limit || 16,
      });
      return response;
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.hasNextPage && lastPage?.meta?.nextCursor) {
        return lastPage.meta.nextCursor;
      }
      return undefined;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}
