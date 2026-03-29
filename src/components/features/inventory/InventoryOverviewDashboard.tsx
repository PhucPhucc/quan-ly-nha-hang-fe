"use client";

import {
  AlertTriangle,
  DollarSign,
  Info,
  Package,
  PackageX,
  RefreshCw,
  TrendingDown,
  Warehouse,
} from "lucide-react";
import React from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { formatCurrency as formatStandardCurrency } from "@/lib/utils";

import { AlertBadgePill, PriorityGroupCard, SectionHeader } from "./components/DashboardComponents";
import { InventoryAlertSummary } from "./components/InventoryAlertSummary";
import { InventoryStatCard } from "./components/InventoryStatCard";
import { OpeningStockReminder } from "./components/OpeningStockReminder";
import { useInventoryOverview } from "./useInventoryOverview";

function formatDashboardCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B ₫`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M ₫`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K ₫`;
  }
  return formatStandardCurrency(value);
}

export function InventoryOverviewDashboard() {
  const {
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
  } = useInventoryOverview();

  const lowStockVariant = lowStockCount > 0 ? "warning" : "success";
  const alertsVariant = totalAlerts > 0 ? "danger" : "success";

  return (
    <div className="px-4 space-y-6 py-2 animate-in fade-in duration-500">
      <PageHeader
        icon={Warehouse}
        title={UI_TEXT.INVENTORY.TITLE}
        description={UI_TEXT.INVENTORY.WIP_DESC}
        actions={
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-6">
              <OpeningStockReminder settings={settings} />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2 rounded-lg text-xs"
              onClick={() => refetchStats()}
              disabled={isFetching}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
              {UI_TEXT.INVENTORY.OVERVIEW.REFRESH}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-2.5 px-4 md:grid-cols-2 xl:grid-cols-4">
        <InventoryStatCard
          icon={Package}
          label={UI_TEXT.INVENTORY.TOTAL_ITEMS}
          value={overview?.totalIngredients ?? "—"}
          href="/manager/inventory"
          isLoading={statsLoading}
          compact
        />
        <InventoryStatCard
          icon={DollarSign}
          label={UI_TEXT.INVENTORY.INVENTORY_VALUE}
          value={overview ? formatDashboardCurrency(overview.totalStockValue) : "—"}
          subLabel={UI_TEXT.COMMON.ALL}
          isLoading={statsLoading}
          variant="info"
          compact
        />
        <InventoryStatCard
          icon={TrendingDown}
          label={UI_TEXT.INVENTORY.LOW_STOCK}
          value={overview?.lowStockCount ?? "—"}
          href="/manager/inventory/alerts"
          variant={lowStockVariant}
          isLoading={statsLoading}
          compact
        />
        <InventoryStatCard
          icon={AlertTriangle}
          label={UI_TEXT.INVENTORY.OVERVIEW.TOTAL_ALERTS}
          value={statsLoading ? "—" : totalAlerts}
          subLabel={UI_TEXT.INVENTORY.STOCK.STATUS_OUT}
          subValue={outOfStockCount}
          href="/manager/inventory/alerts"
          variant={alertsVariant}
          isLoading={statsLoading}
          compact
        />
      </div>

      {!statsLoading && totalAlerts > 0 && (
        <div className="flex flex-wrap gap-2 px-4">
          {outOfStockCount > 0 && (
            <AlertBadgePill
              href="/manager/inventory/alerts"
              icon={PackageX}
              label={`${outOfStockCount} ${UI_TEXT.INVENTORY.OVERVIEW.OUT_OF_STOCK_SUFFIX}`}
              variant="danger"
            />
          )}
          {lowStockCount > 0 && (
            <AlertBadgePill
              href="/manager/inventory/alerts"
              icon={TrendingDown}
              label={`${lowStockCount} ${UI_TEXT.INVENTORY.OVERVIEW.LOW_STOCK_SUFFIX}`}
              variant="warning"
            />
          )}
          {expiredCount > 0 && (
            <AlertBadgePill
              href="/manager/inventory/alerts"
              icon={AlertTriangle}
              label={`${expiredCount} ${UI_TEXT.INVENTORY.OVERVIEW.EXPIRED_SUFFIX}`}
              variant="danger"
            />
          )}
          {nearExpiryCount > 0 && (
            <AlertBadgePill
              href="/manager/inventory/alerts"
              icon={AlertTriangle}
              label={`${nearExpiryCount} ${UI_TEXT.INVENTORY.OVERVIEW.NEAR_EXPIRY_SUFFIX}`}
              variant="warning"
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 px-4">
        <SectionHeader
          title={UI_TEXT.INVENTORY.ALERTS_TITLE}
          description={UI_TEXT.INVENTORY.ALERTS_DESC}
          href="/manager/inventory/alerts"
          hrefLabel={UI_TEXT.INVENTORY.OVERVIEW.ALERTS_VIEW_ALL}
          icon={AlertTriangle}
        />
        <InventoryAlertSummary />
      </div>

      <div className="grid grid-cols-1 gap-4 bg-background px-4">
        <SectionHeader
          title={UI_TEXT.INVENTORY.OVERVIEW.PRIORITY_ITEMS_TITLE}
          description={UI_TEXT.INVENTORY.OVERVIEW.PRIORITY_ITEMS_DESC}
          href="/manager/inventory"
          hrefLabel={UI_TEXT.INVENTORY.OVERVIEW.VIEW_INGREDIENT_LIST}
          icon={Info}
        />
        <Card className="border-none shadow-none bg-background ">
          <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2 p-0">
            {priorityLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-36 animate-pulse rounded-lg bg-muted/70" />
                ))
              : priorityGroups.map((group) => <PriorityGroupCard key={group.key} group={group} />)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
