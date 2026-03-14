import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { AlertThresholdStatus, Ingredient } from "@/types/Inventory";

export type StatusFilter = "all" | "normal" | "low" | "out";

export function useInventoryTable(pageSize = 10) {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const normalizedSearchQuery = searchQuery.trim();
  const backendStatusFilter =
    statusFilter === "all"
      ? undefined
      : {
          status:
            statusFilter === "low"
              ? AlertThresholdStatus.LOW_STOCK
              : statusFilter === "out"
                ? AlertThresholdStatus.OUT_OF_STOCK
                : AlertThresholdStatus.NORMAL,
        };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ingredients", currentPage, pageSize, normalizedSearchQuery, statusFilter],
    queryFn: () =>
      inventoryService.getIngredients(
        currentPage,
        pageSize,
        normalizedSearchQuery || undefined,
        backendStatusFilter
      ),
    staleTime: 0,
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((status: StatusFilter) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inventoryService.deleteIngredient(id),
    onSuccess: (_, id) => {
      const item = items.find((i: Ingredient) => i.ingredientId === id);
      if (item) {
        toast.success(
          item.isActive
            ? UI_TEXT.INVENTORY.DELETE.SUCCESS_DEACTIVATE
            : UI_TEXT.INVENTORY.DELETE.SUCCESS_REACTIVATE
        );
      }
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });

  const { items = [], totalPages = 1 } = data?.data || {};

  const normalizedItems = useMemo<Ingredient[]>(() => {
    return items.map((item: Ingredient) => {
      const derivedStatus = (() => {
        if (item.status) return item.status;
        const text = item.stockStatus?.toLowerCase() || "";
        if (text.includes("hết hàng") || item.currentStock === 0) {
          return AlertThresholdStatus.OUT_OF_STOCK;
        }
        if (text.includes("sắp hết") || item.currentStock <= item.lowStockThreshold) {
          return AlertThresholdStatus.LOW_STOCK;
        }
        return AlertThresholdStatus.NORMAL;
      })();

      return {
        ...item,
        status: derivedStatus,
        sku: (item as unknown as { sku?: string }).sku ?? item.code, // fallback search field
      };
    });
  }, [items]);

  const filteredIngredients = useMemo(() => {
    return [...normalizedItems].sort((a, b) => {
      const activeDiff = Number(b.isActive) - Number(a.isActive); // active first
      if (activeDiff !== 0) return activeDiff;
      return a.name.localeCompare(b.name, "vi", { sensitivity: "base" });
    });
  }, [normalizedItems]);

  return {
    ingredients: filteredIngredients,
    totalPages,
    isLoading,
    isError,
    error,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery: handleSearchChange,
    statusFilter,
    setStatusFilter: handleStatusChange,
    deleteMutation,
  };
}
