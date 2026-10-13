import { apiClient } from "./client";
import { ApiResponse } from "./types";
import { Category } from "@/types/category";

export const getCategoryTree = async (): Promise<ApiResponse<Category[]>> => {
  const response = await apiClient.get<ApiResponse<Category[]>>("/categories/tree");
  return response.data;
};

export const getCategories = async (
  params?: Record<string, unknown>
): Promise<ApiResponse<Category[]>> => {
  const response = await apiClient.get<ApiResponse<Category[]>>("/categories", {
    params,
  });
  return response.data;
};
