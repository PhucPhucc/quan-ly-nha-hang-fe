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
import {
  INVENTORY_LOADING_CLASS,
  INVENTORY_TABLE_SURFACE_CLASS,
} from "./components/inventoryStyles";
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
      <div className="flex h-[400px] items-center justify-center">
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
        <div className="flex flex-col justify-between rounded-[1.25rem] border border-error_container/50 bg-error_container/20 p-5">
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
        <div className="flex flex-col justify-between rounded-[1.25rem] border border-warning/20 bg-warning/10 p-5">
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
        <div className="flex flex-col justify-between rounded-[1.25rem] border border-error_container/50 bg-error_container/20 p-5">
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
        <div className="flex flex-col justify-between rounded-[1.25rem] border border-warning/20 bg-warning/10 p-5">
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
      <div
        className={`${INVENTORY_TABLE_SURFACE_CLASS} flex flex-col overflow-hidden rounded-[1.5rem] shadow-none`}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-border/30 bg-background/50 p-4">
            <TabsList className="grid h-11 w-full grid-cols-2 rounded-lg bg-muted/30 p-1">
              <TabsTrigger
                value="low-stock"
                className="flex h-9 gap-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <AlertTriangle className="mb-0.5 h-3.5 w-3.5" />
                {UI_TEXT.INVENTORY.ALERT_TAB_LOW_STOCK}
                <span className="ml-1 tabular-nums opacity-40">
                  {UI_TEXT.COMMON.PAREN_LEFT}
                  {allLowStock.length}
                  {UI_TEXT.COMMON.PAREN_RIGHT}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="expiring"
                className="flex h-9 gap-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Clock className="mb-0.5 h-3.5 w-3.5" />
                {UI_TEXT.INVENTORY.ALERT_TAB_EXPIRING}
                <span className="ml-1 tabular-nums opacity-40">
                  {UI_TEXT.COMMON.PAREN_LEFT}
                  {allExpiring.length}
                  {UI_TEXT.COMMON.PAREN_RIGHT}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <LowStockTabContent items={allLowStock} />
          <ExpiringTabContent items={allExpiring} />
        </Tabs>
      </div>
    </div>
  );
}
