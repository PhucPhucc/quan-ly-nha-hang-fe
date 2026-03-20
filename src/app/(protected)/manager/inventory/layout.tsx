import React from "react";

import { InventoryNavigation } from "@/components/features/inventory/components/InventoryNavigation";

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Thanh điều hướng ngang dùng chung cho tất cả trang inventory */}
      <div className="shrink-0 border-b bg-background pt-2">
        <InventoryNavigation />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
