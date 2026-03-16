import { Save, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { AreaType, Table, TableStatus } from "@/types/Table-Layout";

import SelectCapacityTable from "./SelectCapacityTable";

interface Props {
  table: Table;
  onClose: () => void;
  onUpdateInfo: (
    tableId: string,
    payload: { tableNumber: number; capacity: number; areaId: string }
  ) => Promise<void>;
  onUpdateStatus: (tableId: string, isActive: boolean) => Promise<void>;
  areaType: AreaType;
}

export default function EditTablePanel({ table, onClose, onUpdateInfo, onUpdateStatus, areaType }: Props) {
  const [capacity, setCapacity] = useState(table.capacity);
  const [showBelow, setShowBelow] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const isVipArea = areaType === AreaType.VIP;
  const minCapacity = 1;
  const maxCapacity = isVipArea ? undefined : 6;

  useEffect(() => {
    const normalizedCapacity = Math.max(
      minCapacity,
      maxCapacity !== undefined ? Math.min(maxCapacity, table.capacity) : table.capacity
    );
    setCapacity(normalizedCapacity);
  }, [maxCapacity, minCapacity, table.capacity]);

  useEffect(() => {
    if (!panelRef.current) return;

    const checkPosition = () => {
      const rect = panelRef.current?.getBoundingClientRect();
      if (rect && rect.right > window.innerWidth - 20) {
        setShowBelow(true);
      }
    };

    // Check vị trí sau khi render
    requestAnimationFrame(checkPosition);
  }, []);

  return (
    <div
      ref={panelRef}
      className={`absolute z-50 w-72 rounded-lg border border-border bg-white shadow-2xl overflow-hidden ${
        showBelow ? "top-full left-0 mt-4" : "left-full top-0 ml-10"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <h3 className="text-sm font-bold">{UI_TEXT.TABLE.EDIT_TABLE(table.tableCode)}</h3>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      <div className="space-y-4 p-4">
        {/* Mã bàn (readonly) */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            {UI_TEXT.TABLE.TABLE_CODE}
          </label>
          <input
            readOnly
            value={table.tableCode}
            className="w-full cursor-not-allowed rounded border border-gray-200 bg-gray-100 px-3 py-2 text-sm font-bold text-gray-500 focus:outline-none"
          />
        </div>

        {/* Số ghế stepper */}
        <div className="space-y-1">
          <SelectCapacityTable
            capacity={capacity}
            setCapacity={setCapacity}
            minCapacity={minCapacity}
            maxCapacity={maxCapacity}
          />
          <p className="text-[9px] italic text-gray-400">{UI_TEXT.TABLE.DEFAULT_SHAPE_NOTE}</p>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={async () => {
              await onUpdateInfo(table.tableId, {
                capacity,
                tableNumber: table.tableNumber,
                areaId: table.areaId,
              });
              onClose();
            }}
            className="w-full rounded bg-primary py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90"
          >
            <Save className="mr-1.5 inline h-4 w-4" />
            {UI_TEXT.COMMON.SAVE}
          </button>
          {/* status-specific action */}
          {table.status === TableStatus.Cleaning || table.status === TableStatus.OutOfService ? (
            <button
              onClick={() => onUpdateStatus(table.tableId, true)}
              className="flex w-full items-center justify-center gap-2 rounded border border-green-200 py-2 text-sm font-bold text-green-600 hover:bg-green-50"
            >
              {UI_TEXT.TABLE.ACTIVATE}
            </button>
          ) : (
            <button
              onClick={() => onUpdateStatus(table.tableId, false)}
              className="flex w-full items-center justify-center gap-2 rounded border border-red-200 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
            >
              {UI_TEXT.TABLE.DEACTIVATE}
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full rounded border border-gray-300 bg-white py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            {UI_TEXT.COMMON.CANCEL}
          </button>
        </div>
      </div>
    </div>
  );
}
