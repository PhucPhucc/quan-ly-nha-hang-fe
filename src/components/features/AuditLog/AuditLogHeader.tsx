"use client";

import { ShieldCheck } from "lucide-react";

import { INVENTORY_SURFACE_CLASS } from "@/components/features/inventory/components/inventoryStyles";
import { Card, CardContent } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

interface AuditLogHeaderProps {
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export function AuditLogHeader({ totalCount, currentPage, pageSize }: AuditLogHeaderProps) {
  return (
    <Card className={cn(INVENTORY_SURFACE_CLASS, "p-4 lg:p-5")}>
      <CardContent className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6 p-0">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-4 w-4" />
            {UI_TEXT.AUDIT_LOG.TITLE_BADGE}
          </div>
          <div>
            <h1 className="text-xl font-bold leading-7 text-card-foreground">
              {UI_TEXT.AUDIT_LOG.TITLE}
            </h1>
            <p className="mt-1 text-sm text-card-foreground/70">{UI_TEXT.AUDIT_LOG.DESCRIPTION}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-xl border bg-muted px-4 py-3 text-center lg:min-w-[320px]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-card-foreground/70">
              {UI_TEXT.AUDIT_LOG.STATS.TOTAL}
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{totalCount}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-card-foreground/70">
              {UI_TEXT.AUDIT_LOG.STATS.CURRENT_PAGE}
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{currentPage}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-card-foreground/70">
              {UI_TEXT.AUDIT_LOG.STATS.PAGE_SIZE}
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{pageSize}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
