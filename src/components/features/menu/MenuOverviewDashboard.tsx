"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BookOpenText,
  Boxes,
  ChefHat,
  Clock3,
  ImageIcon,
  Layers3,
  PackageCheck,
  RefreshCw,
  Settings2,
  SquareMenu,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { InventoryStatCard } from "@/components/features/inventory/components/InventoryStatCard";
import { INVENTORY_PAGE_CLASS } from "@/components/features/inventory/components/inventoryStyles";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/error";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { categoryService } from "@/services/categoryService";
import { menuService } from "@/services/menuService";
import { optionService } from "@/services/optionService";
import { CategoryType, Station } from "@/types/enums";
import { Category, MenuItem, OptionGroup, SetMenu } from "@/types/Menu";

type MenuOverviewData = {
  menuItems: MenuItem[];
  setMenus: SetMenu[];
  categories: Category[];
  optionGroups: OptionGroup[];
};

type CatalogEntry = {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  isOutOfStock: boolean;
  imageUrl?: string;
  categoryName?: string;
  station?: Station;
  expectedTime?: number;
  type: "item" | "combo";
};

type CategorySummary = {
  name: string;
  count: number;
  share: number;
};

type StationSummary = {
  key: string;
  label: string;
  count: number;
  averageTime: number;
};

type PriorityEntry = {
  id: string;
  name: string;
  type: "item" | "combo";
  reasons: string[];
};

// Removed local MENU_OVERVIEW_TEXT as it is now in src/constants/ui_text/menu.ts

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

