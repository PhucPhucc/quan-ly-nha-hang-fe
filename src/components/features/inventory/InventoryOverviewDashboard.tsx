"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  CircleAlert,
  DollarSign,
  Package,
  PackageX,
  RefreshCw,
  TrendingDown,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { inventoryService } from "@/services/inventory.service";

import { InventoryAlertSummary } from "./components/InventoryAlertSummary";
import { InventoryStatCard } from "./components/InventoryStatCard";
import { INVENTORY_PAGE_CLASS } from "./components/inventoryStyles";

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B ₫`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M ₫`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K ₫`;
  }
  return `${value.toLocaleString("vi-VN")} ₫`;
}

function SectionHeader({
  title,
  description,
  href,
  hrefLabel,
  icon: Icon,
}: {
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
        <div>
          <h2 className="text-sm font-bold text-foreground">{title}</h2>
          {description && (
            <p className="mt-0.5 text-[11px] text-muted-foreground/70">{description}</p>
          )}
        </div>
      </div>
      {href && hrefLabel && (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-foreground/70 shadow-sm transition-all hover:bg-muted/50 hover:text-foreground"
        >
          {hrefLabel}
          <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

function AlertBadgePill({
  href,
  icon: Icon,
  label,
  variant,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  variant: "danger" | "warning";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "table-pill flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all hover:opacity-80",
        variant === "danger" ? "table-pill-danger" : "table-pill-warning"
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </Link>
  );
}

const COMPLETED_OPENING_STOCK_STATUS = 2;
const OPENING_STOCK_REMINDER = {
  title: "Bạn chưa nhập số dư đầu kỳ",
  description:
    "Vui lòng nhập số dư đầu kỳ trước khi tiếp tục quản lý kho để dữ liệu tồn kho được chính xác.",
  action: "Đi đến nhập số dư",
} as const;

function shouldShowOpeningStockReminder(
  settings?: { openingStockStatus?: number | string; lockedAt?: string | null } | null
) {
  if (!settings) {
    return true;
  }

  return (
    !settings.lockedAt &&
    settings.openingStockStatus !== COMPLETED_OPENING_STOCK_STATUS &&
    settings.openingStockStatus !== "Completed"
  );
}

export function InventoryOverviewDashboard() {
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

  const overview = overviewData?.data;

  const outOfStockCount = overview?.outOfStockCount ?? 0;
  const lowStockCount = overview?.lowStockCount ?? 0;
  const expiredCount = overview?.expiredLots ?? 0;
  const nearExpiryCount = overview?.nearExpiryLots ?? 0;
  const totalAlerts = outOfStockCount + lowStockCount + expiredCount + nearExpiryCount;

  const lowStockVariant = lowStockCount > 0 ? "warning" : "success";
  const alertsVariant = totalAlerts > 0 ? "danger" : "success";

  return (
    <div className={cn(INVENTORY_PAGE_CLASS, "gap-6")}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Warehouse className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{UI_TEXT.INVENTORY.TITLE}</h1>
              <p className="text-[11px] text-muted-foreground">{UI_TEXT.INVENTORY.WIP_DESC}</p>
            </div>
          </div>

          {shouldShowOpeningStockReminder(settings) ? (
            <div className="hidden h-10 items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-3 text-amber-950 shadow-sm md:flex lg:px-4">
              <div className="flex items-center gap-2">
                <CircleAlert className="h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-[13px] font-semibold">{OPENING_STOCK_REMINDER.title}</p>
              </div>
              <div className="h-4 w-px bg-amber-300/50" />
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-xs font-bold text-amber-800 hover:bg-amber-200/50 hover:text-amber-900"
              >
                <Link href="/manager/inventory/opening-stock">
                  {OPENING_STOCK_REMINDER.action} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          ) : null}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-2 rounded-xl text-xs"
          onClick={() => refetchStats()}
          disabled={isFetching}
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
          {UI_TEXT.INVENTORY.OVERVIEW.REFRESH}
        </Button>
      </div>

      {shouldShowOpeningStockReminder(settings) ? (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-950 shadow-sm md:hidden">
          <div className="flex items-center gap-2">
            <CircleAlert className="h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-xs font-semibold">{OPENING_STOCK_REMINDER.title}</p>
          </div>
          <Button asChild size="sm" className="h-7 px-3 text-[10px] font-bold">
            <Link href="/manager/inventory/opening-stock">{OPENING_STOCK_REMINDER.action}</Link>
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <InventoryStatCard
          icon={Package}
          label={UI_TEXT.INVENTORY.TOTAL_ITEMS}
          value={overview?.totalIngredients ?? "—"}
          href="/manager/inventory"
          isLoading={statsLoading}
        />
        <InventoryStatCard
          icon={DollarSign}
          label={UI_TEXT.INVENTORY.INVENTORY_VALUE}
          value={overview ? formatCurrency(overview.totalStockValue) : "—"}
          subLabel={UI_TEXT.COMMON.ALL}
          isLoading={statsLoading}
          variant="info"
        />
        <InventoryStatCard
          icon={TrendingDown}
          label={UI_TEXT.INVENTORY.LOW_STOCK}
          value={overview?.lowStockCount ?? "—"}
          href="/manager/inventory/alerts"
          variant={lowStockVariant}
          isLoading={statsLoading}
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
        />
      </div>

      {!statsLoading && totalAlerts > 0 && (
        <div className="flex flex-wrap gap-2">
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

      <div className="flex flex-col gap-4">
        <SectionHeader
          title={UI_TEXT.INVENTORY.ALERTS_TITLE}
          description={UI_TEXT.INVENTORY.ALERTS_DESC}
          href="/manager/inventory/alerts"
          hrefLabel={UI_TEXT.INVENTORY.OVERVIEW.ALERTS_VIEW_ALL}
          icon={AlertTriangle}
        />
        <InventoryAlertSummary />
      </div>
    </div>
  );
}
