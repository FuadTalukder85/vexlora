import { http } from "./client";
import { ApiResponse } from "./types";
import { Product, ProductSearchParams } from "@/types/product";

export const getProducts = async (
  params: ProductSearchParams
): Promise<ApiResponse<Product[]>> => {
  const queryParams: Record<string, unknown> = {};

  // Search keyword
  const keyword = params.q || params.searchTerm;
  if (keyword) {
    queryParams.searchTerm = keyword;
  }

  // Category filter
  if (params.categoryId) {
    queryParams.categoryId = params.categoryId;
  } else if (params.category && params.category !== "all") {
    // If slug is provided, search or filter by category
    queryParams.categoryId = params.category;
  }

  // Brand filter
  if (params.brand && params.brand !== "all") {
    queryParams.brand = params.brand;
  }

  // Price range filters
  if (params.minPrice !== undefined && params.minPrice !== "") {
    queryParams.minPrice = Number(params.minPrice);
  }
  if (params.maxPrice !== undefined && params.maxPrice !== "") {
    queryParams.maxPrice = Number(params.maxPrice);
  }

  // Sorting
  if (params.sortBy) {
    queryParams.sortBy = params.sortBy;
  }
  if (params.sortOrder) {
    queryParams.sortOrder = params.sortOrder;
  }

  // Cursor & limit
  if (params.cursor && typeof params.cursor === "string" && params.cursor.trim() !== "") {
    queryParams.cursor = params.cursor.trim();
  }
  if (params.limit) {
    queryParams.limit = params.limit;
  }

  return await http.get<Product[]>("/products", queryParams);
};

export const getProductBySlug = async (slugOrId: string): Promise<ApiResponse<Product>> => {
  try {
    return await http.get<Product>(`/products/slug/${encodeURIComponent(slugOrId)}`);
  } catch (err: unknown) {
    // If slug endpoint returns 404, fallback to /products/:id
    if (typeof err === "object" && err !== null && "statusCode" in err && (err as { statusCode: number }).statusCode === 404) {
      return await http.get<Product>(`/products/${encodeURIComponent(slugOrId)}`);
    }
    throw err;
  }
};

export const getRelatedProducts = async (
  categoryId?: string | null,
  excludeProductId?: string,
  limit: number = 6
): Promise<ApiResponse<Product[]>> => {
  const params: Record<string, unknown> = { limit };
  if (categoryId) {
    params.categoryId = categoryId;
  }
  const res = await http.get<Product[]>("/products", params);
  if (res.data && excludeProductId) {
    res.data = res.data.filter((p) => p.id !== excludeProductId);
  }
  return res;
};

