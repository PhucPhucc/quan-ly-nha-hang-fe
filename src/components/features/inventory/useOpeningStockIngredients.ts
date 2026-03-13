import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import type { Ingredient } from "@/types/Inventory";

import type { OpeningStockEntryValues } from "./components/openingStockEntry.types";
import {
  buildOpeningStockEntryValues,
  mergeOpeningStockEntryValues,
} from "./openingStockEntry.utils";

const { OPENING_STOCK } = UI_TEXT.INVENTORY;
const EMPTY_INGREDIENTS: Ingredient[] = [];

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
    () => Object.values(entryItems).reduce((sum, item) => sum + item.quantity * item.costPrice, 0),
    [entryItems]
  );

  const handleInputChange = (id: string, field: "quantity" | "costPrice", value: string) => {
    const parsedValue = Number.parseFloat(value);
    const nextValue = Number.isFinite(parsedValue) ? parsedValue : 0;

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
    filteredIngredients,
    entryItems,
    totalValue,
    loading: isLoading,
    isError,
    error,
    handleInputChange,
  };
}
