import { Save } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

export default function EditTablePanel({
  table,
  onClose,
  onUpdateInfo,
  onUpdateStatus,
  areaType,
}: Props) {
  const [capacity, setCapacity] = useState(table.capacity);

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

  return (
    <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl">
      {/* Header */}
      <DialogHeader className="px-6 py-4 border-b bg-slate-50/50">
        <DialogTitle className="text-xl font-bold text-slate-800">
          {UI_TEXT.TABLE.EDIT_TABLE(table.tableCode)}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 p-6">
        {/* Mã bàn (readonly) */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {UI_TEXT.TABLE.TABLE_CODE}
          </label>
          <div className="w-full rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-bold text-slate-500">
            {table.tableCode}
          </div>
        </div>

        {/* Số ghế stepper */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {UI_TEXT.TABLE.SEATS}
          </label>
          <SelectCapacityTable
            capacity={capacity}
            setCapacity={setCapacity}
            minCapacity={minCapacity}
            maxCapacity={maxCapacity}
          />
          <p className="text-[11px] italic text-slate-400 mt-2">
            {UI_TEXT.COMMON.ASTERISK} {UI_TEXT.COMMON.DEFAULT_SHAPE_NOTE}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <Button
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20"
            onClick={async () => {
              await onUpdateInfo(table.tableId, {
                capacity,
                tableNumber: table.tableNumber,
                areaId: table.areaId,
              });
              onClose();
            }}
          >
            <Save className="mr-2 h-5 w-5" />
            {UI_TEXT.COMMON.SAVE}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            {table.status === TableStatus.Cleaning || table.status === TableStatus.OutOfService ? (
              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-bold h-11 rounded-xl"
                onClick={() => onUpdateStatus(table.tableId, true)}
              >
                {UI_TEXT.TABLE.ACTIVATE}
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold h-11 rounded-xl"
                onClick={() => onUpdateStatus(table.tableId, false)}
              >
                {UI_TEXT.TABLE.DEACTIVATE}
              </Button>
            )}

            <Button
              variant="ghost"
              className="text-slate-500 hover:bg-slate-100 font-bold h-11 rounded-xl"
              onClick={onClose}
            >
              {UI_TEXT.COMMON.CANCEL}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
