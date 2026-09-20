import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "@/lib/api/wishlist";
import { useWishlistStore } from "@/stores/wishlist.store";
import { toast } from "sonner";

export function useWishlist() {
  const queryClient = useQueryClient();
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);

  const query = useQuery({
    queryKey: ["wishlist", "me"],
    queryFn: async () => {
      const res = await wishlistApi.getMyWishlist();
      return res.data || [];
    },
    staleTime: 1000 * 60 * 2,
  });

  const toggleMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await wishlistApi.toggle(productId);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      fetchWishlist();
      if (data?.inWishlist) {
        toast.success("Saved to your wishlist!");
      } else {
        toast.info("Removed from your wishlist.");
      }
    },
    onError: () => {
      toast.error("Failed to update wishlist");
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await wishlistApi.remove(productId);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      fetchWishlist();
      toast.info("Removed from your wishlist.");
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      const res = await wishlistApi.clear();
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      fetchWishlist();
      toast.success("Wishlist cleared.");
    },
  });

  return {
    ...query,
    toggleWishlist: toggleMutation.mutateAsync,
    removeFromWishlist: removeMutation.mutateAsync,
    clearWishlist: clearMutation.mutateAsync,
    isToggling: toggleMutation.isPending,
  };
}
