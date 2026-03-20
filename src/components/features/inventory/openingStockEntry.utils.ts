import { normalizeInventoryQuantity } from "@/lib/inventory-number";
import type { ImportOpeningStockInput } from "@/lib/zod-schemas/inventory";
import type { Ingredient } from "@/types/Inventory";

import type { OpeningStockEntryValues } from "./components/openingStockEntry.types";

export function buildOpeningStockEntryValues(ingredients: Ingredient[]): OpeningStockEntryValues {
  return ingredients.reduce<OpeningStockEntryValues>((acc, item) => {
    acc[item.ingredientId] = {
      quantity: normalizeInventoryQuantity(item.currentStock || 0),
      costPrice: normalizeInventoryQuantity(item.costPrice || 0, 2),
    };

    return acc;
  }, {});
}

export function mergeOpeningStockEntryValues(
  defaults: OpeningStockEntryValues,
  overrides: OpeningStockEntryValues
): OpeningStockEntryValues {
  return Object.entries(defaults).reduce<OpeningStockEntryValues>((acc, [ingredientId, value]) => {
    acc[ingredientId] = {
      quantity: normalizeInventoryQuantity(
        (overrides[ingredientId]?.quantity ?? value.quantity) || 0
      ),
      costPrice: normalizeInventoryQuantity(
        (overrides[ingredientId]?.costPrice ?? value.costPrice) || 0,
        2
      ),
    };

    return acc;
  }, {});
}

export function buildImportOpeningStockInput(
  entryItems: OpeningStockEntryValues,
  confirmOverwrite: boolean = false
): ImportOpeningStockInput {
  return {
    items: Object.entries(entryItems).reduce<ImportOpeningStockInput["items"]>(
      (acc, [id, value]) => {
        if (value.quantity > 0) {
          acc.push({
            ingredientId: id,
            initialQuantity: normalizeInventoryQuantity(value.quantity),
            costPrice: normalizeInventoryQuantity(value.costPrice, 2),
          });
        }

        return acc;
      },
      []
    ),
    confirmOverwrite,
  };
}
