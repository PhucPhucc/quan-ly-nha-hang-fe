import React from "react";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";

const legendItems = [
  { status: "READY", label: UI_TEXT.TABLE.READY, color: "bg-table-empty" },
  { status: "INPROCESS", label: UI_TEXT.TABLE.INPROCESS, color: "bg-table-inprocess" },
  { status: "RESERVED", label: UI_TEXT.TABLE.RESERVED, color: "bg-table-reserved" },
  { status: "CLEANING", label: UI_TEXT.TABLE.CLEANING, color: "bg-table-cleaning" },
];

const TableLegend = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 py-4 px-2 border-b border-foreground/5 mb-4">
      {legendItems.map((item) => (
        <div key={item.status} className="flex items-center gap-2">
          <div className={cn("size-3 rounded-full shadow-sm", item.color)} />
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TableLegend;
