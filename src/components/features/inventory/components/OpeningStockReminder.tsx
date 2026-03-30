"use client";

import { ArrowRight, CircleAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";

const COMPLETED_OPENING_STOCK_STATUS = 2;
const OPENING_STOCK_REMINDER_TEXT = {
  title: UI_TEXT.INVENTORY.OPENING_STOCK_REMINDER_TITLE,
  description: UI_TEXT.INVENTORY.OPENING_STOCK_REMINDER_DESC,
  action: UI_TEXT.INVENTORY.OPENING_STOCK_REMINDER_ACTION,
} as const;

export function shouldShowOpeningStockReminder(
  settings?: { openingStockStatus?: number | string; lockedAt?: string | null } | null
) {
  if (!settings) {
    return true;
  }

  return (
    !settings.lockedAt &&
    settings.openingStockStatus !== COMPLETED_OPENING_STOCK_STATUS &&
    settings.openingStockStatus !== "Completed"
  );
}

interface OpeningStockReminderProps {
  settings?: { openingStockStatus?: number | string; lockedAt?: string | null } | null;
}

export function OpeningStockReminder({ settings }: OpeningStockReminderProps) {
  if (!shouldShowOpeningStockReminder(settings)) {
    return null;
  }

  return (
    <div className="hidden h-10 items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 px-3 text-amber-950 shadow-sm md:flex lg:px-4">
      <div className="flex items-center gap-2">
        <CircleAlert className="h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-[13px] font-semibold">{OPENING_STOCK_REMINDER_TEXT.title}</p>
      </div>
      <div className="h-4 w-px bg-amber-300/50" />
      <Button
        asChild
        size="sm"
        variant="ghost"
        className="h-6 p-2 text-xs font-bold hover:bg-primary/80 hover:text-primary-foreground"
      >
        <Link href="/manager/inventory/opening-stock">
          {OPENING_STOCK_REMINDER_TEXT.action} <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
}
