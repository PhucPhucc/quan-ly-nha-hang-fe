"use client";

import React from "react";

import { IngredientTable } from "@/components/features/inventory/IngredientTable";

export default function InventoryDashboardPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4 pt-6">
      <IngredientTable />
    </div>
  );
}
