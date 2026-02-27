"use client";

import { Loader2 } from "lucide-react";
import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OptionGroup, OptionItem } from "@/types/Menu";

import OptionGroupSection from "./OptionGroupSection";

interface SelectionOptionsContentProps {
  optionGroups: OptionGroup[];
  selectedOptions: Record<string, OptionItem[]>;
  loading: boolean;
  note: string;
  menuItemName: string;
  onToggleOption: (group: OptionGroup, item: OptionItem, isChecked: boolean) => void;
  onNoteChange: (value: string) => void;
}

export const SelectionOptionsContent: React.FC<SelectionOptionsContentProps> = ({
  optionGroups,
  selectedOptions,
  loading,
  note,
  menuItemName,
  onToggleOption,
  onNoteChange,
}) => {
  if (loading) {
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

        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700">Ghi chú món ({menuItemName})</Label>
          <Input
            placeholder="Ví dụ: Ít cay, không hành..."
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            className="border-slate-200 focus:border-primary hover:border-slate-300 transition-colors"
          />
        </div>
      </div>
    </ScrollArea>
  );
};
