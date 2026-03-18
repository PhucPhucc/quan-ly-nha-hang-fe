"use client";

import { LucideHistory } from "lucide-react";
import React, { Suspense } from "react";

import { InventoryLedgerTable } from "@/components/features/inventory/InventoryLedgerTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { UI_TEXT } from "@/lib/UI_Text";

export default function InventoryLedgerPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={UI_TEXT.INVENTORY.REPORT.LEDGER_TITLE}
        description={UI_TEXT.INVENTORY.REPORT.LEDGER_DESC}
        icon={LucideHistory}
      />
      <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 pt-4 bg-muted/20">
        <Suspense
          fallback={
            <div className="h-full w-full flex items-center justify-center font-medium animate-pulse">
              <span>{UI_TEXT.INVENTORY.REPORT.LEDGER_LOADING}</span>
            </div>
          }
        >
          <InventoryLedgerTable />
        </Suspense>
      </div>
    </div>
  );
}
