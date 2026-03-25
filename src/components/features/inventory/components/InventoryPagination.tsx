"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";

import { INVENTORY_PAGINATION_BUTTON_CLASS } from "./inventoryStyles";

interface InventoryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
}

export function InventoryPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}: InventoryPaginationProps) {
  if (totalPages <= 1 && totalItems <= pageSize) return null;

  return (
    <div className="flex items-center justify-between px-8 py-3 bg-muted/5 border-t border-border/20 shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-background p-1 pr-4 rounded-lg shadow-sm border border-border/40">
          <div className="flex h-7 w-12 items-center justify-center rounded-lg bg-primary/5">
            <span className="text-xs font-black tabular-nums text-primary/80">{currentPage}</span>
          </div>
          <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest px-0.5">
            {UI_TEXT.INVENTORY.TABLE.SLASH}
          </span>
          <span className="text-xs font-black tabular-nums text-muted-foreground/40">
            {totalPages}
          </span>
        </div>

        <div className="flex flex-col -gap-0.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 leading-tight">
            {UI_TEXT.COMMON.PAGINATION.TOTAL}
          </span>
          <span className="text-sm font-black text-foreground/50 tabular-nums leading-tight">
            {totalItems}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`${INVENTORY_PAGINATION_BUTTON_CLASS} h-9 px-4 rounded-lg hover:bg-muted text-[10px] font-black uppercase tracking-widest gap-2`}
        >
          <ChevronLeft className="h-3 w-3" />
          {UI_TEXT.COMMON.PAGINATION.PREV}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`${INVENTORY_PAGINATION_BUTTON_CLASS} h-9 px-4 rounded-lg hover:bg-muted text-[10px] font-black uppercase tracking-widest gap-2`}
        >
          {UI_TEXT.COMMON.PAGINATION.NEXT}
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
