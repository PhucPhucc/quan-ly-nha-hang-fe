"use client";

import {
  AlertCircle,
  AlertTriangle,
  CalendarX,
  Clock,
  FileWarning,
  History,
  PackageX,
} from "lucide-react";
import React, { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventoryAlerts } from "@/hooks/useInventoryAlerts";
import { UI_TEXT } from "@/lib/UI_Text";

import { ExpiringTabContent } from "./components/ExpiringTabContent";
import { INVENTORY_LOADING_CLASS } from "./components/inventoryStyles";
import { LowStockTabContent } from "./components/LowStockTabContent";

export function InventoryAlertsTable() {
  const [activeTab, setActiveTab] = useState("low-stock");

  const { data: alertsData, isLoading } = useInventoryAlerts();

  const alerts = alertsData;
  const outOfStockItems = alerts?.outOfStockItems || [];
  const lowStockItems = alerts?.lowStockItems || [];
  const expiredLots = alerts?.expiredLots || [];
  const nearExpiryLots = alerts?.nearExpiryLots || [];

  const allLowStock = [...outOfStockItems, ...lowStockItems];
  const allExpiring = [...expiredLots, ...nearExpiryLots];

  if (isLoading) {
    return (
      <div className="flex h-100 items-center justify-center">
        <div className={INVENTORY_LOADING_CLASS}>
          <History className="mr-3 h-5 w-5 animate-spin text-primary/40" />
          <span className="text-sm font-bold tracking-tight text-foreground/30 capitalize">
            {UI_TEXT.COMMON.LOADING}
            {UI_TEXT.COMMON.ELLIPSIS}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Out of Stock Card */}
        <div className="flex flex-col justify-between rounded-lg border border-error_container/50 bg-error_container/20 p-5">
          <div className="flex items-center gap-2 text-error">
            <PackageX className="h-5 w-5" />
            <span className="text-sm font-semibold">{UI_TEXT.INVENTORY.STOCK.STATUS_OUT}</span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="tabular-nums tracking-tighter text-3xl font-bold text-error">
              {outOfStockItems.length}
            </span>
          </div>
        </div>

        {/* Low Stock Card */}
        <div className="flex flex-col justify-between rounded-lg border border-warning/20 bg-warning/10 p-5">
          <div className="flex items-center gap-2 text-warning">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-semibold">{UI_TEXT.INVENTORY.STOCK.STATUS_LOW}</span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="tabular-nums tracking-tighter text-3xl font-bold text-warning">
              {lowStockItems.length}
            </span>
          </div>
        </div>

        {/* Expired Card */}
        <div className="flex flex-col justify-between rounded-lg border border-error_container/50 bg-error_container/20 p-5">
          <div className="flex items-center gap-2 text-error">
            <CalendarX className="h-5 w-5" />
            <span className="text-sm font-semibold">{UI_TEXT.INVENTORY.ALERTS.BADGE_EXPIRED}</span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="tabular-nums tracking-tighter text-3xl font-bold text-error">
              {expiredLots.length}
            </span>
          </div>
        </div>

        {/* Soon to Expire Card */}
        <div className="flex flex-col justify-between rounded-lg border border-warning/20 bg-warning/10 p-5">
          <div className="flex items-center gap-2 text-warning">
            <FileWarning className="h-5 w-5" />
            <span className="text-sm font-semibold">{UI_TEXT.INVENTORY.ALERTS.BADGE_EXPIRING}</span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="tabular-nums tracking-tighter text-3xl font-bold text-warning">
              {nearExpiryLots.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs and Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full rounded-lg border border-border bg-background mb-2">
          <TabsTrigger
            value="low-stock"
            className="border data-[state=active]:border-border data-[state=active]:bg-card "
          >
            <AlertTriangle className="" />
            {UI_TEXT.INVENTORY.ALERT_TAB_LOW_STOCK}
            <span className="ml-1 tabular-nums opacity-40">
              {UI_TEXT.COMMON.PAREN_LEFT}
              {allLowStock.length}
              {UI_TEXT.COMMON.PAREN_RIGHT}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="expiring"
            className="border data-[state=active]:border-border data-[state=active]:bg-card "
          >
            <Clock className="" />
            {UI_TEXT.INVENTORY.ALERT_TAB_EXPIRING}
            <span className="ml-1 tabular-nums opacity-40">
              {UI_TEXT.COMMON.PAREN_LEFT}
              {allExpiring.length}
              {UI_TEXT.COMMON.PAREN_RIGHT}
            </span>
          </TabsTrigger>
        </TabsList>
        <LowStockTabContent items={allLowStock} />
        <ExpiringTabContent items={allExpiring} />
      </Tabs>
    </div>
  );
}
