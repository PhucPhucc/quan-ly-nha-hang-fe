"use client";

import { BellRing, History } from "lucide-react";
import Link from "next/link";
import React from "react";

import { AddIngredientPanel } from "@/components/features/inventory/AddIngredientPanel";
import { IngredientTable } from "@/components/features/inventory/IngredientTable";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";

// Metadata could go here for SEO

export default function InventoryDashboardPage() {
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
          <Button variant="outline" className="rounded-xl shadow-sm" asChild>
            <Link href="/manager/inventory/alerts">
              <BellRing className="w-4 h-4 mr-2 text-destructive" />
              {UI_TEXT.INVENTORY.ALERTS_BTN}
            </Link>
          </Button>
          <Button variant="outline" className="rounded-xl shadow-sm" asChild>
            <Link href="/manager/inventory/history">
              <History className="w-4 h-4 mr-2" />
              {UI_TEXT.INVENTORY.HISTORY_BTN}
            </Link>
          </Button>
          <AddIngredientPanel />
        </div>
      </div>

      <IngredientTable />
    </div>
  );
}
