import { useQuery } from "@tanstack/react-query";
import { endOfMonth, startOfMonth } from "date-fns";
import { useCallback, useState } from "react";
import { DateRange } from "react-day-picker";

import { inventoryService } from "@/services/inventory.service";

export function useInventoryReport() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => ({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  }));
  const [ingredientId, setIngredientId] = useState<string | undefined>();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["inventory-report", dateRange, ingredientId],
    queryFn: () =>
      inventoryService.getInventoryReport(
        dateRange?.from?.toISOString() ?? startOfMonth(new Date()).toISOString(),
        dateRange?.to?.toISOString() ?? endOfMonth(new Date()).toISOString(),
        ingredientId
      ),
  });

  const handleDateRangeChange: (range: DateRange | undefined) => void = useCallback((range) => {
    if (range?.from && range?.to) {
      setDateRange({ from: range.from, to: range.to });
    } else {
      setDateRange(undefined);
    }
  }, []);

  return {
    report: data?.data || [],
    isLoading,
    isError,
    error,
    dateRange,
    setDateRange: handleDateRangeChange,
    ingredientId,
    setIngredientId,
    refetch,
  };
}
