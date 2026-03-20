"use client";

import React from "react";

import { INVENTORY_PAGE_CLASS } from "@/components/features/inventory/components/inventoryStyles";
import { InventoryReportTable } from "@/components/features/inventory/InventoryReportTable";
export default function InventoryReportPage() {
  return (
    <div className={INVENTORY_PAGE_CLASS}>
      <InventoryReportTable />
    </div>
  );
}
