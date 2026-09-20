import { http } from "./client";

export interface Address {
  id: string;
  userId: string;
  label?: string | null;
  street: string;
  city: string;
  zip: string;
  phone?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressPayload {
  label?: string;
  street: string;
  city: string;
  zip: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UpdateAddressPayload {
  label?: string;
  street?: string;
  city?: string;
  zip?: string;
  phone?: string;
  isDefault?: boolean;
}

export const addressApi = {
  getMyAddresses: async () => {
    const res = await http.get<Address[]>("/addresses/my-addresses");
    return res.data;
  },

  getAddressById: async (id: string) => {
    const res = await http.get<Address>(`/addresses/${id}`);
    return res.data;
  },

  createAddress: async (payload: CreateAddressPayload) => {
    const res = await http.post<Address, CreateAddressPayload>("/addresses", payload);
    return res.data;
  },

  updateAddress: async (id: string, payload: UpdateAddressPayload) => {
    const res = await http.patch<Address, UpdateAddressPayload>(`/addresses/${id}`, payload);
    return res.data;
  },

  setDefaultAddress: async (id: string) => {
    const res = await http.patch<Address>(`/addresses/${id}/set-default`);
    return res.data;
  },

  deleteAddress: async (id: string) => {
    const res = await http.delete<{ id: string }>(`/addresses/${id}`);
    return res.data;
  },
};
