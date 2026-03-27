"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

import { INVENTORY_PAGINATION_BUTTON_CLASS } from "@/components/features/inventory/components/inventoryStyles";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

interface AuditLogPaginationProps {
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function AuditLogPagination({
  page,
  totalPages,
  loading,
  onPageChange,
}: AuditLogPaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-border/50 bg-card px-4 py-3 shadow-none">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {UI_TEXT.AUDIT_LOG.STATS.CURRENT_PAGE} {page}
        {totalPages > 0 ? ` / ${totalPages}` : ""}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className={cn(
            INVENTORY_PAGINATION_BUTTON_CLASS,
            "h-8 px-3 text-[10px] font-bold uppercase tracking-widest rounded-lg"
          )}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={loading || page <= 1}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {UI_TEXT.AUDIT_LOG.PREVIOUS}
        </Button>
        <Button
          variant="outline"
          className={cn(
            INVENTORY_PAGINATION_BUTTON_CLASS,
            "h-8 px-3 text-[10px] font-bold uppercase tracking-widest rounded-lg"
          )}
          onClick={() => onPageChange(page + 1)}
          disabled={loading || totalPages === 0 || page >= totalPages}
        >
          {UI_TEXT.AUDIT_LOG.NEXT}
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
