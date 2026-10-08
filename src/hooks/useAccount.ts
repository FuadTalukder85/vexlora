import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  userApi,
  CustomerDashboardData,
  UpdateProfilePayload,
  ChangePasswordPayload,
  UserSession,
} from "@/lib/api/user";
import { queryKeys } from "@/lib/query/keys";
import { useAuthStore } from "@/stores/auth.store";
import { User } from "@/types/auth";

/**
 * Fetch comprehensive customer account and dashboard stats
 * Includes cart products count, pending orders, total spent, chats, etc.
 */
export function useCustomerDashboard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<CustomerDashboardData>({
    queryKey: queryKeys.auth.dashboard,
    queryFn: () => userApi.getCustomerDashboard(),
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}

/**
 * Mutation to update user profile (name, phone)
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const fetchMe = useAuthStore((s) => s.fetchMe);

  return useMutation<User, Error, UpdateProfilePayload>({
    mutationFn: (payload) => userApi.updateProfile(payload),
    onSuccess: async (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
      if (typeof window !== "undefined") {
        localStorage.setItem("vexlora_user", JSON.stringify(updatedUser));
      }
      await fetchMe();
      toast.success("Profile updated successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update profile");
    },
  });
}

/**
 * Mutation to upload user avatar image
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const fetchMe = useAuthStore((s) => s.fetchMe);

  return useMutation<User, Error, File>({
    mutationFn: (file) => userApi.uploadAvatar(file),
    onSuccess: async (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
      if (typeof window !== "undefined") {
        localStorage.setItem("vexlora_user", JSON.stringify(updatedUser));
      }
      await fetchMe();
      toast.success("Avatar updated successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to upload avatar");
    },
  });
}

/**
 * Mutation to delete user avatar
 */
export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  const fetchMe = useAuthStore((s) => s.fetchMe);

  return useMutation<User, Error, void>({
    mutationFn: () => userApi.deleteAvatar(),
    onSuccess: async (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
      if (typeof window !== "undefined") {
        localStorage.setItem("vexlora_user", JSON.stringify(updatedUser));
      }
      await fetchMe();
      toast.success("Avatar removed");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to remove avatar");
    },
  });
}

/**
 * Mutation to change customer account password
 */
export function useChangePassword() {
  return useMutation<{ success: boolean; message: string }, Error, ChangePasswordPayload>({
    mutationFn: (payload) => userApi.changePassword(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Password changed successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to change password. Please verify current password.");
    },
  });
}

/**
 * Query to fetch active login sessions
 */
export function useActiveSessions() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery<UserSession[]>({
    queryKey: queryKeys.auth.sessions,
    queryFn: () => userApi.getActiveSessions(),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

/**
 * Mutation to revoke a single session
 */
export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: (sessionId) => userApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.sessions });
      toast.success("Session revoked successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to revoke session");
    },
  });
}

/**
 * Mutation to revoke all other active sessions
 */
export function useRevokeOtherSessions() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, void>({
    mutationFn: () => userApi.revokeOtherSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.sessions });
      toast.success("All other sessions revoked");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to revoke other sessions");
    },
  });
}
