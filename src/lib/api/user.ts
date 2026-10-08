import { http, apiClient } from "./client";
import { User } from "@/types/auth";
import { Order } from "./orders";
import { Address } from "./addresses";

export interface CustomerDashboardStats {
  cartItemsCount: number;
  cartUniqueProductsCount: number;
  pendingOrdersCount: number;
  totalOrdersCount: number;
  totalSpent: number;
  wishlistCount: number;
  conversationsCount: number;
  unreadMessagesCount: number;
}

export interface CustomerDashboardData {
  user: User & {
    addresses?: Address[];
  };
  stats: CustomerDashboardStats;
  recentOrders: Order[];
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  image?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  revokeOtherSessions?: boolean;
}

export interface UserSession {
  id: string;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  expiresAt: string;
  isCurrent?: boolean;
}

export const userApi = {
  getCustomerDashboard: async (): Promise<CustomerDashboardData> => {
    const res = await http.get<CustomerDashboardData>("/users/me/dashboard");
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await http.get<User>("/users/me");
    return res.data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<User> => {
    const res = await http.patch<User>("/users/me", payload);
    return res.data;
  },

  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await apiClient.post<{ data: User }>("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  },

  deleteAvatar: async (): Promise<User> => {
    const res = await http.delete<User>("/users/me/avatar");
    return res.data;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<{ success: boolean; message: string }> => {
    const res = await http.post<{ success: boolean; message: string }>("/users/change-password", payload);
    return res.data;
  },

  getActiveSessions: async (): Promise<UserSession[]> => {
    const res = await http.get<UserSession[]>("/users/me/sessions");
    return res.data;
  },

  revokeSession: async (sessionId: string): Promise<{ success: boolean; message: string }> => {
    const res = await http.delete<{ success: boolean; message: string }>(`/users/me/sessions/${sessionId}`);
    return res.data;
  },

  revokeOtherSessions: async (): Promise<{ success: boolean; message: string }> => {
    const res = await http.delete<{ success: boolean; message: string }>("/users/me/sessions/other");
    return res.data;
  },
};
