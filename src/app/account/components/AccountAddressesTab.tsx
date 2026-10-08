"use client";

import React, { useState } from "react";
import {
  MapPin,
  Plus,
  Trash2,
  Home,
  Briefcase,
  Building,
  Star,
} from "lucide-react";
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/useAddresses";
import { CreateAddressPayload } from "@/lib/api/addresses";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Phone, MapPin as PinIcon } from "lucide-react";

export const AccountAddressesTab: React.FC = () => {
  const { data: addresses, isLoading } = useAddresses();
  const createAddressMutation = useCreateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const setDefaultAddressMutation = useSetDefaultAddress();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateAddressPayload>({
    label: "Home",
    street: "",
    city: "",
    zip: "",
    phone: "",
    isDefault: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.street || !formData.city || !formData.zip) return;

    await createAddressMutation.mutateAsync(formData);
    setIsModalOpen(false);
    setFormData({
      label: "Home",
      street: "",
      city: "",
      zip: "",
      phone: "",
      isDefault: false,
    });
  };

  const getLabelIcon = (label?: string | null) => {
    const l = (label || "").toLowerCase();
    if (l.includes("work") || l.includes("office")) {
      return <Briefcase className="w-4 h-4 text-primary" />;
    }
    if (l.includes("apartment") || l.includes("building")) {
      return <Building className="w-4 h-4 text-primary" />;
    }
    return <Home className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="space-y-6 text-[14px]">
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-primary">Shipping Addresses</h3>
          <p className="text-[14px] text-secondary">
            Manage your saved delivery locations for fast 1-click checkout
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          className="self-start sm:self-auto text-[14px] font-bold"
        >
          Add New Address
        </Button>
      </div>

      {/* Address cards list */}
      {isLoading ? (
        <div className="py-16 text-center text-secondary bg-white rounded-3xl border border-border">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[14px] font-bold text-primary">Loading addresses...</p>
        </div>
      ) : !addresses || addresses.length === 0 ? (
        <div className="py-16 text-center text-secondary bg-white rounded-3xl border border-border px-4">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h4 className="text-base font-bold text-primary">No addresses saved</h4>
          <p className="text-[14px] text-secondary mt-1 mb-4 max-w-sm mx-auto">
            Save your home or office address now for faster delivery and accurate shipping rates.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            className="text-[14px] font-bold"
          >
            Add First Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-3xl border p-5.5 flex flex-col justify-between transition-all duration-200 ${
                addr.isDefault
                  ? "border-primary/50 shadow-sm ring-1 ring-primary/20"
                  : "border-border shadow-xs hover:border-primary/30"
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                      {getLabelIcon(addr.label)}
                    </div>
                    <span className="text-[14px] font-bold text-primary">
                      {addr.label || "Address"}
                    </span>
                  </div>

                  {addr.isDefault ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                      Default
                    </span>
                  ) : (
                    <button
                      onClick={() => setDefaultAddressMutation.mutate(addr.id)}
                      disabled={setDefaultAddressMutation.isPending}
                      className="text-xs font-bold text-secondary hover:text-primary transition-colors cursor-pointer"
                    >
                      Set as Default
                    </button>
                  )}
                </div>

                <div className="mt-4 space-y-1 text-[14px]">
                  <p className="text-primary font-bold text-base">{addr.street}</p>
                  <p className="text-secondary">
                    {addr.city}, {addr.zip}
                  </p>
                  {addr.phone && (
                    <p className="text-secondary text-xs pt-1">
                      Phone: <span className="text-primary font-semibold">{addr.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Saved Address
                </span>
                <button
                  onClick={() => deleteAddressMutation.mutate(addr.id)}
                  disabled={deleteAddressMutation.isPending}
                  className="p-1.5 text-secondary hover:text-highlight hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Prebuilt Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Delivery Address"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateAddress} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Address Label"
              name="label"
              value={formData.label || "Home"}
              onChange={handleInputChange}
              options={[
                { value: "Home", label: "Home" },
                { value: "Work / Office", label: "Work / Office" },
                { value: "Apartment", label: "Apartment" },
                { value: "Other", label: "Other" },
              ]}
            />

            <Input
              label="Contact Phone"
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Street Address *"
            type="text"
            name="street"
            required
            value={formData.street}
            onChange={handleInputChange}
            placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
            leftIcon={<PinIcon className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City *"
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
            />

            <Input
              label="Postal / ZIP Code *"
              type="text"
              name="zip"
              required
              value={formData.zip}
              onChange={handleInputChange}
              placeholder="ZIP Code"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              className="w-4 h-4 rounded text-primary border-border focus:ring-primary/20 cursor-pointer"
            />
            <label htmlFor="isDefault" className="text-[14px] font-medium text-primary cursor-pointer">
              Set as default shipping address
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={createAddressMutation.isPending}
            >
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
