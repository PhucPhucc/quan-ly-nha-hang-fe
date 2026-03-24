"use client";

import { AlertTriangle, ArrowRight, CalendarClock, PackageX } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useInventoryAlerts } from "@/hooks/useInventoryAlerts";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { InventoryExpiryAlertItem, InventoryStockAlertItem } from "@/types/Inventory";

// ─── Low Stock Row ────────────────────────────────────────────────────────────
function LowStockRow({
  item,
  isOutOfStock,
}: {
  item: InventoryStockAlertItem;
  isOutOfStock: boolean;
}) {
  const pct = item.threshold > 0 ? Math.min((item.currentStock / item.threshold) * 100, 100) : 0;
  const barWidth = isOutOfStock ? "0%" : `${pct}%`;

  return (
    <div className="flex items-center gap-3 border-b border-border/40 py-2.5 last:border-0">
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
          isOutOfStock ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning-foreground"
        )}
      >
        <PackageX className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-xs font-semibold text-foreground">
            {item.ingredientName}
          </span>
          <span
            className={cn(
              "shrink-0 text-xs font-bold tabular-nums",
              isOutOfStock ? "text-danger" : "text-warning-foreground"
            )}
          >
            {item.currentStock}
            {UI_TEXT.COMMON.SLASH}
            {item.threshold}
            {UI_TEXT.COMMON.SPACE}
            {item.unit}
          </span>
        </div>
        {/* Mini progress bar - width driven by CSS var to avoid inline style lint */}
        <div className="mt-1 h-1 w-full rounded-full bg-muted/60">
          <div
            className={cn(
              "inventory-progress-bar h-1 rounded-full transition-all",
              isOutOfStock ? "bg-danger" : "bg-warning"
            )}
            data-width={barWidth}
            style={{ width: barWidth }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Expiry Row ───────────────────────────────────────────────────────────────
function ExpiryRow({ item }: { item: InventoryExpiryAlertItem }) {
  const isExpired = (item.daysRemaining ?? 0) < 0;

  return (
    <div className="flex items-center gap-3 border-b border-border/40 py-2.5 last:border-0">
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
          isExpired ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning-foreground"
        )}
      >
        <CalendarClock className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-xs font-semibold text-foreground">
            {item.ingredientName}
          </span>
          <span
            className={cn(
              "shrink-0 text-xs font-bold tabular-nums",
              isExpired ? "text-danger" : "text-warning-foreground"
            )}
          >
            {isExpired
              ? UI_TEXT.INVENTORY.ALERTS.MSG_EXPIRED
              : `${UI_TEXT.INVENTORY.ALERTS.MSG_REMAINING} ${item.daysRemaining} ${UI_TEXT.INVENTORY.ALERTS.TXT_DAYS}`}
          </span>
        </div>
        <div className="mt-0.5 truncate text-[10px] text-muted-foreground">
          {UI_TEXT.INVENTORY.LOTS.COL_CODE}
          {UI_TEXT.COMMON.COLON}
          {UI_TEXT.COMMON.SPACE}
          {item.lotCode}
          {UI_TEXT.COMMON.SPACE}
          {UI_TEXT.INVENTORY.OVERVIEW.SEP_DOT}
          {UI_TEXT.COMMON.SPACE}
          {item.remainingQuantity}
          {UI_TEXT.COMMON.SPACE}
          {item.unit}
        </div>
      </div>
    </div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────
function AlertPanel({
  title,
  count,
  icon: Icon,
  iconVariant,
  children,
  isLoading,
  emptyText,
}: {
  title: string;
  count: number;
  icon: React.ElementType;
  iconVariant: "danger" | "warning";
  children: React.ReactNode;
  isLoading: boolean;
  emptyText: string;
}) {
  return (
    <div className="flex flex-1 min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between border-b border-border/40 bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-md",
              iconVariant === "danger" ? "bg-danger/10" : "bg-warning/10"
            )}
          >
            <Icon
              className={cn(
                "h-3.5 w-3.5",
                iconVariant === "danger" ? "text-danger" : "text-warning-foreground"
              )}
            />
          </div>
          <span className="text-xs font-semibold text-foreground">{title}</span>
          {!isLoading && (
            <span
              className={cn(
                "ml-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold tabular-nums",
                iconVariant === "danger"
                  ? "bg-danger text-white"
                  : "bg-warning text-warning-foreground"
              )}
            >
              {count}
            </span>
          )}
        </div>
        <Link
          href="/manager/inventory/alerts"
          className="flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline"
        >
          {UI_TEXT.INVENTORY.OVERVIEW.ALERTS_VIEW_ALL}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="flex-1 min-h-0 px-4">
        {isLoading ? (
          <div className="space-y-3 py-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : count === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            {emptyText}
          </div>
        ) : (
          <div className="h-full overflow-y-auto py-3 pr-1">{children}</div>
        )}
      </div>
    </div>
  );
}

export function InventoryAlertSummary() {
  const { data: alertsData, isLoading } = useInventoryAlerts();

  const outOfStockItems = alertsData?.outOfStockItems ?? [];
  const lowStockItems = alertsData?.lowStockItems ?? [];
  const expiredLots = alertsData?.expiredLots ?? [];
  const nearExpiryLots = alertsData?.nearExpiryLots ?? [];

  const topLowStock = [...outOfStockItems, ...lowStockItems];
  const topExpiring = [...expiredLots, ...nearExpiryLots];
  const totalLowStock = outOfStockItems.length + lowStockItems.length;
  const totalExpiring = expiredLots.length + nearExpiryLots.length;
  const hasAlerts = totalLowStock + totalExpiring > 0;

  return (
    <div className="grid grid-cols-1 gap-4 flex-1 min-h-0 md:grid-cols-2">
      {/* Low Stock Panel */}
      <AlertPanel
        title={UI_TEXT.INVENTORY.ALERTS.TAB_LOW_STOCK}
        count={totalLowStock}
        icon={AlertTriangle}
        iconVariant="danger"
        isLoading={isLoading}
        emptyText={UI_TEXT.INVENTORY.TABLE.EMPTY_ALERT}
      >
        {topLowStock.map((item) => (
          <LowStockRow
            key={item.ingredientId}
            item={item}
            isOutOfStock={outOfStockItems.some(
              (o: InventoryStockAlertItem) => o.ingredientId === item.ingredientId
            )}
          />
        ))}
      </AlertPanel>

      {/* Expiring Panel */}
      <AlertPanel
        title={UI_TEXT.INVENTORY.ALERTS.TAB_EXPIRING}
        count={totalExpiring}
        icon={CalendarClock}
        iconVariant="warning"
        isLoading={isLoading}
        emptyText={UI_TEXT.INVENTORY.TABLE.EMPTY_EXPIRING}
      >
        {topExpiring.map((item) => (
          <ExpiryRow key={item.inventoryLotId} item={item} />
        ))}
      </AlertPanel>

      {/* All-clear state */}
      {!isLoading && !hasAlerts && (
        <div className="col-span-full flex flex-1 min-h-0 items-center justify-center rounded-2xl border border-success/20 bg-success/5 py-10 shadow-sm">
          <div className="text-center">
            <div className="mb-1 text-sm font-semibold text-success">
              {UI_TEXT.INVENTORY.OVERVIEW.STOCK_HEALTHY}
            </div>
            <div className="text-xs text-muted-foreground">
              {UI_TEXT.INVENTORY.ALERTS.EMPTY_DESC}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
