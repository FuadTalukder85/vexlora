export type Role = "CUSTOMER" | "VENDOR" | "ADMIN" | "SUPER_ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED" | "SUSPENDED" | "BANNED";
export type VendorStatus = "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: Role;
  phone?: string | null;
  status: UserStatus;
  tenantId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorDocument {
  id?: string;
  type: string;
  url: string;
}

export interface VendorProfile {
  id: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  storeLogo?: string | null;
  storeBanner?: string | null;
  description?: string | null;
  bankAccountName?: string | null;
  bankAccountNumber?: string | null;
  bankName?: string | null;
  status: VendorStatus;
  commissionRate?: number;
  documents?: VendorDocument[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVendorProfilePayload {
  storeName: string;
  storeSlug?: string;
  storeLogo?: string;
  storeBanner?: string;
  description?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  documents?: VendorDocument[];
}
