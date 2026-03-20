"use client";

import { Trash2 } from "lucide-react";
import React from "react";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";

import { DraftItem } from "./types/optionGroupForm";

interface OptionItemRowProps {
  item: DraftItem;
  onUpdate: (draftId: string, patch: Partial<DraftItem>) => void;
  onRemove: (draftId: string) => void;
}

export const OptionItemRow: React.FC<OptionItemRowProps> = ({ item, onUpdate, onRemove }) => (
  <div className="relative rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md md:p-5">
    <button
      type="button"
      onClick={() => onRemove(item.draftId)}
      className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive md:right-5 md:top-5"
      aria-label={UI_TEXT.BUTTON.DELETE}
    >
      <Trash2 className="h-4.5 w-4.5" />
    </button>

    <div className="min-w-0 space-y-4 pt-8">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {UI_TEXT.MENU.OPTIONS.ITEM_LABEL_COL}
          </label>
          <Input
            value={item.label}
            onChange={(e) => onUpdate(item.draftId, { label: e.target.value })}
            placeholder={UI_TEXT.MENU.OPTIONS.PLACEHOLDER_OPTION_NAME}
            className="h-11 w-full text-sm focus-visible:ring-primary/20"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {UI_TEXT.MENU.OPTIONS.PRICE_EXTRA}
          </label>
          <div className="relative">
            <Input
              type="number"
              min={0}
              value={item.extraPrice}
              onChange={(e) => onUpdate(item.draftId, { extraPrice: Number(e.target.value) })}
              className="h-11 w-full pr-12 text-right text-sm focus-visible:ring-primary/20"
            />
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-muted-foreground">
              {UI_TEXT.MENU.UNIT_VND}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-muted/35 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {UI_TEXT.MENU.OPTIONS.IS_ACTIVE_LABEL}
          </p>
          <p className="text-xs text-muted-foreground">{UI_TEXT.MENU.OPTIONS.ACTIVE_HINT}</p>
        </div>

        <Switch
          checked={item.isActive}
          onCheckedChange={(v) => onUpdate(item.draftId, { isActive: v })}
          className="data-[state=checked]:bg-primary"
        />
      </div>
    </div>
  </div>
);
