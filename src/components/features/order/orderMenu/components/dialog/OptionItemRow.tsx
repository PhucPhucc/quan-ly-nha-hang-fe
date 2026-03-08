"use client";

import { Check } from "lucide-react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { OptionItem } from "@/types/Menu";

interface OptionItemRowProps {
  item: OptionItem;
  isSelected: boolean;
  isSingleSelect: boolean;
  onToggle: () => void;
}

const OptionItemRow: React.FC<OptionItemRowProps> = ({
  item,
  isSelected,
  isSingleSelect,
  onToggle,
}) => {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 group",
        isSelected
          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
          : "border-slate-100 hover:border-slate-300 hover:bg-slate-50/50"
      )}
    >
      <div className="flex items-center gap-3">
        {isSingleSelect ? (
          <div
            className={cn(
              "size-5 rounded-full border-2 flex items-center justify-center transition-colors",
              isSelected ? "border-primary bg-primary" : "border-slate-300 bg-white"
            )}
          >
            {isSelected && <div className="size-2 rounded-full bg-white shadow-sm" />}
          </div>
        ) : (
          <div
            className={cn(
              "size-5 rounded-lg border-2 flex items-center justify-center transition-colors",
              isSelected ? "border-primary bg-primary" : "border-slate-300 bg-white"
            )}
          >
            {isSelected && <Check className="size-3.5 text-white stroke-[3]" />}
          </div>
        )}
        <span
          className={cn(
            "text-sm transition-colors",
            isSelected ? "font-bold text-slate-900" : "font-medium text-slate-700"
          )}
        >
          {item.label}
        </span>
      </div>
      {item.extraPrice > 0 && (
        <div className="flex items-center bg-slate-100 group-hover:bg-slate-200 px-2 py-0.5 rounded-full transition-colors">
          <span className="text-[10px] font-black text-slate-600">
            {UI_TEXT.COMMON.PLUS}
            {item.extraPrice.toLocaleString()}
            {UI_TEXT.COMMON.CURRENCY}
          </span>
        </div>
      )}
    </div>
  );
};

export default OptionItemRow;
