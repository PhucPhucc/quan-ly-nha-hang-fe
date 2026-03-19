"use client";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import React from "react";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";

import { DraftItem } from "./types/optionGroupForm";

interface OptionItemRowProps {
  item: DraftItem;
  idx: number;
  total: number;
  onUpdate: (draftId: string, patch: Partial<DraftItem>) => void;
  onRemove: (draftId: string) => void;
  onMove: (idx: number, direction: "up" | "down") => void;
}

export const OptionItemRow: React.FC<OptionItemRowProps> = ({
  item,
  idx,
  total,
  onUpdate,
  onRemove,
  onMove,
}) => (
  <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-2 items-center bg-card rounded-xl border border-border px-3 py-2.5 hover:border-primary/30 transition-colors">
    {/* Reorder buttons */}
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        title={UI_TEXT.BUTTON.UP}
        onClick={() => onMove(idx, "up")}
        disabled={idx === 0}
        className="text-muted-foreground/40 hover:text-muted-foreground disabled:opacity-20 p-0.5 flex"
      >
        <ChevronUp className="h-3 w-3" />
      </button>
      <button
        type="button"
        title={UI_TEXT.BUTTON.DOWN}
        onClick={() => onMove(idx, "down")}
        disabled={idx === total - 1}
        className="text-muted-foreground/40 hover:text-muted-foreground disabled:opacity-20 p-0.5 flex"
      >
        <ChevronDown className="h-3 w-3" />
      </button>
    </div>

    {/* Label */}
    <Input
      value={item.label}
      onChange={(e) => onUpdate(item.draftId, { label: e.target.value })}
      placeholder={UI_TEXT.MENU.OPTIONS.PLACEHOLDER_OPTION_NAME}
      className="h-8 text-sm"
    />

    {/* Extra price */}
    <div className="w-28 relative">
      <Input
        type="number"
        min={0}
        value={item.extraPrice}
        onChange={(e) => onUpdate(item.draftId, { extraPrice: Number(e.target.value) })}
        className="h-8 text-sm pr-8 text-right"
      />
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground pointer-events-none">
        {UI_TEXT.MENU.UNIT_VND}
      </span>
    </div>

    {/* Active toggle */}
    <div className="w-16 flex justify-center">
      <Switch
        checked={item.isActive}
        onCheckedChange={(v) => onUpdate(item.draftId, { isActive: v })}
        className="scale-90"
      />
    </div>

    {/* Delete */}
    <button
      type="button"
      onClick={() => onRemove(item.draftId)}
      className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
      aria-label={UI_TEXT.BUTTON.DELETE}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  </div>
);
