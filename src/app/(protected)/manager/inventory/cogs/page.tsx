import React from "react";

import { InventoryCogsContainer } from "@/components/features/inventory";
import { INVENTORY_PAGE_CLASS } from "@/components/features/inventory/components/inventoryStyles";

export default function InventoryCogsPage() {
  return (
    <div className={INVENTORY_PAGE_CLASS}>
      <InventoryCogsContainer />
    </div>
  );
}
