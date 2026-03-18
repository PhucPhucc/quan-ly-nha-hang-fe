"use client";

import { LucideClipboardCheck } from "lucide-react";
import React from "react";

import { InventoryCheckTable } from "@/components/features/inventory/InventoryCheckTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { UI_TEXT } from "@/lib/UI_Text";

export default function InventoryCheckListPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={UI_TEXT.INVENTORY.CHECK.TITLE}
        description={UI_TEXT.INVENTORY.CHECK.DESC}
        icon={LucideClipboardCheck}
      />
      <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 pt-4">
        <InventoryCheckTable />
      </div>
    </div>
  );
}
