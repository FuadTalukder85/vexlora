"use client";

import * as React from "react";
import Link from "next/link";
import { Star, ShieldCheck, Tag, Check, Store } from "lucide-react";
import { Product, ProductVariant } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import {
  extractAttributeDimensions,
  isOptionCombinationValid,
  isOptionInStock,
  resolveVariantSelection,
  isColorAttribute,
  normalizeAttr,
  AttributeDimension,
} from "@/lib/variants/variantEngine";

interface ProductInfoProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
  onScrollToReviews: () => void;
}

export function ProductInfo({
  product,
  selectedVariant,
  onVariantChange,
  onScrollToReviews,
}: ProductInfoProps) {
  const {
    title,
    brand,
    category,
    vendor,
    ratingAvg,
    ratingCount,
    basePrice,
    discountPrice,
    variants,
    tags,
  } = product;

  // Active price calculation
  const activePrice = selectedVariant
    ? selectedVariant.price
    : discountPrice
    ? Number(discountPrice)
    : Number(basePrice);

  const originalPrice = selectedVariant
    ? discountPrice
      ? Number(basePrice)
      : null
    : discountPrice
    ? Number(basePrice)
    : null;

  const discountPercent =
    originalPrice && originalPrice > activePrice
      ? Math.round(((originalPrice - activePrice) / originalPrice) * 100)
      : null;

  const savingsAmount =
    originalPrice && originalPrice > activePrice
      ? originalPrice - activePrice
      : 0;

  // Extract all dynamic attribute dimensions across variants (e.g. Color, Size, RAM, SSD, Material)
  const attributeDimensions = React.useMemo(() => {
    return extractAttributeDimensions(variants);
  }, [variants]);

  // Current selected attributes state
  const selectedAttributes = selectedVariant?.attributes || {};

  // Handle choosing a specific attribute value with matrix resolution
  const handleSelectAttribute = (key: string, value: string | number) => {
    if (!variants || variants.length === 0) return;

    const resolved = resolveVariantSelection(variants, selectedAttributes, key, value);
    if (resolved) {
      onVariantChange(resolved);
    }
  };

  const parsedRating = Number(ratingAvg) || 0;

  return (
    <div className="flex flex-col space-y-5">
      {/* 1. Category & Brand Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        {brand && (
          <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
            {brand}
          </span>
        )}
        {category && (
          <Link
            href={`/products?category=${category.slug}`}
            className="text-secondary hover:text-primary transition-colors flex items-center gap-1"
          >
            <span>in</span>
            <span className="underline underline-offset-2">{category.name}</span>
          </Link>
        )}
        {vendor && (
          <div className="flex items-center gap-1 text-slate-500 ml-auto text-[11px]">
            <Store className="w-3.5 h-3.5 text-primary" />
            <span>Store:</span>
            <span className="font-bold text-primary">{vendor.storeName}</span>
          </div>
        )}
      </div>

      {/* 2. Product Title (H1) */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-primary tracking-tight leading-snug">
        {title}
      </h1>

      {/* 3. Rating Summary & Reviews Link */}
      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm border-b border-slate-100 pb-4">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center text-amber-400 gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  parsedRating >= star
                    ? "fill-amber-400 text-amber-400"
                    : parsedRating >= star - 0.5
                    ? "fill-amber-400/50 text-amber-400"
                    : "text-slate-200 fill-slate-100"
                }`}
              />
            ))}
          </div>
          <span className="font-bold text-primary text-sm">
            {parsedRating.toFixed(1)}
          </span>
        </div>

        <span className="text-slate-300">|</span>

        <button
          type="button"
          onClick={onScrollToReviews}
          className="text-secondary hover:text-primary transition-colors font-medium underline underline-offset-2 cursor-pointer"
        >
          {ratingCount.toLocaleString()} {ratingCount === 1 ? "review" : "customer reviews"}
        </button>

        <span className="text-slate-300">|</span>

        <div className="flex items-center gap-1 text-emerald-600 font-semibold text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Merchant</span>
        </div>
      </div>

      {/* 4. Pricing Box */}
      <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-100/90 space-y-2">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary tracking-tight">
            {formatCurrency(activePrice)}
          </span>

          {originalPrice && originalPrice > activePrice && (
            <>
              <span className="text-base sm:text-lg font-semibold text-slate-400 line-through">
                {formatCurrency(originalPrice)}
              </span>
              {discountPercent && (
                <span className="bg-highlight text-white text-xs font-black px-2.5 py-1 rounded-md uppercase">
                  -{discountPercent}% OFF
                </span>
              )}
            </>
          )}
        </div>

        {savingsAmount > 0 && (
          <p className="text-xs font-bold text-emerald-700">
            You save: {formatCurrency(savingsAmount)} ({discountPercent}%)
          </p>
        )}

        <div className="flex items-center gap-2 pt-1 text-[11px] text-secondary">
          <span>Prices inclusive of all applicable VAT / local taxes</span>
        </div>
      </div>

      {/* 5. Dynamic Variant Selection (Any attributes: Color, Size, RAM, SSD, Material, etc.) */}
      {variants && variants.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-slate-100">
          {attributeDimensions.length > 0 ? (
            attributeDimensions.map(({ name: attrKey, values: uniqueValues }: AttributeDimension) => {
              const currentVal = selectedAttributes[attrKey];
              const isColorType = isColorAttribute(attrKey);

              return (
                <div key={attrKey} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-primary capitalize flex items-center gap-1.5">
                      <span>{attrKey}:</span>
                      {currentVal && (
                        <span className="text-slate-800 font-extrabold">{String(currentVal)}</span>
                      )}
                    </span>
                    {!currentVal && (
                      <span className="text-amber-600 font-medium text-[11px]">Required</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {uniqueValues.map((val: string) => {
                      const isSelected =
                        normalizeAttr(currentVal) === normalizeAttr(val);

                      const isValidCombo = isOptionCombinationValid(
                        variants,
                        selectedAttributes,
                        attrKey,
                        val
                      );

                      const isOptionStocked = isOptionInStock(
                        variants,
                        selectedAttributes,
                        attrKey,
                        val
                      );

                      if (isColorType) {
                        return (
                          <button
                            key={String(val)}
                            type="button"
                            onClick={() => handleSelectAttribute(attrKey, val)}
                            title={
                              !isOptionStocked
                                ? `${String(val)} (Out of stock)`
                                : !isValidCombo
                                ? `${String(val)} (Changes other options)`
                                : String(val)
                            }
                            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/25 shadow-xs font-bold"
                                : isValidCombo
                                ? "border-slate-200 hover:border-slate-400 text-slate-700 bg-white hover:bg-slate-50"
                                : "border-dashed border-slate-300 text-slate-500 bg-slate-50/50 hover:border-slate-400"
                            } ${!isOptionStocked ? "opacity-60" : ""}`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0 shadow-2xs"
                              style={{
                                backgroundColor: String(val).toLowerCase(),
                              }}
                            />
                            <span className={!isOptionStocked ? "line-through" : ""}>
                              {String(val)}
                            </span>
                            {isSelected && <Check className="w-3 h-3 text-primary ml-0.5" />}
                          </button>
                        );
                      }

                      return (
                        <button
                          key={String(val)}
                          type="button"
                          onClick={() => handleSelectAttribute(attrKey, val)}
                          title={
                            !isOptionStocked
                              ? `${String(val)} (Out of stock)`
                              : !isValidCombo
                              ? `${String(val)} (Changes other options)`
                              : String(val)
                          }
                          className={`min-w-[44px] px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                            isSelected
                              ? "border-primary bg-primary text-white font-bold shadow-xs ring-2 ring-primary/20"
                              : isValidCombo
                              ? "border-slate-200 hover:border-slate-400 text-primary bg-white hover:bg-slate-50 font-medium"
                              : "border-dashed border-slate-300 text-slate-500 bg-slate-50/60 hover:border-slate-400 font-normal"
                          } ${!isOptionStocked ? "opacity-60" : ""}`}
                        >
                          <span className={!isOptionStocked ? "line-through" : ""}>
                            {String(val)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            /* Direct Variant list when attributes are not named in key-value structure */
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary">Available Options:</span>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => onVariantChange(v)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedVariant?.id === v.id
                        ? "border-primary bg-primary text-white ring-2 ring-primary/20"
                        : "border-slate-200 hover:border-slate-300 text-primary bg-white"
                    } ${v.stock <= 0 ? "opacity-50 line-through" : ""}`}
                  >
                    {v.sku} - {formatCurrency(v.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active SKU and Real-Time Stock Status */}
          {selectedVariant && (
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
              <div className="font-mono">
                SKU: <span className="font-bold text-slate-700">{selectedVariant.sku}</span>
              </div>
              <div>
                {selectedVariant.stock > 0 ? (
                  selectedVariant.stock <= 5 ? (
                    <span className="text-amber-600 font-bold">
                      Only {selectedVariant.stock} left in stock!
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-semibold">
                      In Stock ({selectedVariant.stock} units)
                    </span>
                  )
                ) : (
                  <span className="text-rose-600 font-bold">Currently Out of Stock</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Tags chips */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 font-semibold text-[11px] px-2.5 py-1 rounded-lg"
            >
              <Tag className="w-3 h-3 text-slate-400" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
