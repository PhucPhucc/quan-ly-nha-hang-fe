"use client";

import { BookOpenText, RefreshCw, Settings2, SquareMenu } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

import { CategoryMixCard } from "./components/MenuOverviewDashboard/CategoryMixCard";
import { ChecklistCard } from "./components/MenuOverviewDashboard/ChecklistCard";
import { MenuStatCards } from "./components/MenuOverviewDashboard/MenuStatCards";
import { PriorityCard } from "./components/MenuOverviewDashboard/PriorityCard";
import { StationReadinessCard } from "./components/MenuOverviewDashboard/StationReadinessCard";
import { useMenuOverview } from "./components/MenuOverviewDashboard/useMenuOverview";

export function MenuOverviewDashboard() {
  const {
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
    totalNormalCategories,
  } = useMenuOverview();

  return (
    <div className="px-4 space-y-6 py-2 animate-in fade-in duration-500">
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

      <MenuStatCards
        isLoading={isLoading}
        sellableCount={sellableCount}
        totalMenuItems={data?.menuItems.length ?? 0}
        comboCount={comboCount}
        unavailableCount={unavailableCount}
        activeCategoryCount={activeCategoryCount}
        totalNormalCategories={totalNormalCategories}
        data={data}
      />

      <div className="grid grid-cols-1 gap-4 px-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <CategoryMixCard isLoading={isLoading} categoryMix={categoryMix} />
        <StationReadinessCard isLoading={isLoading} stationSummaries={stationSummaries} />
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <ChecklistCard
          isLoading={isLoading}
          totalCatalogEntries={totalCatalogEntries}
          checklist={checklist}
          optionHighlights={optionHighlights}
          unavailableCount={unavailableCount}
        />
        <PriorityCard isLoading={isLoading} priorityItems={priorityItems} />
      </div>
    </div>
  );
}
