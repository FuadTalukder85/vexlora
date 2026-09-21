import * as React from "react";
import Image from "next/image";
import { Store, ShoppingBag } from "lucide-react";
import { ApiVendorGroup } from "@/lib/api/cart";
import { formatCurrency } from "@/lib/utils";

interface VendorOrderReviewSectionProps {
  vendorGroups: ApiVendorGroup[];
  selectedItemIds: string[];
  selectedCount: number;
}

export function VendorOrderReviewSection({
  vendorGroups,
  selectedItemIds,
  selectedCount,
}: VendorOrderReviewSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-2xs">
      <div className="flex items-center gap-2.5 pb-4 border-b border-border mb-4">
        <div className="h-7 w-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
          3
        </div>
        <h2 className="text-base font-bold text-primary">
          Review Multi-Vendor Packages ({selectedCount} items)
        </h2>
      </div>

      {vendorGroups.map((group) => {
        const groupSelectedItems = group.items.filter((it) =>
          selectedItemIds.includes(it.id)
        );
        if (groupSelectedItems.length === 0) return null;

        return (
          <div
            key={group.vendorId}
            className="mb-4 last:mb-0 border border-border rounded-xl overflow-hidden"
          >
            <div className="bg-muted px-4 py-2.5 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Store className="h-3.5 w-3.5" />
                <span>Package fulfilled by: {group.storeName}</span>
              </div>
              <span className="text-[11px] text-secondary font-medium">
                Standard Shipping
              </span>
            </div>

            <div className="divide-y divide-slate-100 px-4 py-2">
              {groupSelectedItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 rounded-lg bg-muted border border-border overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="56px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-secondary/60" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary line-clamp-1 max-w-xs">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-secondary">
                        Qty: {item.quantity} × {formatCurrency(item.currentPrice)}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-primary">
                    {formatCurrency(item.currentPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
