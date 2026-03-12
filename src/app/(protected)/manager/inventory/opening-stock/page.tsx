import React from "react";

import { OpeningStockEntry } from "@/components/features/inventory/OpeningStockEntry";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { UI_TEXT } from "@/lib/UI_Text";

export default function OpeningStockPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/manager/dashboard">
                {UI_TEXT.SIDE_BAR.DASHBOARD}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/manager/inventory">{UI_TEXT.INVENTORY.TITLE}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{UI_TEXT.INVENTORY.OPENING_STOCK.TITLE}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {UI_TEXT.INVENTORY.OPENING_STOCK.TITLE}
          </h1>
          <p className="text-muted-foreground text-sm">{UI_TEXT.INVENTORY.OPENING_STOCK.DESC}</p>
        </div>
      </div>

      <div className="fade-in-up">
        <OpeningStockEntry />
      </div>
    </div>
  );
}
