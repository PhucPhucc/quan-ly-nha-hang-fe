import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { categoryService } from "@/services/categoryService";
import { menuService } from "@/services/menuService";
import { optionService } from "@/services/optionService";
import { CategoryType, Station } from "@/types/enums";

import {
  CatalogEntry,
  CategorySummary,
  MenuOverviewData,
  PriorityEntry,
  StationSummary,
} from "./MenuOverviewDashboardTypes";

async function fetchMenuOverview(): Promise<MenuOverviewData> {
  const [menuResult, setMenuResult, categoryResult, optionResult] = await Promise.all([
    menuService.getAll(1, 100).catch((error) => ({
      isSuccess: false,
      data: null,
      message: getErrorMessage(error),
    })),
    menuService.getAllSetMenu(1, 100).catch((error) => ({
      isSuccess: false,
      data: null,
      message: getErrorMessage(error),
    })),
    categoryService.getAll().catch((error) => ({
      isSuccess: false,
      data: null,
      message: getErrorMessage(error),
    })),
    optionService.getAllReusable(1, 100).catch((error) => ({
      isSuccess: false,
      data: null,
      message: getErrorMessage(error),
    })),
  ]);

  const menuItems = menuResult.isSuccess && menuResult.data ? (menuResult.data.items ?? []) : [];
  const setMenus =
    setMenuResult.isSuccess && setMenuResult.data ? (setMenuResult.data.items ?? []) : [];
  const categories =
    categoryResult.isSuccess && categoryResult.data
      ? (categoryResult.data.items ?? []).filter((category) => category.isActive !== false)
      : [];
  const optionGroups =
    optionResult.isSuccess && optionResult.data ? (optionResult.data.items ?? []) : [];

  const hasSuccessfulRequest = [menuResult, setMenuResult, categoryResult, optionResult].some(
    (result) => result.isSuccess
  );

  if (!hasSuccessfulRequest) {
    throw new Error(
      menuResult.message ||
        setMenuResult.message ||
        categoryResult.message ||
        optionResult.message ||
        "Không thể tải dữ liệu tổng quan thực đơn."
    );
  }

  return { menuItems, setMenus, categories, optionGroups };
}

export function useMenuOverview() {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["menu-dashboard-overview"],
    queryFn: fetchMenuOverview,
    staleTime: 3 * 60 * 1000,
  });

  const categoriesById = useMemo(
    () => new Map((data?.categories ?? []).map((category) => [category.categoryId, category.name])),
    [data?.categories]
  );

  const catalogEntries = useMemo<CatalogEntry[]>(
    () => [
      ...(data?.menuItems ?? []).map((item) => ({
        id: item.menuItemId,
        name: item.name,
        price: item.price,
        costPrice: item.costPrice,
        isOutOfStock: item.isOutOfStock,
        imageUrl: item.imageUrl,
        categoryName: item.categoryName || categoriesById.get(item.categoryId),
        station: item.station,
        expectedTime: item.expectedTime,
        type: "item" as const,
      })),
      ...(data?.setMenus ?? []).map((item) => ({
        id: item.setMenuId,
        name: item.name,
        price: item.price,
        costPrice: item.costPrice,
        isOutOfStock: item.isOutOfStock,
        imageUrl: item.imageUrl,
        type: "combo" as const,
      })),
    ],
    [categoriesById, data?.menuItems, data?.setMenus]
  );

  const totalCatalogEntries = catalogEntries.length;
  const unavailableCount = catalogEntries.filter((item) => item.isOutOfStock).length;
  const sellableCount = totalCatalogEntries - unavailableCount;
  const comboCount = data?.setMenus.length ?? 0;
  const activeCategoryCount = new Set(
    (data?.menuItems ?? []).filter((item) => item.categoryId).map((item) => item.categoryId)
  ).size;

  const categoryMix = useMemo<CategorySummary[]>(() => {
    const counts = new Map<string, number>();

    for (const item of data?.menuItems ?? []) {
      const name = item.categoryName || categoriesById.get(item.categoryId) || "Chưa phân loại";
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }

    const total = Array.from(counts.values()).reduce((sum, value) => sum + value, 0);

    return Array.from(counts.entries())
      .map(([name, count]) => ({
        name,
        count,
        share: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 5);
  }, [categoriesById, data?.menuItems]);

  const stationSummaries = useMemo<StationSummary[]>(() => {
    const stationLabels: Record<number, string> = {
      [Station.HOT_KITCHEN]: UI_TEXT.MENU.STATION.HOTKITCHEN,
      [Station.COLD_KITCHEN]: UI_TEXT.MENU.STATION.COLDKITCHEN,
      [Station.BAR]: UI_TEXT.MENU.STATION.DRINKS,
    };

    return [Station.HOT_KITCHEN, Station.COLD_KITCHEN, Station.BAR].map((station) => {
      const items = (data?.menuItems ?? []).filter((item) => item.station === station);
      const averageTime = items.length
        ? Math.round(items.reduce((sum, item) => sum + (item.expectedTime || 0), 0) / items.length)
        : 0;

      return {
        key: String(station),
        label: stationLabels[station],
        count: items.length,
        averageTime,
      };
    });
  }, [data?.menuItems]);

  const checklist = useMemo(() => {
    const entriesWithImage = catalogEntries.filter((item) => Boolean(item.imageUrl)).length;
    const entriesWithCost = catalogEntries.filter((item) => item.costPrice > 0).length;
    const groupsInUse = (data?.optionGroups ?? []).filter(
      (group) => (group.usageCount ?? 0) > 0
    ).length;

    return {
      entriesWithImage,
      entriesWithCost,
      groupsInUse,
      totalGroups: data?.optionGroups.length ?? 0,
    };
  }, [catalogEntries, data?.optionGroups]);

  const priorityItems = useMemo<PriorityEntry[]>(() => {
    return catalogEntries
      .map((item) => {
        const reasons: string[] = [];

        if (item.isOutOfStock) reasons.push(UI_TEXT.MENU.OVERVIEW.REASONS.OUT_OF_STOCK);
        if (!item.imageUrl) reasons.push(UI_TEXT.MENU.OVERVIEW.REASONS.MISSING_IMAGE);
        if (item.costPrice <= 0) reasons.push(UI_TEXT.MENU.OVERVIEW.REASONS.MISSING_COST);
        if ((item.expectedTime ?? 0) >= 20) reasons.push(UI_TEXT.MENU.OVERVIEW.REASONS.LONG_PREP);

        return {
          id: item.id,
          name: item.name,
          type: item.type,
          reasons,
        };
      })
      .filter((item) => item.reasons.length > 0)
      .sort(
        (left, right) =>
          right.reasons.length - left.reasons.length || left.name.localeCompare(right.name)
      )
      .slice(0, 6);
  }, [catalogEntries]);

  const optionHighlights = useMemo(
    () =>
      [...(data?.optionGroups ?? [])]
        .sort((left, right) => (right.usageCount ?? 0) - (left.usageCount ?? 0))
        .slice(0, 3),
    [data?.optionGroups]
  );

  return {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
    sellableCount,
    comboCount,
    unavailableCount,
    activeCategoryCount,
    totalCatalogEntries,
    categoryMix,
    stationSummaries,
    checklist,
    priorityItems,
    optionHighlights,
    totalNormalCategories:
      data?.categories.filter((category) => category.type === CategoryType.NORMAL).length ?? 0,
  };
}
