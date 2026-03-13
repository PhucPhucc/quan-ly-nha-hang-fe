import type { ImportOpeningStockInput } from "@/lib/zod-schemas/inventory";
import type { Ingredient } from "@/types/Inventory";

import type { OpeningStockEntryValues } from "./components/openingStockEntry.types";

export function buildOpeningStockEntryValues(ingredients: Ingredient[]): OpeningStockEntryValues {
  return ingredients.reduce<OpeningStockEntryValues>((acc, item) => {
    acc[item.ingredientId] = {
      quantity: item.currentStock || 0,
      costPrice: item.costPrice || 0,
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
      ...value,
      ...overrides[ingredientId],
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
            initialQuantity: value.quantity,
            costPrice: value.costPrice,
          });
        }

        return acc;
      },
      []
    ),
    confirmOverwrite,
  };
}
