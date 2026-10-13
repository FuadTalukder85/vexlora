import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/lib/api/types";

export function useVendorStats() {
  return useQuery({
    queryKey: ["vendor-stats-count"],
    queryFn: async () => {
      try {
        const response = await apiClient.get<ApiResponse<unknown[]>>("/vendor-profiles?limit=1");
        const total = response.data?.meta?.total;
        if (typeof total === "number") {
          return total;
        }
        if (Array.isArray(response.data?.data)) {
          return response.data.data.length;
        }
        return 0;
      } catch (error) {
        console.error("Failed to fetch vendor stats:", error);
        return 0;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
