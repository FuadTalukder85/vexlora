import * as React from "react";
import { Store } from "lucide-react";
import { CartItem } from "@/stores/cart.store";
import { ApiVendorGroup } from "@/lib/api/cart";
import { formatCurrency } from "@/lib/utils";
import { CartItemRow } from "./CartItemRow";

interface CartVendorGroupListProps {
  activeItems: CartItem[];
  vendorGroups: ApiVendorGroup[];
  selectedItemIds: string[];
  isAllSelected: boolean;
  selectedCount: number;
  onSelectAll: (checked: boolean) => void;
  onToggleSelectVendor: (vendorId: string) => void;
  onToggleSelectItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onToggleSaveForLater: (id: string, saved: boolean) => void;
}

export function CartVendorGroupList({
  activeItems,
  vendorGroups,
  selectedItemIds,
  isAllSelected,
  selectedCount,
  onSelectAll,
  onToggleSelectVendor,
  onToggleSelectItem,
  onUpdateQuantity,
  onRemoveItem,
  onToggleSaveForLater,
}: CartVendorGroupListProps) {
  return (
    <div className="space-y-6">
      {/* Global Select All Bar */}
      {activeItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-2xs">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="h-4 w-4 rounded-md border-slate-300 text-primary focus:ring-primary accent-primary cursor-pointer"
            />
            <span className="text-sm font-bold text-primary">
              Select all items ({activeItems.length})
            </span>
          </label>

          <span className="text-xs font-medium text-slate-500">
            {selectedCount} of {activeItems.length} selected
          </span>
        </div>
      )}

      {/* Vendor Grouped Items */}
      {vendorGroups && vendorGroups.length > 0 ? (
        vendorGroups.map((group) => {
          const groupItems = group.items.filter((i) => !i.savedForLater);
          if (groupItems.length === 0) return null;

          const allGroupSelected = groupItems.every((it) =>
            selectedItemIds.includes(it.id)
          );

          // Find full CartItem objects matching the group items
          const fullGroupItems: CartItem[] = groupItems.map((gi) => {
            const found = activeItems.find((ai) => ai.id === gi.id);
            return (
              found || {
                id: gi.id,
                productId: gi.productId,
                variantId: gi.variantId,
                vendorId: gi.vendorId,
                vendorName: group.storeName,
                title: gi.title,
                slug: gi.slug,
                price: gi.currentPrice,
                quantity: gi.quantity,
                image: gi.image,
                attributes: gi.variantAttributes as Record<string, string> | null,
                isPriceChanged: gi.isPriceChanged,
                isOutOfStock: gi.isOutOfStock,
                isUnavailable: gi.isUnavailable,
                availableStock: gi.availableStock,
                savedForLater: gi.savedForLater,
              }
            );
          });

          return (
            <div
              key={group.vendorId}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs"
            >
              {/* Vendor Header */}
              <div className="bg-slate-50/70 px-6 py-3.5 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={allGroupSelected}
                    onChange={() => onToggleSelectVendor(group.vendorId)}
                    className="h-4 w-4 rounded-md border-slate-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                    aria-label={`Select all items from ${group.storeName}`}
                  />
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-primary">
                      {group.storeName}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-500">
                  Package Subtotal: {formatCurrency(group.subtotal)}
                </span>
              </div>

              {/* Vendor Item Rows */}
              <div className="divide-y divide-slate-100 px-6">
                {fullGroupItems.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    isSelected={selectedItemIds.includes(item.id)}
                    onToggleSelect={onToggleSelectItem}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                    onToggleSaveForLater={onToggleSaveForLater}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        /* Fallback list if vendor grouping not yet loaded */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 divide-y divide-slate-100">
          {activeItems.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              isSelected={selectedItemIds.includes(item.id)}
              onToggleSelect={onToggleSelectItem}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
              onToggleSaveForLater={onToggleSaveForLater}
            />
          ))}
        </div>
      )}
    </div>
  );
}
