"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Table, TableStatus } from "@/types/Table-Layout";

interface Props {
  table: Table;
  onClose: () => void;
}

const statusLabel: Record<TableStatus, string> = {
  [TableStatus.Available]: "Trống",
  [TableStatus.Reserved]: "Đặt trước",
  [TableStatus.Occupied]: "Đang dùng",
  [TableStatus.Cleaning]: "Đang dọn",
  [TableStatus.OutOfService]: "Tạm ngưng",
};

const canOrder = (s: TableStatus) => s === TableStatus.Available;

export default function TableInfoPopover({ table, onClose }: Props) {
  const router = useRouter();
  const isActive = table.status !== TableStatus.OutOfService;

  return (
    <div className="absolute left-full top-1/2 z-50 ml-4 w-64 -translate-y-1/2 rounded-lg border border-slate-200 bg-white p-4 shadow-xl">
      {/* Arrow */}
      <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-b border-l border-slate-200 bg-white" />

      <div className="relative z-10">
        <div className="mb-2 flex items-start justify-between">
          <h4 className="font-bold text-slate-900">Bàn {table.tableCode}</h4>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {statusLabel[table.status]}
            </span>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="mb-4 text-xs text-slate-500">Hình chữ nhật · {table.capacity} ghế</p>

        <button
          disabled={!canOrder(table.status)}
          onClick={() =>
            router.push(`/order?tableId=${table.tableId}&tableCode=${table.tableCode}`)
          }
          className="w-full rounded bg-primary py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Tạo Order
        </button>
      </div>
    </div>
  );
}
