import { Package } from "lucide-react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";

export default function InventoryPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-6 text-primary">
        <Package className="h-12 w-12" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
        {UI_TEXT.INVENTORY.TITLE}
      </h1>
      <p className="text-muted-foreground max-w-md">{UI_TEXT.INVENTORY.WIP_DESC}</p>
    </div>
  );
}
