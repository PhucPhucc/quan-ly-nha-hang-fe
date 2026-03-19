import { useQuery } from "@tanstack/react-query";
import { endOfMonth, startOfMonth } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { inventoryService } from "@/services/inventory.service";

export function useInventoryLedger() {
  const searchParams = useSearchParams();
  const initialIngredientId = searchParams.get("ingredientId") || undefined;
  const initialIngredientName = searchParams.get("name") || "";

  const [fromDate, setFromDate] = useState<Date>(() => startOfMonth(new Date()));
  const [toDate, setToDate] = useState<Date>(() => endOfMonth(new Date()));
  const [transactionType, setTransactionType] = useState<number | undefined>();
  const [ingredientId, setIngredientId] = useState<string | undefined>(initialIngredientId);
  const [ingredientName, setIngredientName] = useState(initialIngredientName);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["inventory-ledger", ingredientId, fromDate, toDate, transactionType],
    queryFn: () =>
      inventoryService.getInventoryLedger(
        ingredientId,
        fromDate.toISOString(),
        toDate.toISOString(),
        transactionType
      ),
    enabled: true,
  });

  const handleFromDateChange = useCallback((value: Date | undefined) => {
    if (!value) return;
    setFromDate(value);
    setToDate((previous) => (previous < value ? value : previous));
  }, []);

  const handleToDateChange = useCallback((value: Date | undefined) => {
    if (!value) return;
    setToDate(value);
    setFromDate((previous) => (previous > value ? value : previous));
  }, []);

  const handleIngredientChange = useCallback((id: string | undefined, name?: string) => {
    setIngredientId(id);
    setIngredientName(name ?? "");
  }, []);

  return {
    ledger: data?.data?.items || [],
    isLoading,
    isError,
    error,
    fromDate,
    toDate,
    setFromDate: handleFromDateChange,
    setToDate: handleToDateChange,
    transactionType,
    setTransactionType,
    ingredientId,
    ingredientName,
    setIngredient: handleIngredientChange,
  };
}
