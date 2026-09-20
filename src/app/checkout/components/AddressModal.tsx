import * as React from "react";
import { X, Loader2 } from "lucide-react";
import { CreateAddressPayload } from "@/lib/api/addresses";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  newAddress: CreateAddressPayload;
  setNewAddress: React.Dispatch<React.SetStateAction<CreateAddressPayload>>;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
}

export function AddressModal({
  isOpen,
  onClose,
  newAddress,
  setNewAddress,
  onSubmit,
  isSaving,
}: AddressModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-primary">
            Add New Delivery Address
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-primary p-1 rounded-md cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-primary mb-1">
              Address Label
            </label>
            <input
              type="text"
              value={newAddress.label || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, label: e.target.value })
              }
              placeholder="e.g. Home, Office, Apartment"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-primary mb-1">
              Street Address *
            </label>
            <input
              type="text"
              required
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
              placeholder="Street name, house number, building"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-primary mb-1">
                City / Area *
              </label>
              <input
                type="text"
                required
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                placeholder="City"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-primary focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-primary mb-1">
                Postal / Zip Code *
              </label>
              <input
                type="text"
                required
                value={newAddress.zip}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, zip: e.target.value })
                }
                placeholder="Zip code"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-primary mb-1">
              Recipient Contact Phone
            </label>
            <input
              type="tel"
              value={newAddress.phone || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, phone: e.target.value })
              }
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-secondary hover:bg-slate-50 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Address</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
