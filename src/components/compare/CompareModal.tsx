"use client";

import React from "react";
import { useCompareStore } from "@/stores/compare.store";
import { useCartStore } from "@/stores/cart.store";
import { Product } from "@/types/product";
import { AlertCircle, ArrowLeftRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { CompareTableMatrix } from "./CompareTableMatrix";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCompare, clearCompare } = useCompareStore();
  const { addItem } = useCartStore();

  const handleAddToCart = async (product: Product) => {
    try {
      const price = Number(product.discountPrice ?? product.basePrice);
      await addItem({
        id: product.id,
        productId: product.id,
        vendorId: product.vendorId,
        vendorName: product.vendor?.storeName || "Vendor Store",
        title: product.title,
        slug: product.slug,
        price,
        image: product.images?.[0] || null,
      });
      toast.success(`Added "${product.title}" to cart`);
    } catch {
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="6xl"
      title="Product Comparison"
    >
      <div className="space-y-4">
        {items.length > 0 && (
          <div className="flex justify-end pb-2 border-b border-border">
            <button
              onClick={() => {
                clearCompare();
                onClose();
              }}
              className="text-xs text-secondary hover:text-highlight px-3 py-1.5 rounded-lg hover:bg-highlight/10 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All Items
            </button>
          </div>
        )}

        {/* Content Body / Matrix */}
        {items.length === 0 ? (
          <div className="py-20 text-center px-4">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-bold text-primary">No products to compare</p>
            <p className="text-sm text-secondary mt-1">
              Add up to 4 items from our catalog to see a detailed spec comparison.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 cursor-pointer"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <CompareTableMatrix
            items={items}
            onRemoveItem={removeFromCompare}
            onAddToCart={handleAddToCart}
            onSelectProduct={onClose}
          />
        )}
      </div>
    </Modal>
  );
};
