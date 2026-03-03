"use client";

import clsx from "clsx";
import { memo } from "react";

import { Table, TableStatus } from "@/types/Table-Layout";

interface Props {
  table: Table;
  isSelected: boolean;
  isEditMode: boolean;
  onClick: (table: Table) => void;
}

// Active = mọi trạng thái trừ OUT_OF_SERVICE
const isActive = (status: TableStatus) => status !== TableStatus.OUT_OF_SERVICE;

// Số indicator ghế ở trên/dưới: 3 cho capacity ≥ 4, ngược lại 2
const getChairCount = (capacity: number) => (capacity >= 4 ? 3 : 2);

// Màu card theo status (view mode)
const statusCardStyle: Record<TableStatus, string> = {
  [TableStatus.AVAILABLE]: "bg-table-available/15 border-table-available",
  [TableStatus.RESERVED]: "bg-table-reserved/15 border-table-reserved",
  [TableStatus.OCCUPIED]: "bg-table-occupied/15 border-table-occupied",
  [TableStatus.CLEANING]: "bg-table-cleaning/15 border-table-cleaning",
  [TableStatus.OUT_OF_SERVICE]:
    "bg-neutral-100 border-slate-200 cursor-not-allowed opacity-60 grayscale",
};

// Màu text mã bàn theo status
const statusTextStyle: Record<TableStatus, string> = {
  [TableStatus.AVAILABLE]: "text-[var(--color-table-available)]",
  [TableStatus.RESERVED]: "text-[var(--color-table-reserved)]",
  [TableStatus.OCCUPIED]: "text-[var(--color-table-occupied)]",
  [TableStatus.CLEANING]: "text-[var(--color-table-cleaning)]",
  [TableStatus.OUT_OF_SERVICE]: "text-slate-400",
};

// Label trạng thái
const statusLabel: Record<TableStatus, string> = {
  [TableStatus.AVAILABLE]: "Trống",
  [TableStatus.RESERVED]: "Đặt trước",
  [TableStatus.OCCUPIED]: "Đang dùng",
  [TableStatus.CLEANING]: "Đang dọn",
  [TableStatus.OUT_OF_SERVICE]: "Tạm ngưng",
};

// Màu ghế indicator theo status
const statusChairStyle: Record<TableStatus, string> = {
  [TableStatus.AVAILABLE]: "bg-[var(--color-table-available)]/60",
  [TableStatus.RESERVED]: "bg-[var(--color-table-reserved)]/60",
  [TableStatus.OCCUPIED]: "bg-[var(--color-table-occupied)]/60",
  [TableStatus.CLEANING]: "bg-[var(--color-table-cleaning)]/60",
  [TableStatus.OUT_OF_SERVICE]: "bg-slate-300",
};

