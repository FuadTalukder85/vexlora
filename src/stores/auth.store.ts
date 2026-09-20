import { create } from "zustand";
import axios from "axios";
import { User, VendorProfile, CreateVendorProfilePayload } from "@/types/auth";
import { apiClient, http } from "@/lib/api/client";
import { useCartStore } from "@/stores/cart.store";

const AUTH_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:5000/api/auth";

interface AuthState {
  user: User | null;
  vendorProfile: VendorProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialChecking: boolean;
  authModalOpen: boolean;
  authModalTab: "login" | "register" | "otp" | "forgot";
  pendingEmailForOtp: string | null;
  vendorModalOpen: boolean;

  // Actions
  setAuthModalOpen: (open: boolean, tab?: "login" | "register" | "otp" | "forgot") => void;
  setVendorModalOpen: (open: boolean) => void;
  fetchMe: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ user: User }>;
  register: (payload: { name: string; email: string; password: string; phone?: string }) => Promise<{ user: User }>;
  sendOtp: (email: string, type?: "email-verification" | "forget-password") => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  updateProfile: (payload: Partial<User>) => Promise<User>;
  applyVendorProfile: (payload: CreateVendorProfilePayload) => Promise<VendorProfile>;
  logout: () => Promise<void>;
}

const getInitialUser = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("vexlora_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const hasInitialToken = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("vexlora_token");
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getInitialUser(),
  vendorProfile: null,
  isAuthenticated: hasInitialToken() && !!getInitialUser(),
  isLoading: false,
  isInitialChecking: true,
  authModalOpen: false,
  authModalTab: "login",
  pendingEmailForOtp: null,
  vendorModalOpen: false,

  setAuthModalOpen: (open, tab = "login") =>
    set({ authModalOpen: open, authModalTab: tab }),

  setVendorModalOpen: (open) => set({ vendorModalOpen: open }),

  fetchMe: async () => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("vexlora_token");
        if (token) {
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      }

      set({ isLoading: true });
      const res = await http.get<User>("/users/me");
      if (res && res.data) {
        const user = res.data;
        if (typeof window !== "undefined") {
          localStorage.setItem("vexlora_user", JSON.stringify(user));
        }

        let vendorProfile: VendorProfile | null = null;
        if (user.role === "VENDOR") {
          try {
            const vendorRes = await http.get<VendorProfile>("/vendor-profiles/me");
            if (vendorRes && vendorRes.data) {
              vendorProfile = vendorRes.data;
            }
          } catch {
            // User might not have a vendor profile yet
          }
        }

        set({
          user,
          vendorProfile,
          isAuthenticated: true,
          isInitialChecking: false,
          isLoading: false,
        });
        return;
      }
    } catch (err: unknown) {
      const is401 =
        (err as { statusCode?: number; status?: number })?.statusCode === 401 ||
        (err as { statusCode?: number; status?: number })?.status === 401 ||
        (axios.isAxiosError(err) && err.response?.status === 401);

      if (is401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("vexlora_token");
          localStorage.removeItem("vexlora_user");
          delete apiClient.defaults.headers.common["Authorization"];
        }
        set({
          user: null,
          vendorProfile: null,
          isAuthenticated: false,
          isInitialChecking: false,
          isLoading: false,
        });
      } else {
        set({
          isInitialChecking: false,
          isLoading: false,
        });
      }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        `${AUTH_BASE_URL}/sign-in/email`,
        { email, password },
        { withCredentials: true }
      );

      const data = response.data;
      const token =
        data?.token ||
        data?.session?.token ||
        data?.sessionToken ||
        data?.data?.token ||
        data?.data?.session?.token;

      const userObj = data?.user || data?.data?.user;

      if (token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("vexlora_token", token);
        }
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      if (userObj) {
        if (typeof window !== "undefined") {
          localStorage.setItem("vexlora_user", JSON.stringify(userObj));
        }
        set({
          user: userObj,
          isAuthenticated: true,
          authModalOpen: false,
          isLoading: false,
          isInitialChecking: false,
        });
      }

      // Refresh in background and merge guest cart
      try {
        await get().fetchMe();
        await useCartStore.getState().mergeGuestCart();
      } catch {
        // Non-blocking
      }

      set({ authModalOpen: false, isLoading: false, isInitialChecking: false });
      return { user: get().user || userObj };
    } catch (err: unknown) {
      set({ isLoading: false });
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.message || err.message || "Failed to sign in.");
      }
      throw err;
    }
  },

  register: async (payload) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        `${AUTH_BASE_URL}/sign-up/email`,
        {
          name: payload.name,
          email: payload.email,
          password: payload.password,
          phone: payload.phone,
          role: "CUSTOMER",
        },
        { withCredentials: true }
      );

      const data = response.data;
      const token =
        data?.token ||
        data?.session?.token ||
        data?.sessionToken ||
        data?.data?.token ||
        data?.data?.session?.token;

      const userObj = data?.user || data?.data?.user;

      if (token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("vexlora_token", token);
        }
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      if (userObj) {
        if (typeof window !== "undefined") {
          localStorage.setItem("vexlora_user", JSON.stringify(userObj));
        }
        set({
          user: userObj,
          isAuthenticated: true,
          isLoading: false,
          isInitialChecking: false,
        });
      }

      set({ pendingEmailForOtp: payload.email, isLoading: false });

      try {
        await get().fetchMe();
      } catch {
        // Non-blocking
      }

      return { user: get().user || userObj };
    } catch (err: unknown) {
      set({ isLoading: false });
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.message || err.message || "Registration failed.");
      }
      throw err;
    }
  },

  sendOtp: async (email, type = "email-verification") => {
    set({ isLoading: true });
    try {
      await axios.post(
        `${AUTH_BASE_URL}/email-otp/send-verification-otp`,
        { email, type },
        { withCredentials: true }
      );
      set({ pendingEmailForOtp: email, isLoading: false });
    } catch (err: unknown) {
      set({ isLoading: false });
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.message || err.message || "Failed to send verification OTP.");
      }
      throw err;
    }
  },

  verifyOtp: async (email, otp) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        `${AUTH_BASE_URL}/email-otp/verify-email`,
        { email, otp },
        { withCredentials: true }
      );

      const data = response.data;
      const token =
        data?.token ||
        data?.session?.token ||
        data?.sessionToken ||
        data?.data?.token ||
        data?.data?.session?.token;

      const userObj = data?.user || data?.data?.user;

      if (token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("vexlora_token", token);
        }
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      if (userObj) {
        if (typeof window !== "undefined") {
          localStorage.setItem("vexlora_user", JSON.stringify(userObj));
        }
        set({
          user: userObj,
          isAuthenticated: true,
          authModalOpen: false,
          pendingEmailForOtp: null,
          isLoading: false,
          isInitialChecking: false,
        });
      }

      try {
        await get().fetchMe();
        await useCartStore.getState().mergeGuestCart();
      } catch {
        // Non-blocking
      }

      set({ authModalOpen: false, pendingEmailForOtp: null, isLoading: false, isInitialChecking: false });
    } catch (err: unknown) {
      set({ isLoading: false });
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.message || err.message || "Invalid or expired OTP code.");
      }
      throw err;
    }
  },

  updateProfile: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await http.patch<User>("/users/me", payload);
      if (!res.success) {
        throw new Error(res.message || "Failed to update profile");
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("vexlora_user", JSON.stringify(res.data));
      }
      set({ user: res.data, isLoading: false });
      return res.data;
    } catch (err: unknown) {
      set({ isLoading: false });
      if (err instanceof Error) throw err;
      throw new Error("Failed to update profile");
    }
  },

  applyVendorProfile: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await http.post<VendorProfile>("/vendor-profiles/apply", payload);
      if (!res.success) {
        throw new Error(res.message || "Failed to submit vendor profile application");
      }
      set({ vendorProfile: res.data, vendorModalOpen: false, isLoading: false });
      await get().fetchMe();
      return res.data;
    } catch (err: unknown) {
      set({ isLoading: false });
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("Failed to submit vendor application");
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await axios.post(`${AUTH_BASE_URL}/sign-out`, {}, { withCredentials: true });
    } catch {
      // Ignore network errors on logout
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("vexlora_token");
        localStorage.removeItem("vexlora_user");
        delete apiClient.defaults.headers.common["Authorization"];
      }
      set({
        user: null,
        vendorProfile: null,
        isAuthenticated: false,
        isLoading: false,
        authModalOpen: false,
        vendorModalOpen: false,
      });
    }
  },
}));
