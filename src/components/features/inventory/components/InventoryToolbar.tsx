"use client";

import React from "react";

import { cn } from "@/lib/utils";

import { INVENTORY_TOOLBAR_CLASS } from "./inventoryStyles";

type Props = {
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function InventoryToolbar({ children, actions, className }: Props) {
  return (
    <div className={cn(INVENTORY_TOOLBAR_CLASS, className)}>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">{children}</div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
