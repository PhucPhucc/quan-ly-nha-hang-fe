import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { DateRange } from "react-day-picker";

import { inventoryService } from "@/services/inventory.service";

export function useInventoryCheckTable(pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const backendFilters = {
    status: statusFilter === "all" ? undefined : parseInt(statusFilter),
    fromDate: dateRange?.from?.toISOString(),
    toDate: dateRange?.to?.toISOString(),
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["inventory-checks", currentPage, pageSize, statusFilter, dateRange],
    queryFn: () => inventoryService.getInventoryChecks(currentPage, pageSize, backendFilters),
    placeholderData: keepPreviousData,
  });

  const handleStatusChange = useCallback((status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    setDateRange(range);
    setCurrentPage(1);
  }, []);

  const { items = [], totalPages = 1, totalCount = 0 } = data?.data || {};

  return {
    checks: items,
    totalCount,
    totalPages,
    isLoading,
    isError,
    error,
    currentPage,
    setCurrentPage,
    statusFilter,
    setStatusFilter: handleStatusChange,
    dateRange,
    setDateRange: handleDateRangeChange,
  };
}
