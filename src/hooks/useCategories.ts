import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { getCategoryTree, getCategories } from "@/lib/api/categories";

export function useCategoryTree() {
  return useQuery({
    queryKey: queryKeys.categories.tree(),
    queryFn: async () => {
      const response = await getCategoryTree();
      return response.data || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
}

export function useCategories(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...queryKeys.categories.list(), params],
    queryFn: async () => {
      const response = await getCategories(params);
      return response.data || [];
    },
    staleTime: 1000 * 60 * 10,
  });
}
