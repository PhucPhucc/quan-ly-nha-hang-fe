import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { inventoryService } from "@/services/inventoryService";
import { AlertThresholdStatus } from "@/types/Inventory";

export type StatusFilter = "all" | "normal" | "low" | "out";

export function useInventoryTable(pageSize = 10) {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ingredients", currentPage, pageSize],
    queryFn: () => inventoryService.getIngredients(currentPage, pageSize),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inventoryService.deleteIngredient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });

  const { items = [], totalPages = 1 } = data?.data || {};

  const filteredIngredients = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "low" && item.status === AlertThresholdStatus.LOW_STOCK) ||
        (statusFilter === "out" && item.status === AlertThresholdStatus.OUT_OF_STOCK) ||
        (statusFilter === "normal" && item.status === AlertThresholdStatus.NORMAL);

      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  return {
    ingredients: filteredIngredients,
    totalPages,
    isLoading,
    isError,
    error,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    deleteMutation,
  };
}
