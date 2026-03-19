import React from "react";

import { INVENTORY_PAGE_CLASS } from "@/components/features/inventory/components/inventoryStyles";
import { InventoryAlertsTable } from "@/components/features/inventory/InventoryAlertsTable";

export default function InventoryAlertsPage() {
  return (
    <div className={INVENTORY_PAGE_CLASS}>
      <InventoryAlertsTable />
    </div>
  );
}
