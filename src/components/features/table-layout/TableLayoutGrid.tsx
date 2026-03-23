"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import BackgroundDot from "@/components/shared/BackgroundDot";
import { Card, CardHeader } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTableSignalR } from "@/hooks/useTableSignalR";
import { UI_TEXT } from "@/lib/UI_Text";
import { useTableStore } from "@/store/useTableStore";
import { Area, Table, TableStatus } from "@/types/Table-Layout";

import AddTableDialog from "./AddTableDialog";
import AreaTabs from "./AreaTabs";
import EditTablePanel from "./EditTablePanel";
import TableLayoutCard from "./TableLayoutCard";

interface Props {
  area: Area;
  onManageAreas?: () => void;
}

const isActive = (s: TableStatus) => s !== TableStatus.OutOfService;

export default function TableLayoutGrid({ area, onManageAreas }: Props) {
  useTableSignalR(); // Kích hoạt kết nối SignalR cho sơ đồ bàn
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const {
    tables,
    searchQuery,
    setSearchQuery,
    createTable,
    updateTableInfo,
    updateTableCurrentStatus,
  } = useTableStore();

  const activeCount = tables.filter((t) => isActive(t.status)).length;
  const inactiveCount = tables.filter((t) => !isActive(t.status)).length;
  const totalSeats = tables.reduce((s, t) => s + t.capacity, 0);

  const filtered = tables.filter((t) =>
    t.tableCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { value: tables.length, label: UI_TEXT.TABLE.TABLES },
    { value: totalSeats, label: UI_TEXT.TABLE.SEATS },
    { value: activeCount, label: UI_TEXT.TABLE.AVAILABLE_COUNT },
    { value: inactiveCount, label: UI_TEXT.TABLE.INACTIVE_COUNT },
  ];

  const handleClick = (table: Table) => {
    // Chỉ cho phép chỉnh sửa bàn có trạng thái ...AVAILABLE, OUT_OF_SERVICE, CLEANING
    if (table.status === TableStatus.Occupied || table.status === TableStatus.Reserved) {
      return;
    }

    setSelectedTable((prev) => (prev?.tableId === table.tableId ? null : table));
  };

  return (
    <Card className="flex flex-col flex-1 overflow-hidden min-h-0 mb-4">
      {/* ─── Summary bar ─── */}
      <CardHeader className="relative z-10 border-b px-6 py-3 space-y-3 bg-white shadow-sm">
        {/* Row 1: Area Selection + Actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <AreaTabs onManageAreas={onManageAreas} />
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-[600px] justify-end">
            <div className="relative flex-1 group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                <Search className="size-3.5" />
              </span>
              <Input
                placeholder="Tìm bàn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 rounded-xl border-slate-100 bg-slate-50/50 hover:bg-white transition-all focus-visible:ring-primary/20 text-xs w-full"
              />
            </div>
            <div className="h-6 w-px bg-slate-200 mx-1" />
            <AddTableDialog
              areaType={area.type}
              existingTableCount={tables.length}
              onCreate={async ({ capacity }) => {
                await createTable(capacity, area.areaId);
              }}
            />
          </div>
        </div>

        {/* Row 2: Stats + Legends */}
        <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 bg-slate-50/80 px-3 py-1.5 rounded-lg border border-slate-100">
              {stats.map((stat, index) => (
                <div key={index} className="flex gap-1.5">
                  <span className="text-slate-900 font-bold">{stat.value}</span>
                  <span className="font-medium opacity-60">{stat.label}</span>
                  {index < stats.length - 1 && (
                    <span className="text-slate-200 ml-1">{UI_TEXT.COMMON.PIPE}</span>
                  )}
                </div>
              ))}
            </div>
            {area.description && (
              <p className="text-[10px] text-slate-400 font-medium italic hidden lg:block">
                <span>{UI_TEXT.COMMON.QUOTE}</span>
                {area.description}
                <span>{UI_TEXT.COMMON.QUOTE}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-5 text-[9px] font-bold uppercase tracking-widest text-slate-500">
            <span className="flex items-center gap-1.5 hover:opacity-80 transition-all cursor-default">
              <span className="size-1.5 rounded-full bg-table-available shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              {UI_TEXT.TABLE.STATUS_AVAILABLE}
            </span>
            <span className="flex items-center gap-1.5 hover:opacity-80 transition-all cursor-default">
              <span className="size-1.5 rounded-full bg-table-reserved shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
              {UI_TEXT.TABLE.STATUS_RESERVED}
            </span>
            <span className="flex items-center gap-1.5 hover:opacity-80 transition-all cursor-default">
              <span className="size-1.5 rounded-full bg-table-occupied shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
              {UI_TEXT.TABLE.STATUS_OCCUPIED}
            </span>
            <span className="flex items-center gap-1.5 hover:opacity-80 transition-all cursor-default">
              <span className="size-1.5 rounded-full bg-table-cleaning shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
              {UI_TEXT.TABLE.STATUS_CLEANING}
            </span>
            <span className="flex items-center gap-1.5 hover:opacity-80 transition-all cursor-default">
              <span className="size-1.5 rounded-full bg-slate-300 shadow-[0_0_8px_rgba(100,116,139,0.3)]" />
              {UI_TEXT.TABLE.STATUS_OUT_OF_SERVICE}
            </span>
          </div>
        </div>
      </CardHeader>
      <BackgroundDot>
        <div className="relative p-6">
          <div className="grid min-h-[400px] grid-cols-4 gap-x-8 gap-y-12">
            {filtered.map((table) => (
              <div key={table.tableId} className="relative">
                <TableLayoutCard
                  table={table}
                  isSelected={selectedTable?.tableId === table.tableId}
                  onClick={handleClick}
                />
                {/* Edit panel sử dụng Dialog nên không quan trọng vị trí DOM ở đây */}
                <Dialog
                  open={selectedTable?.tableId === table.tableId}
                  onOpenChange={(open) => !open && setSelectedTable(null)}
                >
                  <EditTablePanel
                    table={table}
                    onClose={() => setSelectedTable(null)}
                    onUpdateInfo={updateTableInfo}
                    onUpdateStatus={updateTableCurrentStatus}
                    areaType={area.type}
                  />
                </Dialog>
              </div>
            ))}
          </div>
        </div>
      </BackgroundDot>
      {/* ─── Grid ─── */}
    </Card>
  );
}
