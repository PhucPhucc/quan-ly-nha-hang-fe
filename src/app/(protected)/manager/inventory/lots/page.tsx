import React from "react";

import { InventoryLotsTable } from "@/components/features/inventory";
import { INVENTORY_PAGE_CLASS } from "@/components/features/inventory/components/inventoryStyles";

export default function InventoryLotsPage() {
  return (
    <div className={INVENTORY_PAGE_CLASS}>
      <InventoryLotsTable />
    </div>
  );
}
