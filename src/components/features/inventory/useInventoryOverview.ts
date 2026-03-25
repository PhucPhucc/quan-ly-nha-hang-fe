"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useInventoryAlerts } from "@/hooks/useInventoryAlerts";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { InventoryAlertsResponse } from "@/types/Inventory";

export type PriorityGroup = {
  key: string;
  title: string;
  href: string;
  actionLabel: string;
  tone: "danger" | "warning" | "info" | "neutral";
  items: { id: string; name: string; meta: string }[];
};

export function useInventoryOverview() {
  const {
    data: overviewData,
    isLoading: statsLoading,
    refetch: refetchStats,
    isFetching,
  } = useQuery({
    queryKey: ["inventory-dashboard-overview"],
    queryFn: () => inventoryService.getDashboardOverview(),
    staleTime: 3 * 60 * 1000,
  });

  const { data: settings } = useQuery({
    queryKey: ["inventory-settings"],
    queryFn: async () => {
      const response = await inventoryService.getInventorySettings();
      return response.data;
    },
  });

  const { data: alerts, isLoading: alertsLoading } = useInventoryAlerts();

  const { data: ingredients, isLoading: ingredientsLoading } = useQuery({
    queryKey: ["inventory-ingredients-overview-priority"],
    queryFn: async () => {
      const response = await inventoryService.getIngredients(1, 1000);
      return response.data?.items ?? [];
    },
    staleTime: 3 * 60 * 1000,
  });

  const overview = overviewData?.data;
  const priorityLoading = alertsLoading || ingredientsLoading;

  const outOfStockCount = overview?.outOfStockCount ?? 0;
  const lowStockCount = overview?.lowStockCount ?? 0;
  const expiredCount = overview?.expiredLots ?? 0;
  const nearExpiryCount = overview?.nearExpiryLots ?? 0;
  const totalAlerts = outOfStockCount + lowStockCount + expiredCount + nearExpiryCount;

  const priorityGroups = useMemo(
    () => buildPriorityGroups(alerts, ingredients ?? []),
    [alerts, ingredients]
  );

  return {
    overview,
    statsLoading,
    refetchStats,
    isFetching,
    settings,
    totalAlerts,
    outOfStockCount,
    lowStockCount,
    expiredCount,
    nearExpiryCount,
    priorityGroups,
    priorityLoading,
  };
}

function buildPriorityGroups(
  alerts: InventoryAlertsResponse | undefined,
  ingredients: Array<{
    ingredientId: string;
    name: string;
    code: string;
    unit: string;
    costPrice: number;
    lowStockThreshold: number;
  }>
): PriorityGroup[] {
  const lowStockItems = [...(alerts?.outOfStockItems ?? []), ...(alerts?.lowStockItems ?? [])]
    .slice(0, 4)
    .map((item) => ({
      id: item.ingredientId,
      name: item.ingredientName,
      meta: `${item.currentStock}/${item.threshold} ${item.unit}`,
    }));

  const expiringLots = [...(alerts?.expiredLots ?? []), ...(alerts?.nearExpiryLots ?? [])]
    .slice(0, 4)
    .map((item) => ({
      id: item.inventoryLotId,
      name: item.ingredientName,
      meta:
        item.daysRemaining != null && item.daysRemaining >= 0
          ? `${UI_TEXT.COMMON.REMAINING} ${item.daysRemaining} ${UI_TEXT.COMMON.DAYS} ${UI_TEXT.COMMON.DOT_SEP} ${item.lotCode}`
          : `${UI_TEXT.INVENTORY.ALERTS.BADGE_EXPIRED} ${UI_TEXT.COMMON.DOT_SEP} ${item.lotCode}`,
    }));

  const missingCost = ingredients
    .filter((item) => (item.costPrice ?? 0) <= 0)
    .slice(0, 4)
    .map((item) => ({
      id: item.ingredientId,
      name: item.name,
      meta: `${item.code} ${UI_TEXT.COMMON.DOT_SEP} ${UI_TEXT.INVENTORY.OVERVIEW.MISSING_COST_META}`,
    }));

  const missingThreshold = ingredients
    .filter((item) => (item.lowStockThreshold ?? 0) <= 0)
    .slice(0, 4)
    .map((item) => ({
      id: item.ingredientId,
      name: item.name,
      meta: `${item.code} ${UI_TEXT.COMMON.DOT_SEP} ${UI_TEXT.INVENTORY.OVERVIEW.MISSING_THRESHOLD_META}`,
    }));

  return [
    {
      key: "low-stock",
      title: UI_TEXT.INVENTORY.OVERVIEW.LOW_STOCK_TITLE,
      href: "/manager/inventory/alerts",
      actionLabel: UI_TEXT.INVENTORY.OVERVIEW.OPEN_ALERTS,
      tone: "danger",
      items: lowStockItems,
    },
    {
      key: "expiring",
      title: UI_TEXT.INVENTORY.OVERVIEW.EXPIRING_LOTS_TITLE,
      href: "/manager/inventory/alerts",
      actionLabel: UI_TEXT.INVENTORY.OVERVIEW.VIEW_EXPIRING_LOTS,
      tone: "warning",
      items: expiringLots,
    },
    {
      key: "missing-cost",
      title: UI_TEXT.INVENTORY.OVERVIEW.MISSING_COST_TITLE,
      href: "/manager/inventory",
      actionLabel: UI_TEXT.INVENTORY.OVERVIEW.UPDATE_INGREDIENT,
      tone: "info",
      items: missingCost,
    },
    {
      key: "missing-threshold",
      title: UI_TEXT.INVENTORY.OVERVIEW.MISSING_THRESHOLD_TITLE,
      href: "/manager/inventory/settings",
      actionLabel: UI_TEXT.INVENTORY.OVERVIEW.OPEN_SETTINGS,
      tone: "neutral",
      items: missingThreshold,
    },
  ];
}
