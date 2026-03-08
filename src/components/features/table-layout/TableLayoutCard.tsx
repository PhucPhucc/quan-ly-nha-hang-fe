"use client";

import clsx from "clsx";
import { memo } from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { Table, TableStatus } from "@/types/Table-Layout";

interface Props {
  table: Table;
  isSelected: boolean;
  isEditMode: boolean;
  onClick: (table: Table) => void;
}

// Active = mọi trạng thái trừ OUT_OF_SERVICE
const isActive = (status: TableStatus) => status !== TableStatus.OutOfService;

// Phân bổ ghế: ưu tiên hàng trên
const getTopChairCount = (capacity: number) => Math.ceil(capacity / 2);
const getBottomChairCount = (capacity: number) => Math.floor(capacity / 2);

// Màu card theo status (view mode)
const statusCardStyle: Record<TableStatus, string> = {
  [TableStatus.Available]: "bg-table-available/15 border-table-available",
  [TableStatus.Reserved]: "bg-table-reserved/15 border-table-reserved",
  [TableStatus.Occupied]: "bg-table-occupied/15 border-table-occupied",
  [TableStatus.Cleaning]: "bg-table-cleaning/15 border-table-cleaning",
  [TableStatus.OutOfService]:
    "bg-neutral-100 border-slate-200 cursor-not-allowed opacity-60 grayscale",
};

// Default fallback style
const DEFAULT_CARD_STYLE = "bg-slate-50 border-slate-200";

// Màu text mã bàn theo status
const statusTextStyle: Record<TableStatus, string> = {
  [TableStatus.Available]: "text-table-available",
  [TableStatus.Reserved]: "text-table-reserved",
  [TableStatus.Occupied]: "text-table-occupied",
  [TableStatus.Cleaning]: "text-table-cleaning",
  [TableStatus.OutOfService]: "text-slate-400",
};

const DEFAULT_TEXT_STYLE = "text-slate-600";

// Label trạng thái
const statusLabel: Record<TableStatus, string> = {
  [TableStatus.Available]: "Trống",
  [TableStatus.Reserved]: "Đặt trước",
  [TableStatus.Occupied]: "Đang dùng",
  [TableStatus.Cleaning]: "Đang dọn",
  [TableStatus.OutOfService]: "Tạm ngưng",
};

// Màu ghế indicator theo status
const statusChairStyle: Record<TableStatus, string> = {
  [TableStatus.Available]: "bg-table-available/60",
  [TableStatus.Reserved]: "bg-table-reserved/60",
  [TableStatus.Occupied]: "bg-table-occupied/60",
  [TableStatus.Cleaning]: "bg-table-cleaning/60",
  [TableStatus.OutOfService]: "bg-slate-300",
};

const DEFAULT_CHAIR_STYLE = "bg-slate-300";
const DEFAULT_LABEL = "Không xác định";

function TableLayoutCard({ table, isSelected, isEditMode, onClick }: Props) {
  const active = isActive(table.status);
  const topChairs = Array.from({ length: getTopChairCount(table.capacity) });
  const bottomChairs = Array.from({ length: getBottomChairCount(table.capacity) });

  // in edit mode we still want to be able to open the panel for out-of-service tables,
  // so consider a table disabled only when it's inactive *and* we're not editing.
  const disabled = !active && !isEditMode;

  const cardClasses = clsx(
    "relative flex h-28 w-full flex-col items-center justify-center rounded-md border-2 transition-all",
    disabled
      ? "cursor-not-allowed opacity-60"
      : isEditMode
        ? "cursor-pointer hover:scale-105"
        : "cursor-default",
    statusCardStyle[table.status] || DEFAULT_CARD_STYLE,
    isSelected && !disabled && "scale-105 ring-2 ring-primary ring-offset-1"
  );

  return (
    <div className="relative flex justify-center">
      <button
        type="button"
        onClick={() => onClick(table)}
        disabled={disabled}
        className={cardClasses}
      >
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
            "mt-1 text-[10px] font-bold uppercase",
            statusTextStyle[table.status] || DEFAULT_TEXT_STYLE,
            "opacity-60"
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
        {!active && <div className="absolute inset-0 z-20 rounded-md bg-white/10" />}
      </button>
    </div>
  );
}

export default memo(TableLayoutCard);
