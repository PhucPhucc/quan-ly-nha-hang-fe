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
    <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-8 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 text-slate-500">
          <LucideCalendar className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {UI_TEXT.INVENTORY.CHECK.COL_DATE}
          </span>
        </div>
        {isProcessed ? (
          <div className="p-4 bg-slate-50 rounded-lg text-sm font-semibold text-slate-600 border border-slate-100 text-center">
            {new Date(checkDate).toLocaleDateString(UI_TEXT.COMMON.LOCALE_VI, {
              dateStyle: "long",
            })}
          </div>
        ) : (
          <div className="[&_button]:h-10 [&_button]:rounded-lg [&_button]:bg-slate-50 [&_button]:border-slate-200 [&_button]:font-bold [&_button]:text-[11px] [&_button]:uppercase [&_button]:tracking-widest shadow-none">
            <DateRangePicker
              value={{ from: checkDate, to: checkDate }}
              onChange={(range: DateRange | undefined) => range?.from && setCheckDate(range.from)}
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2.5 text-slate-500">
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
          className="min-h-[160px] bg-slate-50 border-slate-200 rounded-lg resize-none text-sm font-medium p-4 focus:bg-white transition-all focus:ring-primary/10 shadow-none"
        />
      </div>

      {!isNew && (
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
            <span className="text-slate-400">{UI_TEXT.INVENTORY.CHECK.COL_CREATOR}</span>
            <Badge
              variant="outline"
              className="text-slate-600 bg-slate-50 px-3 py-0.5 rounded-md border-none font-bold"
            >
              {check?.createdBy || UI_TEXT.COMMON.DASH}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
            <span className="text-slate-400">{UI_TEXT.INVENTORY.TABLE.COL_DATE}</span>
            <span className="text-slate-600 font-bold">
              {new Date(check?.createdAt || "").toLocaleString(UI_TEXT.COMMON.LOCALE_VI)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
