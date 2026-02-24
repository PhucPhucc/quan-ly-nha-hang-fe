import { Package } from "lucide-react";
import React from "react";

export default function InventoryPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-6 text-primary">
        <Package className="h-12 w-12" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
        Inventory Management
      </h1>
      <p className="text-muted-foreground max-w-md">
        Track stock levels, manage suppliers, and automate reordering directly from this dashboard.
        Coming soon!
      </p>
    </div>
  );
}
