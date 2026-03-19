import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { normalizeInventoryQuantity } from "@/lib/inventory-number";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import type { Ingredient, InventorySettings } from "@/types/Inventory";

import type { OpeningStockEntryValues } from "./components/openingStockEntry.types";
import {
  buildOpeningStockEntryValues,
  mergeOpeningStockEntryValues,
} from "./openingStockEntry.utils";

const { OPENING_STOCK } = UI_TEXT.INVENTORY;
const EMPTY_INGREDIENTS: Ingredient[] = [];
const COMPLETED_OPENING_STOCK_STATUS = 2;

function isOpeningStockLocked(settings?: InventorySettings | null) {
  if (!settings) {
    return false;
  }

  return (
    !!settings.lockedAt ||
    settings.openingStockStatus === COMPLETED_OPENING_STOCK_STATUS ||
    settings.openingStockStatus === "Completed"
  );
}

export function useOpeningStockIngredients() {
  const [search, setSearch] = useState("");
  const [entryOverrides, setEntryOverrides] = useState<OpeningStockEntryValues>({});

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["opening-stock-ingredients"],
    queryFn: async () => {
      const response = await inventoryService.getIngredients(1, 100);

      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || OPENING_STOCK.ERROR_FETCH);
      }

      return response.data.items.filter((item) => item.isActive);
    },
  });
  const {
    data: settings,
    isLoading: isSettingsLoading,
    isError: isSettingsError,
    error: settingsError,
  } = useQuery({
    queryKey: ["inventory-settings"],
    queryFn: async () => {
      const response = await inventoryService.getInventorySettings();

      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || OPENING_STOCK.ERROR_FETCH);
      }

      return response.data;
    },
  });

  const ingredients = data ?? EMPTY_INGREDIENTS;
  const defaultEntryItems = useMemo(() => buildOpeningStockEntryValues(ingredients), [ingredients]);
  const entryItems = useMemo(
    () => mergeOpeningStockEntryValues(defaultEntryItems, entryOverrides),
    [defaultEntryItems, entryOverrides]
  );

  const filteredIngredients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return ingredients;
    }

    return ingredients.filter(
      (item) =>
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.code.toLowerCase().includes(normalizedSearch)
    );
  }, [ingredients, search]);

  const totalValue = useMemo(
    () =>
      normalizeInventoryQuantity(
        Object.values(entryItems).reduce((sum, item) => sum + item.quantity * item.costPrice, 0),
        2
      ),
    [entryItems]
  );

  const handleInputChange = (id: string, field: "quantity" | "costPrice", value: string) => {
    if (isOpeningStockLocked(settings)) {
      return;
    }

    const parsedValue = Number.parseFloat(value);
    const nextValue = Number.isFinite(parsedValue)
      ? normalizeInventoryQuantity(parsedValue, field === "costPrice" ? 2 : 3)
      : 0;

    setEntryOverrides((prev) => ({
      ...prev,
      [id]: {
        ...entryItems[id],
        [field]: nextValue,
      },
    }));
  };

  return {
    search,
    setSearch,
    ingredients,
    filteredIngredients,
    entryItems,
    totalValue,
    loading: isLoading || isSettingsLoading,
    isError: isError || isSettingsError,
    error: error ?? settingsError,
    isLocked: isOpeningStockLocked(settings),
    lockedAt: settings?.lockedAt ?? null,
    handleInputChange,
  };
}
