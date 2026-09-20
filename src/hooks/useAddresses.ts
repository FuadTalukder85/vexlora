import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addressApi, Address, CreateAddressPayload, UpdateAddressPayload } from "@/lib/api/addresses";
import { queryKeys } from "@/lib/query/keys";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Fetch the authenticated user's saved addresses.
 * Automatically disabled when not authenticated.
 */
export function useAddresses() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<Address[]>({
    queryKey: queryKeys.auth.addresses,
    queryFn: () => addressApi.getMyAddresses(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Create a new shipping address.
 * Invalidates the addresses cache on success.
 */
export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAddressPayload) => addressApi.createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.addresses });
      toast.success("Address saved successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save address");
    },
  });
}

/**
 * Delete an address by ID.
 * Invalidates the addresses cache on success.
 */
export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressApi.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.addresses });
      toast.success("Address removed");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete address");
    },
  });
}

/**
 * Set an address as the default.
 * Invalidates the addresses cache on success.
 */
export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressApi.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.addresses });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to set default address");
    },
  });
}
