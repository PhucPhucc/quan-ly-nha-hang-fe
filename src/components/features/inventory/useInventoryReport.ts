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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["inventory-report", dateRange, ingredientId, page, pageSize],
    queryFn: () =>
      inventoryService.getInventoryReport(
        dateRange?.from?.toISOString() ?? startOfMonth(new Date()).toISOString(),
        dateRange?.to?.toISOString() ?? endOfMonth(new Date()).toISOString(),
        ingredientId,
        page,
        pageSize
      ),
  });

  const handleDateRangeChange: (range: DateRange | undefined) => void = useCallback((range) => {
    if (range?.from && range?.to) {
      setDateRange({ from: range.from, to: range.to });
      setPage(1);
    } else {
      setDateRange(undefined);
      setPage(1);
    }
  }, []);

  return {
    report: data?.data?.items || [],
    pagination: data?.data
      ? {
          totalCount: data.data.totalCount,
          currentPage: data.data.currentPage,
          pageSize: data.data.pageSize,
          totalPages: data.data.totalPages,
          hasNext: data.data.currentPage < data.data.totalPages,
          hasPrevious: data.data.currentPage > 1,
        }
      : null,
    isLoading,
    isError,
    error,
    dateRange,
    setDateRange: handleDateRangeChange,
    ingredientId,
    setIngredientId,
    page,
    setPage,
    pageSize,
    setPageSize,
    refetch,
  };
}
