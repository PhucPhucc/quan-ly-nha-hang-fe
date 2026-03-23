"use client";

import { Plus } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";

import { OptionItemRow } from "./OptionItemRow";
import { DraftItem } from "./types/optionGroupForm";

interface OptionItemListProps {
  items: DraftItem[];
  onAdd: () => void;
  onUpdate: (draftId: string, patch: Partial<DraftItem>) => void;
  onRemove: (draftId: string) => void;
}

export const OptionItemList: React.FC<OptionItemListProps> = ({
  items,
  onAdd,
  onUpdate,
  onRemove,
}) => (
  <section className="space-y-4">
    {/* Section header */}
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {UI_TEXT.MENU.OPTIONS.COMBO_ITEMS}
        </h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {UI_TEXT.MENU.OPTIONS.ITEMS_HINT}
        </p>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={onAdd} className="shrink-0">
        <Plus className="h-4 w-4 mr-1.5" />
        {UI_TEXT.MENU.OPTIONS.ADD_ITEM_BTN}
      </Button>
    </div>

    {/* Empty state */}
    {items.length === 0 ? (
      <div className="rounded-xl border border-dashed border-border p-8 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">{UI_TEXT.MENU.OPTIONS.EMPTY_COMBO}</p>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1.5" />
          {UI_TEXT.MENU.OPTIONS.ADD_ITEM_BTN}
        </Button>
      </div>
    ) : (
      <div className="space-y-2">
        {items.map((item) => (
          <OptionItemRow key={item.draftId} item={item} onUpdate={onUpdate} onRemove={onRemove} />
        ))}

        <p className="px-1 text-[11px] text-muted-foreground">
          {items.length} {UI_TEXT.MENU.OPTIONS.ITEMS_COUNT_SUFFIX}
        </p>
      </div>
    )}
  </section>
);
