"use client";

import { LucideCalendar, LucideMessageSquare } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";

import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";
import { InventoryCheckDetail } from "@/types/Inventory";

interface InventoryCheckSidebarProps {
  check?: InventoryCheckDetail;
  isNew: boolean;
  isProcessed: boolean;
  isSaving: boolean;
  checkDate: Date;
  setCheckDate: (date: Date) => void;
  note: string;
  setNote: (note: string) => void;
}

export function InventoryCheckSidebar({
  check,
  isNew,
  isProcessed,
  isSaving,
  checkDate,
  setCheckDate,
  note,
  setNote,
}: InventoryCheckSidebarProps) {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-8 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 text-card-foreground">
          <LucideCalendar className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {UI_TEXT.INVENTORY.CHECK.COL_DATE}
          </span>
        </div>
        {isProcessed ? (
          <div className="p-4 bg-card rounded-lg text-sm font-semibold text-card-foreground border text-center">
            {new Date(checkDate).toLocaleDateString(UI_TEXT.COMMON.LOCALE_VI, {
              dateStyle: "long",
            })}
          </div>
        ) : (
          <DateRangePicker
            value={{ from: checkDate, to: checkDate }}
            onChange={(range: DateRange | undefined) => range?.from && setCheckDate(range.from)}
          />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2.5 text-card-foreground">
          <LucideMessageSquare className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {UI_TEXT.INVENTORY.FORM.DESCRIPTION}
          </span>
        </div>
        <Textarea
          disabled={isProcessed || isSaving}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={UI_TEXT.INVENTORY.FORM.PLACEHOLDER_DESCRIPTION}
          className="min-h-40 bg-card border rounded-lg resize-none text-sm font-medium p-4 focus:bg-white transition-all focus:ring-primary/10 shadow-none"
        />
      </div>

      {!isNew && (
        <div className="pt-6 border-t space-y-4">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
            <span className="text-card-foreground/80">{UI_TEXT.INVENTORY.CHECK.COL_CREATOR}</span>
            <Badge
              variant="ghost"
              className="text-card-foreground bg-card-foreground/10 px-3 py-0.5 rounded-md border-none font-bold"
            >
              {check?.createdBy || UI_TEXT.COMMON.DASH}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
            <span className="text-card-foreground/80">{UI_TEXT.INVENTORY.TABLE.COL_DATE}</span>
            <span className="text-card-foreground font-bold">
              {new Date(check?.createdAt || "").toLocaleString(UI_TEXT.COMMON.LOCALE_VI)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
