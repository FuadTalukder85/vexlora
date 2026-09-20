import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { ApiError, ApiErrorResponse, ApiResponse } from "./types";

const envApiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";
const API_BASE_URL = envApiUrl.endsWith("/v1")
  ? envApiUrl
  : `${envApiUrl.replace(/\/+$/, "")}/v1`;

/**
 * Centralized Axios instance configured for the Vexlora multi-vendor backend
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export function getCartSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem("vexlora_cart_session_id");
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("vexlora_cart_session_id", sessionId);
  }
  return sessionId;
}

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add client timestamp or tracing headers
    config.headers.set("X-Client-Timestamp", new Date().toISOString());

    // Client-side authentication token attach if token exists in localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("vexlora_token");
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }

      // Guest cart session ID header
      const sessionId = getCartSessionId();
      if (sessionId) {
        config.headers.set("x-session-id", sessionId);
      }
    }

    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || error.message || "An unexpected error occurred.";
      const errorSources = data?.errorSources;

      return Promise.reject(new ApiError(message, status, errorSources));
    }

    if (error.request) {
      // Network error / no response from server
      return Promise.reject(
        new ApiError("Unable to connect to the server. Please check your connection.", 0)
      );
    }

    return Promise.reject(new ApiError(error.message || "Request setup error", 500));
  }
);

/**
 * Convenient typed HTTP wrappers
 */
export const http = {
  get: async <T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> => {
    const res = await apiClient.get<ApiResponse<T>>(url, { params });
    return res.data;
  },

  post: async <T, B = unknown>(url: string, body?: B): Promise<ApiResponse<T>> => {
    const res = await apiClient.post<ApiResponse<T>>(url, body);
    return res.data;
  },

  put: async <T, B = unknown>(url: string, body?: B): Promise<ApiResponse<T>> => {
    const res = await apiClient.put<ApiResponse<T>>(url, body);
    return res.data;
  },

  patch: async <T, B = unknown>(url: string, body?: B): Promise<ApiResponse<T>> => {
    const res = await apiClient.patch<ApiResponse<T>>(url, body);
    return res.data;
  },

  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    const res = await apiClient.delete<ApiResponse<T>>(url);
    return res.data;
  },
};
