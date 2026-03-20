import React from "react";

import { MenuNavigation } from "@/components/features/menu/components/MenuNavigation";

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b bg-background pt-2">
        <MenuNavigation />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
