/**
 * Centralized Query Key Factory for TanStack Query
 * Ensures predictable cache invalidation and query deduplication across the app
 */
export const queryKeys = {
  // Categories
  categories: {
    all: ["categories"] as const,
    list: () => [...queryKeys.categories.all, "list"] as const,
    detail: (id: string) => [...queryKeys.categories.all, "detail", id] as const,
  },

  // Products
  products: {
    all: ["products"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.products.all, "list", filters ?? {}] as const,
    detail: (slugOrId: string) =>
      [...queryKeys.products.all, "detail", slugOrId] as const,
    featured: () => [...queryKeys.products.all, "featured"] as const,
    search: (query: string) => [...queryKeys.products.all, "search", query] as const,
  },

  // Vendors
  vendors: {
    all: ["vendors"] as const,
    list: () => [...queryKeys.vendors.all, "list"] as const,
    detail: (id: string) => [...queryKeys.vendors.all, "detail", id] as const,
  },

  // User Profile & Authentication
  auth: {
    session: ["auth", "session"] as const,
    user: ["auth", "user"] as const,
    addresses: ["auth", "addresses"] as const,
  },

  // Orders
  orders: {
    all: ["orders"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.orders.all, "list", params ?? {}] as const,
    detail: (id: string) => [...queryKeys.orders.all, "detail", id] as const,
  },

  // Wishlist
  wishlist: {
    all: ["wishlist"] as const,
  },

  // Coupons
  coupons: {
    validate: (code: string) => ["coupons", "validate", code] as const,
  },

  // Cart
  cart: {
    all: ["cart"] as const,
  },
} as const;
