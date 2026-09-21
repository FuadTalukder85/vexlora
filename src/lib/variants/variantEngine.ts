import { ProductVariant } from "@/types/product";

export interface AttributeDimension {
  name: string;
  values: string[];
}

/**
 * Normalizes attribute key/value strings for case-insensitive comparison
 */
export const normalizeAttr = (val: string | number | undefined | null): string => {
  if (val === undefined || val === null) return "";
  return String(val).trim().toLowerCase();
};

/**
 * Extracts all unique attribute dimensions and their available values across all variants of a product.
 * Returns an array of dimensions in the order they appear.
 */
export function extractAttributeDimensions(variants?: ProductVariant[]): AttributeDimension[] {
  if (!variants || variants.length === 0) return [];

  const dimensionMap = new Map<string, Set<string>>();

  for (const variant of variants) {
    if (!variant.attributes || typeof variant.attributes !== "object") continue;

    for (const [key, value] of Object.entries(variant.attributes)) {
      if (value === undefined || value === null || value === "") continue;

      const trimmedKey = key.trim();
      const stringVal = String(value).trim();

      if (!dimensionMap.has(trimmedKey)) {
        dimensionMap.set(trimmedKey, new Set<string>());
      }
      dimensionMap.get(trimmedKey)!.add(stringVal);
    }
  }

  return Array.from(dimensionMap.entries()).map(([name, valSet]) => ({
    name,
    values: Array.from(valSet),
  }));
}

/**
 * Finds the exact variant that matches the specified selected attributes dictionary.
 */
export function findMatchingVariant(
  variants: ProductVariant[] | undefined,
  selectedAttributes: Record<string, string | number>
): ProductVariant | null {
  if (!variants || variants.length === 0) return null;

  const targetKeys = Object.keys(selectedAttributes);
  if (targetKeys.length === 0) return variants[0] || null;

  return (
    variants.find((variant) => {
      if (!variant.attributes) return false;

      // Check if all selected attributes match this variant
      return targetKeys.every((key) => {
        const selectedVal = normalizeAttr(selectedAttributes[key]);
        const variantVal = normalizeAttr(variant.attributes?.[key]);
        return selectedVal === variantVal;
      });
    }) || null
  );
}

/**
 * Determines whether a specific option value exists for an attribute given the other currently selected attributes.
 */
export function isOptionCombinationValid(
  variants: ProductVariant[] | undefined,
  currentAttributes: Record<string, string | number>,
  attrKey: string,
  optionValue: string | number
): boolean {
  if (!variants || variants.length === 0) return true;

  // Check if at least one variant matches the tested option and other compatible attributes
  return variants.some((variant) => {
    if (!variant.attributes) return false;

    // Check match for this specific attribute
    if (normalizeAttr(variant.attributes[attrKey]) !== normalizeAttr(optionValue)) {
      return false;
    }

    // Check if other current attributes can match or exist in this variant
    for (const [otherKey, otherVal] of Object.entries(currentAttributes)) {
      if (otherKey === attrKey) continue;
      if (variant.attributes[otherKey] !== undefined) {
        if (normalizeAttr(variant.attributes[otherKey]) !== normalizeAttr(otherVal)) {
          return false;
        }
      }
    }

    return true;
  });
}

/**
 * Checks whether any variant matching the tested option is currently in stock (stock > 0).
 */
export function isOptionInStock(
  variants: ProductVariant[] | undefined,
  currentAttributes: Record<string, string | number>,
  attrKey: string,
  optionValue: string | number
): boolean {
  if (!variants || variants.length === 0) return true;

  // First try to check in combination with current other selections
  const matchingCombinedVariants = variants.filter((variant) => {
    if (!variant.attributes) return false;
    if (normalizeAttr(variant.attributes[attrKey]) !== normalizeAttr(optionValue)) return false;

    for (const [otherKey, otherVal] of Object.entries(currentAttributes)) {
      if (otherKey === attrKey) continue;
      if (variant.attributes[otherKey] !== undefined) {
        if (normalizeAttr(variant.attributes[otherKey]) !== normalizeAttr(otherVal)) {
          return false;
        }
      }
    }
    return true;
  });

  if (matchingCombinedVariants.length > 0) {
    return matchingCombinedVariants.some((v) => v.stock > 0);
  }

  // Fallback: check if ANY variant with this option value has stock > 0
  const anyMatchingVariants = variants.filter(
    (v) => v.attributes && normalizeAttr(v.attributes[attrKey]) === normalizeAttr(optionValue)
  );
  return anyMatchingVariants.some((v) => v.stock > 0);
}

/**
 * Intelligently resolves the best matching variant when a customer selects a new attribute value.
 * If the exact combination exists, it returns that variant.
 * If it doesn't exist (e.g. user selected RAM 16GB + SSD 1TB, but 1TB is only available with 32GB RAM),
 * it finds the closest valid variant that has the newly chosen attribute value (preferring in-stock options).
 */
export function resolveVariantSelection(
  variants: ProductVariant[] | undefined,
  currentAttributes: Record<string, string | number>,
  changedKey: string,
  newValue: string | number
): ProductVariant | null {
  if (!variants || variants.length === 0) return null;

  const targetAttributes = {
    ...currentAttributes,
    [changedKey]: newValue,
  };

  // 1. Direct exact match
  const exactMatch = findMatchingVariant(variants, targetAttributes);
  if (exactMatch) return exactMatch;

  // 2. Find variants that have the newly clicked option value
  const candidates = variants.filter((v) => {
    if (!v.attributes) return false;
    return normalizeAttr(v.attributes[changedKey]) === normalizeAttr(newValue);
  });

  if (candidates.length === 0) {
    // If somehow no variant matches this option, fallback to first in-stock variant or first variant
    return variants.find((v) => v.stock > 0) || variants[0] || null;
  }

  // 3. Score candidates by how many of the other currently selected attributes they preserve
  let bestCandidate: ProductVariant = candidates[0];
  let maxScore = -1;

  for (const candidate of candidates) {
    let score = 0;
    if (candidate.stock > 0) score += 10; // Prefer in-stock variant

    if (candidate.attributes) {
      for (const [key, val] of Object.entries(currentAttributes)) {
        if (key === changedKey) continue;
        if (normalizeAttr(candidate.attributes[key]) === normalizeAttr(val)) {
          score += 1;
        }
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestCandidate = candidate;
    }
  }

  return bestCandidate;
}

/**
 * Checks if an attribute key is likely a color attribute (for rendering color swatches).
 */
export function isColorAttribute(attrKey: string): boolean {
  const normalized = attrKey.toLowerCase().trim();
  return (
    normalized === "color" ||
    normalized === "colour" ||
    normalized.includes("color") ||
    normalized.includes("colour") ||
    normalized.includes("shade") ||
    normalized.includes("hue")
  );
}