function TableLayoutCard({ table, isSelected, isEditMode, onClick }: Props) {
  const active = isActive(table.status);
  const chairCount = getChairCount(table.capacity);
  const chairs = Array.from({ length: chairCount });
  const isAvailable = table.status === TableStatus.AVAILABLE;

  if (isEditMode) {
    return (
      <div className="relative flex justify-center">
        <button
          type="button"
          disabled={!isAvailable}
          onClick={() => isAvailable && onClick(table)}
          className={clsx(
            "relative flex h-28 w-48 flex-col items-center justify-center rounded-md border-2 transition-all",
            isAvailable &&
              !isSelected &&
              "cursor-pointer hover:scale-105 hover:bg-[oklch(0.88_0.04_240)]",
            !isAvailable && "cursor-not-allowed opacity-60",
            isAvailable &&
              !isSelected &&
              "border-2 border-[oklch(0.7_0.1_240)] bg-[oklch(0.92_0.04_240)] shadow-sm",
            !isAvailable && "border-2 border-[oklch(0.85_0.005_240)] bg-[oklch(0.95_0.005_240)]",
            isSelected &&
              "scale-105 border-4 border-primary bg-[oklch(0.92_0.04_240)] hover:bg-[oklch(0.88_0.04_240)] shadow-md"
          )}
        >
          {/* Ghế trên */}
          <div className="absolute -top-1.5 left-0 flex w-full justify-around px-4">
            {chairs.map((_, i) => (
              <div
                key={`t${i}`}
                className={clsx(
                  "h-1 w-3 rounded-[1px]",
                  isSelected ? "bg-primary" : statusChairStyle[table.status]
                )}
              />
            ))}
          </div>

          <span
            className={clsx(
              "text-lg font-black tracking-tight",
              isSelected ? "text-primary" : statusTextStyle[table.status]
            )}
          >
            {table.tableCode}
          </span>
          <span
            className={clsx(
              "mt-1 text-[10px] font-bold uppercase",
              isSelected ? "text-gray-500" : statusTextStyle[table.status],
              "opacity-60"
            )}
          >
            {statusLabel[table.status]} · {table.capacity} ghế
          </span>

          {/* Ghế dưới */}
          <div className="absolute -bottom-1.5 left-0 flex w-full justify-around px-4">
            {chairs.map((_, i) => (
              <div
                key={`b${i}`}
                className={clsx(
                  "h-1 w-3 rounded-[1px]",
                  isSelected ? "bg-primary" : statusChairStyle[table.status]
                )}
              />
            ))}
          </div>

          {/* Corner dots khi selected */}
          {isSelected && (
            <>
              <div className="absolute -left-2 -top-2 h-4 w-4 rounded-full border-2 border-white bg-primary shadow-sm" />
              <div className="absolute -right-2 -top-2 h-4 w-4 rounded-full border-2 border-white bg-primary shadow-sm" />
              <div className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full border-2 border-white bg-primary shadow-sm" />
              <div className="absolute -bottom-2 -right-2 h-4 w-4 rounded-full border-2 border-white bg-primary shadow-sm" />
            </>
          )}
        </button>
      </div>
    );
  }

  // ─── View mode (same shape as edit mode, colored by status) ───
  return (
    <div className="relative flex justify-center">
      <div
        className={clsx(
          "relative flex h-28 w-full flex-col items-center justify-center rounded-md border-2 transition-all",
          active ? "cursor-default" : "cursor-not-allowed opacity-60",
          statusCardStyle[table.status],
          isSelected && active && "scale-105 ring-2 ring-primary ring-offset-1"
        )}
      >
        {/* Ghế trên */}
        <div className="absolute -top-1.5 left-0 flex w-full justify-around px-4">
          {chairs.map((_, i) => (
            <div
              key={`t${i}`}
              className={clsx("h-1 w-3 rounded-[1px]", statusChairStyle[table.status])}
            />
          ))}
        </div>

        <span
          className={clsx("text-base font-black tracking-tight", statusTextStyle[table.status])}
        >
          {table.tableCode}
        </span>
        <span
          className={clsx(
            "mt-1 text-[10px] font-bold uppercase",
            statusTextStyle[table.status],
            "opacity-60"
          )}
        >
          {statusLabel[table.status]} · {table.capacity} ghế
        </span>

        {/* Ghế dưới */}
        <div className="absolute -bottom-1.5 left-0 flex w-full justify-around px-4">
          {chairs.map((_, i) => (
            <div
              key={`b${i}`}
              className={clsx("h-1 w-3 rounded-[1px]", statusChairStyle[table.status])}
            />
          ))}
        </div>

        {/* Overlay inactive */}
        {!active && <div className="absolute inset-0 z-20 rounded-md bg-white/10" />}
      </div>
    </div>
  );
}

export default memo(TableLayoutCard);

// ─── SVG icon bàn chữ nhật ───
function TableSvgIcon({ capacity, active }: { capacity: number; active: boolean }) {
  const sideChairs = Math.max(1, Math.floor((capacity - 2) / 2));
  const topChairs = Array.from({ length: sideChairs }, (_, i) => ({
    x: 22 + (56 / (sideChairs + 1)) * (i + 1),
    y: 20,
  }));
  const bottomChairs = Array.from({ length: sideChairs }, (_, i) => ({
    x: 22 + (56 / (sideChairs + 1)) * (i + 1),
    y: 80,
  }));
  const color = active ? "#94a3b8" : "#cbd5e1";

  return (
    <svg viewBox="0 0 100 100" className="h-10 w-12" aria-hidden="true">
      <rect
        x="22"
        y="35"
        width="56"
        height="30"
        rx="3"
        fill="white"
        stroke={color}
        strokeWidth="2"
      />
      {topChairs.map((p, i) => (
        <rect key={`t${i}`} x={p.x - 4} y={p.y - 4} width="8" height="4" rx="1" fill={color} />
      ))}
      {bottomChairs.map((p, i) => (
        <rect key={`b${i}`} x={p.x - 4} y={p.y} width="8" height="4" rx="1" fill={color} />
      ))}
      <rect x="10" y="46" width="4" height="8" rx="1" fill={color} />
      <rect x="86" y="46" width="4" height="8" rx="1" fill={color} />
    </svg>
  );
}
