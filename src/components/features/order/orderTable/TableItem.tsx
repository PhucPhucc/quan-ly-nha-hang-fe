"use client";

import { UtensilsCrossed } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

export type TableStatus = "INPROCESS" | "READY" | "CLEANING" | "RESERVED";

export type Table = {
  tableNumber: number;
  status: TableStatus;
  label: string;
  people: number;
  elapsedTime?: string;
  price?: string;
};

interface TableItemProps {
  table: Table;
  onClick?: (table: Table) => void;
}

const TableItem = ({ table, onClick }: TableItemProps) => {
  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case "READY":
        return "border-table-empty/60 bg-table-empty/20";
      case "INPROCESS":
        return "border-table-inprocess/60 bg-table-inprocess/20";
      case "RESERVED":
        return "border-table-reserved/60 bg-table-reserved/20";
      case "CLEANING":
        return "border-table-cleaning/60 bg-table-cleaning/20";
      default:
        return "border-secondary-foreground/30";
    }
  };

  const getFootColor = (status: TableStatus) => {
    switch (status) {
      case "READY":
        return "bg-table-empty/50";
      case "INPROCESS":
        return "bg-table-inprocess/50";
      case "RESERVED":
        return "bg-table-reserved/50";
      case "CLEANING":
        return "bg-table-cleaning/50";
      default:
        return "bg-secondary-foreground/40";
    }
  };

  return (
    <li
      onClick={() => onClick?.(table)}
      className="flex flex-col items-center justify-center cursor-pointer transition-all active:scale-90 group px-1"
    >
      <div
        className={cn(
          "relative border-2 w-28 h-20 sm:w-32 sm:h-24 rounded-xl transition-all duration-300 shadow-sm group-hover:shadow-md overflow-visible",
          getStatusColor(table.status)
        )}
      >
        <FootTableItem position="top" color={getFootColor(table.status)} />
        <FootTableItem position="bottom" color={getFootColor(table.status)} />
        <FootTableItem position="left" color={getFootColor(table.status)} />
        <FootTableItem position="right" color={getFootColor(table.status)} />

        <div className="p-1.5 h-full flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-black font-mono">
              #{table.tableNumber.toString().padStart(2, "0")}
            </p>
            {table.status === "INPROCESS" && (
              <div className="flex items-center gap-0.5 bg-background/90 px-0.5 rounded border border-table-inprocess/50">
                <span className="text-[7px] font-black text-table-inprocess leading-none">
                  {table.elapsedTime || "25m"}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="flex items-center gap-0.5 text-[8px] font-bold text-foreground/70 truncate">
              <UtensilsCrossed className="size-2 shrink-0" />
              <span>{table.people} Khách</span>
            </p>
            {table.status === "INPROCESS" && (
              <p className="font-black text-[9px] text-primary truncate leading-none">
                {table.price || "0"}
              </p>
            )}
          </div>
        </div>
      </div>
      <p
        className={cn(
          "mt-1.5 text-[8px] font-black uppercase tracking-tighter transition-colors text-center w-full",
          table.status === "READY" ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {table.label}
      </p>
    </li>
  );
};

const FootTableItem = ({ position, color }: { position: string; color: string }) => {
  let cssDefault = "absolute";

  switch (position) {
    case "top":
      cssDefault += " -top-2 w-full h-1.5 flex justify-center gap-2 px-3";
      break;
    case "bottom":
      cssDefault += " -bottom-2 w-full h-1.5 flex justify-center gap-2 px-3";
      break;
    case "left":
      cssDefault += " -left-2 h-full flex flex-col justify-center gap-2 py-3";
      break;
    case "right":
      cssDefault += " -right-2 h-full flex flex-col justify-center gap-2 py-3";
      break;
    default:
      break;
  }

  return (
    <div className={cssDefault}>
      {position === "top" || position === "bottom" ? (
        <>
          <div className={cn("w-1/3 rounded-full transition-colors", color)}></div>
          <div className={cn("w-1/3 rounded-full transition-colors", color)}></div>
        </>
      ) : (
        <div className={cn("w-1.5 h-1/3 rounded-full transition-colors", color)}></div>
      )}
    </div>
  );
};

export default TableItem;
