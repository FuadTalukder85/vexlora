import * as React from "react";
import { Plus, MapPin, CheckCircle2 } from "lucide-react";
import { Address } from "@/lib/api/addresses";

interface ShippingAddressSectionProps {
  addresses: Address[];
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
  onOpenAddAddress: () => void;
}

export function ShippingAddressSection({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onOpenAddAddress,
}: ShippingAddressSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h2 className="text-base font-bold text-primary">
            Shipping Delivery Address
          </h2>
        </div>

        <button
          type="button"
          onClick={onOpenAddAddress}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add New Address</span>
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-border rounded-xl bg-muted/50">
          <MapPin className="h-8 w-8 text-secondary mx-auto mb-2 opacity-50" />
          <p className="text-xs text-secondary mb-3 font-medium">
            No shipping addresses found on your account.
          </p>
          <button
            type="button"
            onClick={onOpenAddAddress}
            className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all cursor-pointer"
          >
            Add Shipping Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addresses.map((addr) => {
            const isSelected = selectedAddressId === addr.id;
            return (
              <div
                key={addr.id}
                onClick={() => onSelectAddress(addr.id)}
                className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-2xs"
                    : "border-border bg-white hover:border-border"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-primary">
                      {addr.label || "Address"}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted text-secondary">
                        Default
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  )}
                </div>

                <p className="text-xs text-primary mt-2 font-medium">
                  {addr.street}
                </p>
                <p className="text-xs text-secondary mt-0.5">
                  {addr.city}, {addr.zip}
                </p>
                {addr.phone && (
                  <p className="text-[11px] text-secondary mt-1">
                    Phone: {addr.phone}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
