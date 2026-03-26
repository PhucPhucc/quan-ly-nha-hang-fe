import { useQuery } from "@tanstack/react-query";
import { endOfMonth, startOfMonth } from "date-fns";
import { useCallback, useState } from "react";

import { inventoryService } from "@/services/inventory.service";

export function useInventoryReport() {
  const [fromDate, setFromDate] = useState<Date>(() => startOfMonth(new Date()));
  const [toDate, setToDate] = useState<Date>(() => endOfMonth(new Date()));
  const [ingredientId, setIngredientId] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["inventory-report", fromDate, toDate, ingredientId, page, pageSize],
    queryFn: () =>
      inventoryService.getInventoryReport(
        fromDate.toISOString(),
        toDate.toISOString(),
        ingredientId,
        page,
        pageSize
      ),
  });

  const handleFromDateChange = useCallback((value: Date | undefined) => {
    if (!value) return;
    setFromDate(value);
    setToDate((previous) => (previous < value ? value : previous));
    setPage(1);
  }, []);

  const handleToDateChange = useCallback((value: Date | undefined) => {
    if (!value) return;
    setToDate(value);
    setFromDate((previous) => (previous > value ? value : previous));
    setPage(1);
  }, []);

  const handleIngredientChange = useCallback((value: string | undefined) => {
    setIngredientId(value);
    setPage(1);
  }, []);

  return {
    report: data?.data?.items || [],
    pagination: data?.data
      ? {
          totalCount: data.data.totalCount,
          currentPage: data.data.pageNumber,
          pageSize: data.data.pageSize,
          totalPages: data.data.totalPages,
          hasNext: data.data.pageNumber < data.data.totalPages,
          hasPrevious: data.data.pageNumber > 1,
        }
      : null,
    isLoading,
    isError,
    error,
    fromDate,
    toDate,
    setFromDate: handleFromDateChange,
    setToDate: handleToDateChange,
    ingredientId,
    setIngredientId: handleIngredientChange,
    page,
    setPage,
    pageSize,
    setPageSize,
    refetch,
  };
}
