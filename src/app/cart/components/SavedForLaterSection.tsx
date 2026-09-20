import * as React from "react";
import Image from "next/image";
import { BookmarkCheck } from "lucide-react";
import { ApiCartItem } from "@/lib/api/cart";
import { formatCurrency } from "@/lib/utils";

interface SavedForLaterSectionProps {
  savedForLater: ApiCartItem[];
  onMoveToCart: (id: string) => void;
  onRemoveItem: (id: string) => void;
}

export function SavedForLaterSection({
  savedForLater,
  onMoveToCart,
  onRemoveItem,
}: SavedForLaterSectionProps) {
  if (!savedForLater || savedForLater.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs mt-8">
      <div className="flex items-center gap-2 mb-4">
        <BookmarkCheck className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-primary">
          Saved for Later ({savedForLater.length})
        </h2>
      </div>

      <div className="divide-y divide-slate-100">
        {savedForLater.map((item) => (
          <div
            key={item.id}
            className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-primary line-clamp-1">
                  {item.title}
                </h4>
                <span className="text-xs font-bold text-primary">
                  {formatCurrency(item.currentPrice)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onMoveToCart(item.id)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-primary text-xs font-bold hover:bg-slate-50 hover:border-primary transition-colors cursor-pointer"
              >
                Move to Cart
              </button>
              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
