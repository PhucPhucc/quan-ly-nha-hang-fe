"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OptionGroup, OptionItem } from "@/types/Menu";

import OptionItemRow from "./OptionItemRow";

interface OptionGroupSectionProps {
  group: OptionGroup;
  selectedItems: OptionItem[];
  onToggle: (item: OptionItem, isChecked: boolean) => void;
}

const OptionGroupSection: React.FC<OptionGroupSectionProps> = ({
  group,
  selectedItems,
  onToggle,
}) => {
  const isSingleSelect = group.optionType === 1;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
            {group.name}
            {group.isRequired && <span className="text-destructive font-black">*</span>}
          </h4>
          <p className="text-[10px] text-slate-500 font-medium tracking-wide flex items-center gap-1">
            {isSingleSelect ? (
              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">Chọn 1</span>
            ) : (
              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                Tối đa {group.maxSelect}
              </span>
            )}
            {group.isRequired && (
              <span className="bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">
                Bắt buộc
              </span>
            )}
          </p>
        </div>
        {group.isRequired && (
          <Badge
            variant={selectedItems.length > 0 ? "outline" : "destructive"}
            className={`
              text-[9px] px-2 py-0 h-5 font-black uppercase tracking-widest transition-all
              ${selectedItems.length > 0 ? "border-emerald-500 text-emerald-600 bg-emerald-50" : ""}
            `}
          >
            {selectedItems.length > 0 ? "Đã chọn" : "Cần chọn"}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {group.optionItems?.map((item) => {
          const isSelected = selectedItems.some((i) => i.optionItemId === item.optionItemId);
          return (
            <OptionItemRow
              key={item.optionItemId}
              item={item}
              isSelected={isSelected}
              isSingleSelect={isSingleSelect}
              onToggle={() => onToggle(item, !isSelected)}
            />
          );
        })}
      </div>
      <Separator className="opacity-50" />
    </div>
  );
};

export default OptionGroupSection;
