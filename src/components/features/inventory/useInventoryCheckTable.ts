import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { startOfMonth } from "date-fns";
import { useCallback, useState } from "react";

import { inventoryService } from "@/services/inventory.service";

export function useInventoryCheckTable(pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<Date>(() => startOfMonth(new Date()));
  const [toDate, setToDate] = useState<Date>(() => new Date());

  const backendFilters = {
    status: statusFilter === "all" ? undefined : parseInt(statusFilter),
    fromDate: fromDate.toISOString(),
    toDate: toDate.toISOString(),
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["inventory-checks", currentPage, pageSize, statusFilter, fromDate, toDate],
    queryFn: () => inventoryService.getInventoryChecks(currentPage, pageSize, backendFilters),
    placeholderData: keepPreviousData,
  });

  const handleStatusChange = useCallback((status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handleFromDateChange = useCallback((value: Date | undefined) => {
    if (!value) return;
    setFromDate(value);
    setToDate((previous) => (previous < value ? value : previous));
    setCurrentPage(1);
  }, []);

  const handleToDateChange = useCallback((value: Date | undefined) => {
    if (!value) return;
    setToDate(value);
    setFromDate((previous) => (previous > value ? value : previous));
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
    fromDate,
    toDate,
    setFromDate: handleFromDateChange,
    setToDate: handleToDateChange,
  };
}
