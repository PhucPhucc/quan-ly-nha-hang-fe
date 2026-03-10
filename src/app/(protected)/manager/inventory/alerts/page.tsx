import React from "react";

import { InventoryAlertsTable } from "@/components/features/inventory/InventoryAlertsTable";

export default function InventoryAlertsPage() {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <InventoryAlertsTable />
    </div>
  );
}
