"use client";

import clsx from "clsx";
import { memo } from "react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { Table, TableStatus } from "@/types/Table-Layout";

interface Props {
  table: Table;
  isSelected: boolean;
  onClick: (table: Table) => void;
}

// Phân bổ ghế: ưu tiên hàng trên
const getTopChairCount = (capacity: number) => Math.ceil(capacity / 2);
const getBottomChairCount = (capacity: number) => Math.floor(capacity / 2);

// Màu card theo status (view mode)
const statusCardStyle: Record<TableStatus, string> = {
  [TableStatus.Available]:
    "bg-table-available/15 hover:bg-table-available/10 border-table-available",
  [TableStatus.Reserved]: "bg-table-reserved/15 hover:bg-table-reserved/10 border-table-reserved",
  [TableStatus.Occupied]: "bg-table-occupied/15 hover:bg-table-occupied/10 border-table-occupied",
  [TableStatus.OutOfService]: "bg-neutral-100 border-slate-200 opacity-60 grayscale",
};

// Default fallback style
const DEFAULT_CARD_STYLE = "bg-slate-50 border-slate-200";

// Màu text mã bàn theo status
const statusTextStyle: Record<TableStatus, string> = {
  [TableStatus.Available]: "text-table-available",
  [TableStatus.Reserved]: "text-table-reserved",
  [TableStatus.Occupied]: "text-table-occupied",
  [TableStatus.OutOfService]: "text-slate-400",
};

const DEFAULT_TEXT_STYLE = "text-slate-600";

// Label trạng thái
const statusLabel: Record<TableStatus, string> = {
  [TableStatus.Available]: UI_TEXT.TABLE.STATUS_AVAILABLE,
  [TableStatus.Reserved]: UI_TEXT.TABLE.STATUS_RESERVED,
  [TableStatus.Occupied]: UI_TEXT.TABLE.STATUS_OCCUPIED,
  [TableStatus.OutOfService]: UI_TEXT.TABLE.STATUS_OUT_OF_SERVICE,
};

// Màu ghế indicator theo status
const statusChairStyle: Record<TableStatus, string> = {
  [TableStatus.Available]: "bg-table-available/60",
  [TableStatus.Reserved]: "bg-table-reserved/60",
  [TableStatus.Occupied]: "bg-table-occupied/60",
  [TableStatus.OutOfService]: "bg-slate-300",
};

const DEFAULT_CHAIR_STYLE = "bg-slate-300";
const DEFAULT_LABEL = UI_TEXT.COMMON.EMPTY;

function TableLayoutCard({ table, isSelected, onClick }: Props) {
  const topChairs = Array.from({ length: getTopChairCount(table.capacity) });
  const bottomChairs = Array.from({ length: getBottomChairCount(table.capacity) });

  // consider a table disabled only when it's out of service.

  const cardClasses = clsx(
    "relative flex h-28 w-full flex-col items-center justify-center rounded-md border-2 hover:scale-105 transition-all duration-300",
    statusCardStyle[table.status] || DEFAULT_CARD_STYLE,
    isSelected && "scale-105 border-primary ring-offset-1"
  );

  return (
    <div className="relative flex justify-center">
      <Button variant="ghost" onClick={() => onClick(table)} className={cardClasses}>
        {/* Ghế trên */}
        <div className="absolute -top-1.5 left-0 flex w-full justify-around px-4">
          {topChairs.map((_, i) => (
            <div
              key={`t${i}`}
              className={clsx(
                "h-1.5 w-3.5 rounded-t-sm",
                statusChairStyle[table.status] || DEFAULT_CHAIR_STYLE
              )}
            />
          ))}
        </div>

        <span
          className={clsx(
            "text-base font-black tracking-tight",
            statusTextStyle[table.status] || DEFAULT_TEXT_STYLE
          )}
        >
          {table.tableCode}
        </span>
        <span
          className={clsx(
            "mt-1 text-[10px] font-bold uppercase opacity-60",
            statusTextStyle[table.status] || DEFAULT_TEXT_STYLE
          )}
        >
          {statusLabel[table.status] || DEFAULT_LABEL} {UI_TEXT.COMMON.BULLET} {table.capacity}{" "}
          {UI_TEXT.TABLE.SEAT_SUFFIX}
        </span>

        {/* Ghế dưới */}
        <div className="absolute -bottom-1.5 left-0 flex w-full justify-around px-4">
          {bottomChairs.map((_, i) => (
            <div
              key={`b${i}`}
              className={clsx(
                "h-1.5 w-3.5 rounded-b-sm",
                statusChairStyle[table.status] || DEFAULT_CHAIR_STYLE
              )}
            />
          ))}
        </div>

        {/* Overlay inactive */}
        {/* {!active && <div className="absolute inset-0 z-20 rounded-md bg-white/10" />} */}
      </Button>
    </div>
  );
}

export default memo(TableLayoutCard);
