import React from "react";

import { StockHistoryTable } from "@/components/features/inventory/StockHistoryTable";
import { UI_TEXT } from "@/lib/UI_Text";

export default function StockHistoryPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="flex flex-col mb-4">
        <h1 className="text-2xl font-semibold mb-1">{UI_TEXT.INVENTORY.HISTORY_TITLE}</h1>
        <p className="text-muted-foreground text-sm">{UI_TEXT.INVENTORY.HISTORY_DESC}</p>
      </div>
      <StockHistoryTable />
    </div>
  );
}