export function MenuOverviewDashboard() {
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

  return (
    <div className={cn(INVENTORY_PAGE_CLASS, "gap-4 pt-2 pb-8")}>
      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error instanceof Error ? error.message : "Không thể tải tổng quan thực đơn."}
        </div>
      ) : null}

      <PageHeader
        icon={SquareMenu}
        title={UI_TEXT.MENU.TITLE}
        description={UI_TEXT.MENU.OVERVIEW.HERO_DESC}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
              <Link href="/manager/menu/list">
                <BookOpenText className="mr-2 h-3.5 w-3.5" />
                {UI_TEXT.MENU.OVERVIEW.ACTIONS.CATALOG}
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
              <Link href="/manager/menu/options">
                <Settings2 className="mr-2 h-3.5 w-3.5" />
                {UI_TEXT.MENU.OVERVIEW.ACTIONS.OPTIONS}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={cn("mr-2 h-3.5 w-3.5", isFetching && "animate-spin")} />
              {UI_TEXT.MENU.OVERVIEW.REFRESH}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-2.5 px-4 md:grid-cols-2 xl:grid-cols-4">
        <InventoryStatCard
          icon={PackageCheck}
          label={UI_TEXT.MENU.OVERVIEW.STATS.SELLABLE}
          value={sellableCount}
          subLabel={UI_TEXT.MENU.TAB_ITEM}
          subValue={data?.menuItems.length ?? 0}
          isLoading={isLoading}
          href="/manager/menu/list"
          variant="success"
          compact
        />
        <InventoryStatCard
          icon={Layers3}
          label={UI_TEXT.MENU.OVERVIEW.STATS.COMBOS}
          value={comboCount}
          subLabel={UI_TEXT.MENU.TAB_COMBO}
          subValue={comboCount}
          isLoading={isLoading}
          href="/manager/menu/list"
          variant="info"
          compact
        />
        <InventoryStatCard
          icon={AlertTriangle}
          label={UI_TEXT.MENU.OVERVIEW.STATS.UNAVAILABLE}
          value={unavailableCount}
          subLabel={UI_TEXT.MENU.STATUS_OUT_OF_STOCK}
          subValue={unavailableCount}
          isLoading={isLoading}
          href="/manager/menu/list"
          variant={unavailableCount > 0 ? "warning" : "default"}
          compact
        />
        <InventoryStatCard
          icon={Boxes}
          label={UI_TEXT.MENU.OVERVIEW.STATS.CATEGORIES}
          value={activeCategoryCount}
          subLabel={UI_TEXT.MENU.FILTER_ALL_CATEGORY}
          subValue={
            data?.categories.filter((category) => category.type === CategoryType.NORMAL).length ?? 0
          }
          isLoading={isLoading}
          compact
        />
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="border-none shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Boxes className="h-4 w-4 text-primary" />
              <span>{UI_TEXT.MENU.OVERVIEW.SECTIONS.CATEGORY_MIX}</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {UI_TEXT.MENU.OVERVIEW.SECTIONS.CATEGORY_MIX_DESC}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <OverviewSkeleton rows={4} />
            ) : categoryMix.length > 0 ? (
              categoryMix.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {category.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {category.count} {UI_TEXT.MENU.OVERVIEW.ITEM_UNIT}
                      </p>
                    </div>
                    <Badge variant="outline" className="table-pill table-pill-info border-0">
                      {category.share}
                      {UI_TEXT.COMMON.PERCENT}
                    </Badge>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${Math.max(category.share, 8)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <EmptyState copy={UI_TEXT.MENU.OVERVIEW.EMPTY.CATEGORIES} />
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <ChefHat className="h-4 w-4 text-primary" />
              <span>{UI_TEXT.MENU.OVERVIEW.SECTIONS.STATION_READINESS}</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {UI_TEXT.MENU.OVERVIEW.SECTIONS.STATION_READINESS_DESC}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <OverviewSkeleton rows={3} />
            ) : stationSummaries.some((station) => station.count > 0) ? (
              stationSummaries.map((station) => (
                <div
                  key={station.key}
                  className="flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{station.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {station.averageTime > 0
                        ? `${station.averageTime} ${UI_TEXT.MENU.OVERVIEW.AVG_PREP_SUFFIX}`
                        : UI_TEXT.MENU.OVERVIEW.EMPTY.STATION_NO_DATA}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "border-0",
                      station.count > 0
                        ? "table-pill table-pill-primary"
                        : "table-pill table-pill-neutral"
                    )}
                  >
                    {station.count} {UI_TEXT.MENU.OVERVIEW.ITEM_UNIT}
                  </Badge>
                </div>
              ))
            ) : (
              <EmptyState copy={UI_TEXT.MENU.OVERVIEW.EMPTY.STATIONS} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Card className="border-none shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <ImageIcon className="h-4 w-4 text-primary" />
              <span>{UI_TEXT.MENU.OVERVIEW.SECTIONS.CHECKLIST}</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {UI_TEXT.MENU.OVERVIEW.SECTIONS.CHECKLIST_DESC}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <ChecklistRow
              label={UI_TEXT.MENU.OVERVIEW.CHECKLIST.IMAGE_COVERAGE}
              value={`${checklist.entriesWithImage}/${totalCatalogEntries}`}
              hint={UI_TEXT.MENU.OVERVIEW.CHECKLIST.IMAGE_HINT}
              isLoading={isLoading}
            />
            <ChecklistRow
              label={UI_TEXT.MENU.OVERVIEW.CHECKLIST.COST_COVERAGE}
              value={`${checklist.entriesWithCost}/${totalCatalogEntries}`}
              hint={UI_TEXT.MENU.OVERVIEW.CHECKLIST.COST_HINT}
              isLoading={isLoading}
            />
            <ChecklistRow
              label={UI_TEXT.MENU.OVERVIEW.CHECKLIST.OPTION_COVERAGE}
              value={`${checklist.groupsInUse}/${checklist.totalGroups}`}
              hint={UI_TEXT.MENU.OVERVIEW.CHECKLIST.OPTION_HINT}
              isLoading={isLoading}
            />
            <ChecklistRow
              label={UI_TEXT.MENU.OVERVIEW.STATS.UNAVAILABLE}
              value={String(unavailableCount)}
              hint={UI_TEXT.MENU.OVERVIEW.CHECKLIST.UNAVAILABLE_HINT}
              isLoading={isLoading}
              tone={unavailableCount > 0 ? "warning" : "default"}
            />

            {!isLoading && optionHighlights.length > 0 ? (
              <div className="rounded-xl border border-dashed px-4 py-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {UI_TEXT.MENU.OVERVIEW.SECTIONS.OPTION_HIGHLIGHTS}
                </p>
                <div className="flex flex-wrap gap-2">
                  {optionHighlights.map((group) => (
                    <Badge
                      key={group.optionGroupId}
                      variant="outline"
                      className="table-pill table-pill-info border-0"
                    >
                      {group.name} {UI_TEXT.COMMON.DOT_SEP} {group.usageCount ?? 0}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <Clock3 className="h-4 w-4 text-primary" />
              <span>{UI_TEXT.MENU.OVERVIEW.SECTIONS.PRIORITY}</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {UI_TEXT.MENU.OVERVIEW.SECTIONS.PRIORITY_DESC}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <OverviewSkeleton rows={4} />
            ) : priorityItems.length > 0 ? (
              priorityItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.type === "combo" ? UI_TEXT.MENU.TAB_COMBO : UI_TEXT.MENU.TAB_ITEM}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {item.reasons.map((reason) => (
                      <Badge
                        key={`${item.id}-${reason}`}
                        variant="outline"
                        className={cn(
                          "border-0",
                          reason === UI_TEXT.MENU.OVERVIEW.REASONS.OUT_OF_STOCK
                            ? "table-pill table-pill-warning"
                            : "table-pill table-pill-neutral"
                        )}
                      >
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <EmptyState copy={UI_TEXT.MENU.OVERVIEW.EMPTY.PRIORITY} />
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild size="sm" className="rounded-xl text-xs">
                <Link href="/manager/menu/list">{UI_TEXT.MENU.OVERVIEW.ACTIONS.CATALOG}</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
                <Link href="/manager/menu/options">{UI_TEXT.MENU.OVERVIEW.ACTIONS.OPTIONS}</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
                <Link href="/manager/menu/list">{UI_TEXT.MENU.OVERVIEW.ACTIONS.RECIPES}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ChecklistRow({
  label,
  value,
  hint,
  isLoading,
  tone = "default",
}: {
  label: string;
  value: string;
  hint: string;
  isLoading: boolean;
  tone?: "default" | "warning";
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      {isLoading ? (
        <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
      ) : (
        <Badge
          variant="outline"
          className={cn(
            "border-0",
            tone === "warning" ? "table-pill table-pill-warning" : "table-pill table-pill-primary"
          )}
        >
          {value}
        </Badge>
      )}
    </div>
  );
}

function OverviewSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-xl bg-muted/70" />
      ))}
    </div>
  );
}

function EmptyState({ copy }: { copy: string }) {
  return (
    <div className="flex min-h-[168px] items-center justify-center rounded-xl border border-dashed px-4 text-center text-sm text-muted-foreground">
      {copy}
    </div>
  );
}
