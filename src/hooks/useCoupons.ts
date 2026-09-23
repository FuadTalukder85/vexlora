import { useQuery, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { couponApi, ValidateCouponPayload } from "@/lib/api/coupons";
import { toast } from "sonner";

export function usePublicCoupons(vendorId?: string) {
  return useQuery({
    queryKey: queryKeys.coupons.public(vendorId),
    queryFn: async () => {
      const response = await couponApi.getPublicCoupons({ vendorId });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 mins
  });
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: async (payload: ValidateCouponPayload) => {
      const response = await couponApi.validateCoupon(payload);
      return response.data;
    },
    onError: (error: any) => {
      const message = error?.message || error?.response?.data?.message || "Invalid or inapplicable coupon code";
      toast.error(message);
    },
  });
}
