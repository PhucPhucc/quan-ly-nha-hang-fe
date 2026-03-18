"use client";

import { INVENTORY_PAGE_CLASS } from "@/components/features/inventory/components/inventoryStyles";
import { InventoryLedgerTable } from "@/components/features/inventory/InventoryLedgerTable";

export default function InventoryLedgerPage() {
  return (
    <div className={INVENTORY_PAGE_CLASS}>
      <InventoryLedgerTable />
    </div>
  );
}
