"use client";

import { History } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";

import { InventoryTransactionsTable } from "./InventoryTransactionsTable";

export function InventoryTransactionsCard() {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <History className="size-4 text-primary" />
          {UI_TEXT.INVENTORY.HISTORY_TITLE}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <InventoryTransactionsTable />
      </CardContent>
    </Card>
  );
}
