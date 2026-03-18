"use client";

import { LucideBarChart3 } from "lucide-react";
import React from "react";

import { InventoryReportTable } from "@/components/features/inventory/InventoryReportTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { UI_TEXT } from "@/lib/UI_Text";

export default function InventoryReportPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title={UI_TEXT.INVENTORY.REPORT.TITLE}
        description={UI_TEXT.INVENTORY.REPORT.DESC}
        icon={LucideBarChart3}
      />
      <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 pt-4 bg-muted/20">
        <InventoryReportTable />
      </div>
    </div>
  );
}
