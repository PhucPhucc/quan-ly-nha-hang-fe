import { BellRing, History } from "lucide-react";
import Link from "next/link";
import React from "react";

import { AddIngredientPanel } from "@/components/features/inventory/AddIngredientPanel";
import { IngredientTable } from "@/components/features/inventory/IngredientTable";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";

// Metadata could go here for SEO

export default function InventoryDashboardPage() {
  const MOCK_STATS = {
    totalItems: 124,
    lowStock: 12,
    value: "$4,250.00",
  };

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {UI_TEXT.INVENTORY.TITLE}
          </h1>
          <p className="text-muted-foreground">{UI_TEXT.INVENTORY.WIP_DESC}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Add more top level actions later if needed */}
          <Button variant="outline" asChild>
            <Link href="/manager/inventory/alerts">
              <BellRing className="w-4 h-4 mr-2" />
              {UI_TEXT.INVENTORY.ALERTS_BTN}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/manager/inventory/history">
              <History className="w-4 h-4 mr-2" />
              {UI_TEXT.INVENTORY.HISTORY_BTN}
            </Link>
          </Button>
          <AddIngredientPanel />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">{UI_TEXT.INVENTORY.TOTAL_ITEMS}</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">{MOCK_STATS.totalItems}</div>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">{UI_TEXT.INVENTORY.LOW_STOCK}</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-warning">{MOCK_STATS.lowStock}</div>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              {UI_TEXT.INVENTORY.INVENTORY_VALUE}
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">{MOCK_STATS.value}</div>
          </div>
        </div>
      </div>

      <IngredientTable />
    </div>
  );
}
