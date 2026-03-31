"use client";

import { Loader2 } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UI_TEXT } from "@/lib/UI_Text";
import { MenuItemOptionGroup, OptionItem, SetMenuItemPreview } from "@/types/Menu";

import OptionGroupSection from "./OptionGroupSection";

interface SelectionOptionsContentProps {
  optionGroups: MenuItemOptionGroup[];
  selectedOptions: Record<string, OptionItem[]>;
  loading: boolean;
  comboLoading: boolean;
  comboChildren: SetMenuItemPreview[];
  comboOptionGroupsByChildId: Record<string, MenuItemOptionGroup[]>;
  comboSelectedOptionsByChildId: Record<string, Record<string, OptionItem[]>>;
  note: string;
  menuItemName: string;
  onToggleOption: (group: MenuItemOptionGroup, item: OptionItem, isChecked: boolean) => void;
  onToggleComboOption: (
    childMenuItemId: string,
    group: MenuItemOptionGroup,
    item: OptionItem,
    isChecked: boolean
  ) => void;
  onNoteChange: (value: string) => void;
}

export const SelectionOptionsContent: React.FC<SelectionOptionsContentProps> = ({
  optionGroups,
  selectedOptions,
  loading,
  comboLoading,
  comboChildren,
  comboOptionGroupsByChildId,
  comboSelectedOptionsByChildId,
  note,
  menuItemName,
  onToggleOption,
  onToggleComboOption,
  onNoteChange,
}) => {
  if (loading || comboLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-6">
        {optionGroups.map((group) => (
          <OptionGroupSection
            key={group.optionGroupId}
            group={group}
            selectedItems={selectedOptions[group.optionGroupId] || []}
            onToggle={(item, isChecked) => onToggleOption(group, item, isChecked)}
          />
        ))}

        {comboChildren.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-black uppercase tracking-[0.18em] text-primary">
                  {UI_TEXT.ORDER.COMBO.ITEMS_LABEL}
                </h4>
                <p className="text-xs text-slate-500">{UI_TEXT.ORDER.COMBO.ITEMS_SELECTION_HINT}</p>
              </div>
              <Badge variant="outline" className="text-[10px] font-black uppercase">
                {comboChildren.length}
              </Badge>
            </div>

            {comboChildren.map((child) => {
              const groups = comboOptionGroupsByChildId[child.menuItemId] || [];
              const selected = comboSelectedOptionsByChildId[child.menuItemId] || {};

              return (
                <div
                  key={child.menuItemId}
                  className="rounded-2xl border border-slate-200 p-3 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">
                        {child.menuItemName || child.menuItemId}
                      </p>
                      <p className="text-xs text-slate-500">
                        {UI_TEXT.ORDER.COMBO.QUANTITY_LABEL} {child.quantity}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-black uppercase">
                      {UI_TEXT.ORDER.COMBO.QUANTITY_SEPARATOR}
                      {child.quantity}
                    </Badge>
                  </div>

                  {groups.map((group) => (
                    <OptionGroupSection
                      key={`${child.menuItemId}:${group.optionGroupId}`}
                      group={group}
                      selectedItems={selected[group.optionGroupId] || []}
                      onToggle={(item, isChecked) =>
                        onToggleComboOption(child.menuItemId, group, item, isChecked)
                      }
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700">
            {UI_TEXT.MENU.OPTIONS.ITEM_NOTE} {UI_TEXT.COMMON.PAREN_LEFT}
            {menuItemName}
            {UI_TEXT.COMMON.PAREN_RIGHT}
          </Label>
          <Input
            placeholder="Ví dụ: Ít cay, không hành..."
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            className="border-slate-200 focus:border-primary hover:border-slate-300 transition-colors"
          />
        </div>

        <Separator className="opacity-40" />
      </div>
    </ScrollArea>
  );
};
