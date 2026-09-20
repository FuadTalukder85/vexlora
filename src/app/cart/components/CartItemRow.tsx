import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Bookmark,
  Trash2,
  AlertTriangle,
  Check,
  Minus,
  Plus,
} from "lucide-react";
import { CartItem } from "@/stores/cart.store";
import { formatCurrency } from "@/lib/utils";

interface CartItemRowProps {
  item: CartItem;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onToggleSaveForLater: (id: string, saved: boolean) => void;
}

export function CartItemRow({
  item,
  isSelected,
  onToggleSelect,
  onUpdateQuantity,
  onRemoveItem,
  onToggleSaveForLater,
}: CartItemRowProps) {
  const itemTotal = item.price * item.quantity;

  return (
    <div
      className={`py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors ${
        !isSelected ? "opacity-75" : ""
      }`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        disabled={item.isOutOfStock || item.isUnavailable}
        onChange={() => onToggleSelect(item.id)}
        className="h-4 w-4 rounded-md border-slate-300 text-primary focus:ring-primary accent-primary cursor-pointer mt-1 sm:mt-0"
        aria-label={`Select ${item.title}`}
      />

      {/* Product Thumbnail */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center p-2">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="96px"
            className="object-contain p-1"
          />
        ) : (
          <ShoppingBag className="h-8 w-8 text-slate-300" />
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.slug || item.productId}`}
          className="text-sm sm:text-base font-bold text-primary hover:underline line-clamp-2"
        >
          {item.title}
        </Link>

        {/* Attributes */}
        {item.attributes && (
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.entries(item.attributes).map(([k, v]) => (
              <span
                key={k}
                className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
              >
                {k}: {String(v)}
              </span>
            ))}
          </div>
        )}

        {/* Status Badges */}
        {item.isOutOfStock ? (
          <p className="text-xs font-bold text-rose-600 flex items-center gap-1 mt-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            Out of Stock
          </p>
        ) : item.isPriceChanged ? (
          <p className="text-xs font-bold text-amber-600 flex items-center gap-1 mt-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            Price updated
          </p>
        ) : (
          <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-1">
            <Check className="h-3 w-3" />
            In Stock
          </p>
        )}

        {/* Actions: Save for later & Delete */}
        <div className="flex items-center gap-4 mt-3">
          <button
            type="button"
            onClick={() => onToggleSaveForLater(item.id, true)}
            className="text-xs font-medium text-slate-500 hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Save for later</span>
          </button>

          <button
            type="button"
            onClick={() => onRemoveItem(item.id)}
            className="text-xs font-medium text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Stepper & Price Column */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0">
        <span className="text-base font-extrabold text-primary">
          {formatCurrency(itemTotal)}
        </span>

        {/* Quantity Stepper */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-l-xl cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-10 text-center text-xs font-bold text-primary">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-r-xl cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
