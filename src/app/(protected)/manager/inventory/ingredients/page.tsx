"use client";

import React from "react";

import { INVENTORY_PAGE_CLASS } from "@/components/features/inventory/components/inventoryStyles";
import { IngredientTable } from "@/components/features/inventory/IngredientTable";

export default function InventoryIngredientsPage() {
  return (
    <div className={INVENTORY_PAGE_CLASS}>
      <IngredientTable />
    </div>
  );
}
