import { useQuery } from "@tanstack/react-query";
import { endOfMonth, startOfMonth } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { DateRange } from "react-day-picker";

import { inventoryService } from "@/services/inventory.service";

export function useInventoryLedger() {
  const searchParams = useSearchParams();
  const ingredientId = searchParams.get("ingredientId") || "";
  const name = searchParams.get("name") || "";

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => ({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  }));
  const [transactionType, setTransactionType] = useState<number | undefined>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["inventory-ledger", ingredientId, dateRange, transactionType],
    queryFn: () =>
      inventoryService.getInventoryLedger(
        ingredientId,
        dateRange?.from?.toISOString() ?? startOfMonth(new Date()).toISOString(),
        dateRange?.to?.toISOString() ?? endOfMonth(new Date()).toISOString(),
        transactionType
      ),
    enabled: !!ingredientId,
  });

  const handleDateRangeChange: (range: DateRange | undefined) => void = useCallback((range) => {
    if (range?.from && range?.to) {
      setDateRange({ from: range.from, to: range.to });
    } else {
      setDateRange(undefined);
    }
  }, []);

  return {
    ledger: data?.data || [],
    isLoading,
    isError,
    error,
    dateRange,
    setDateRange: handleDateRangeChange,
    transactionType,
    setTransactionType,
    ingredientId,
    ingredientName: name,
  };
}
