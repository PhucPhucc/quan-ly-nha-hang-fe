"use client";

import { Plus, Save, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";
import { tableService } from "@/services/tableService";
import { Area, Table, TableStatus } from "@/types/Table-Layout";

import AddTableDialog from "./AddTableDialog";
import TableLayoutCard from "./TableLayoutCard";

interface Props {
  area: Area;
  tables: Table[];
}

const isActive = (s: TableStatus) => s !== TableStatus.OutOfService;

export default function TableLayoutGrid({ area, tables }: Props) {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // copy props into local state so we can append new tables
  const [localTables, setLocalTables] = useState<Table[]>(tables);

  // keep in sync if parent updates
  useEffect(() => {
    setLocalTables(tables);
  }, [tables]);

  const activeCount = tables.filter((t) => isActive(t.status)).length;
  const inactiveCount = tables.filter((t) => !isActive(t.status)).length;
  const totalSeats = tables.reduce((s, t) => s + t.capacity, 0);

  const filtered = localTables.filter((t) =>
    t.tableCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleClick = (table: Table) => {
    // Chỉ cho phép chỉnh sửa bàn có trạng thái ...AVAILABLE, OUT_OF_SERVICE, CLEANING trong edit mode
    if (
      isEditMode &&
      table.status !== TableStatus.Available &&
      table.status !== TableStatus.OutOfService &&
      table.status !== TableStatus.Cleaning
    ) {
      return;
    }
    setSelectedTable((prev) => (prev?.tableId === table.tableId ? null : table));
  };

  const handleToggleEdit = () => {
    setIsEditMode((prev) => !prev);
    setSelectedTable(null);
    setSearch("");
  };

  return (
    <Card className="flex flex-col overflow-hidden">
      {/* ─── Summary bar ─── */}
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-6 mb-2.5">
          <span className="text-sm font-medium text-muted-foreground">
            {area.name} – <strong>{tables.length} </strong> {UI_TEXT.TABLE.TABLES} · {totalSeats}{" "}
            {UI_TEXT.TABLE.SEATS} · <strong>{activeCount}</strong> {UI_TEXT.TABLE.AVAILABLE_COUNT} ·{" "}
            <strong>{inactiveCount}</strong> {UI_TEXT.TABLE.INACTIVE_COUNT}
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-sm border border-table-available bg-table-available/60" />
            {UI_TEXT.TABLE.STATUS_AVAILABLE}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-sm border border-table-reserved bg-table-reserved/60" />
            {UI_TEXT.TABLE.STATUS_RESERVED}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-sm border border-table-occupied bg-table-occupied/60" />
            {UI_TEXT.TABLE.STATUS_OCCUPIED}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-sm border border-table-cleaning bg-table-cleaning/60" />
            {UI_TEXT.TABLE.STATUS_CLEANING}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-sm border border-slate-300 bg-slate-100" />
            {UI_TEXT.TABLE.STATUS_OUT_OF_SERVICE}
          </span>
        </div>
      </CardHeader>

      {/* ─── View mode toolbar ─── */}
      {!isEditMode && (
        <div className="flex items-center justify-between border-b bg-white px-6 py-3">
          {/* Search */}
          <div className="w-64">
            <Input
              placeholder="Tìm kiếm bàn..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Edit mode toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">{UI_TEXT.TABLE.EDIT_MODE}</span>
              <button
                onClick={handleToggleEdit}
                className="relative flex h-5 w-10 items-center rounded-full bg-gray-300 transition-colors"
              >
                <span className="absolute left-1 h-3.5 w-3.5 rounded-full bg-white shadow transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit mode toolbar ─── */}
      {isEditMode && (
        <div className="border-b bg-white px-6 py-2.5">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="w-64">
              <Input
                placeholder="Tìm kiếm bàn..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex items-center gap-2">
              {/* Toggle off */}
              <div className="mr-2 flex items-center gap-3 rounded border border-slate-200 bg-slate-50 px-3 py-1.5">
                <span className="text-sm font-bold uppercase tracking-tight text-slate-700">
                  {UI_TEXT.TABLE.EDIT_MODE}
                </span>
                <button
                  onClick={handleToggleEdit}
                  className="relative flex h-5 w-10 items-center rounded-full bg-primary transition-colors"
                >
                  <span className="absolute right-1 h-3.5 w-3.5 rounded-full bg-white shadow" />
                </button>
              </div>

              <div className="mx-1 h-8 w-px bg-gray-200" />

              <button
                onClick={() => {
                  setIsEditMode(false);
                  setSelectedTable(null);
                }}
                className="rounded border border-gray-300 bg-white px-5 py-2 text-sm font-bold shadow-sm hover:bg-gray-50"
              >
                {UI_TEXT.COMMON.CANCEL}
              </button>
              <button className="rounded bg-primary px-5 py-2 text-sm font-bold text-white shadow-sm hover:opacity-90">
                {UI_TEXT.TABLE.SAVE_CHANGES}
              </button>
              <div className="mx-1 h-8 w-px bg-gray-200" />
              <button
                onClick={() => setAddDialogOpen(true)}
                className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                {UI_TEXT.TABLE.ADD_TABLE}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Grid ─── */}
      {isEditMode ? (
        // Edit mode: grid-bg, larger cards
        <div className="relative flex-1 overflow-auto">
          {/* add dialog */}
          <AddTableDialog
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            onCreate={async ({ capacity }) => {
              try {
                const response = await tableService.createTable({
                  capacity,
                  areaId: area.areaId,
                });

                if (response.isSuccess) {
                  toast.success("Thêm bàn thành công");
                  // Refresh tables
                  const refreshRes = await tableService.getTablesByArea(area.areaId);
                  if (refreshRes.isSuccess && refreshRes.data) {
                    setLocalTables(refreshRes.data);
                  }
                }
              } catch (error) {
                console.error("Failed to create table:", error);
                toast.error("Không thể thêm bàn");
              }
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "radial-gradient(oklch(0.8 0.005 240) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative p-12">
            <div className="grid min-h-100 grid-cols-4 gap-x-12 gap-y-20">
              {filtered.map((table) => (
                <div key={table.tableId} className="relative">
                  <TableLayoutCard
                    table={table}
                    isSelected={selectedTable?.tableId === table.tableId}
                    isEditMode={true}
                    onClick={handleClick}
                  />
                  {/* Edit panel khi selected */}
                  {selectedTable?.tableId === table.tableId && (
                    <EditTablePanel
                      table={table}
                      onClose={() => setSelectedTable(null)}
                      onUpdate={(updatedTable) => {
                        setLocalTables((prev) =>
                          prev.map((t) => (t.tableId === updatedTable.tableId ? updatedTable : t))
                        );
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // View mode: card grid
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((table) => (
              <div key={table.tableId} className="relative">
                <TableLayoutCard
                  table={table}
                  isSelected={selectedTable?.tableId === table.tableId}
                  isEditMode={false}
                  onClick={handleClick}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Edit panel (xuất hiện bên phải bàn đang chọn ở edit mode) ───
function EditTablePanel({
  table,
  onClose,
  onUpdate,
}: {
  table: Table;
  onClose: () => void;
  onUpdate: (table: Table) => void;
}) {
  const [capacity, setCapacity] = useState(table.capacity);
  const [showBelow, setShowBelow] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

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
      className={`absolute z-50 w-72 rounded-lg border border-gray-200 bg-white shadow-2xl ${showBelow ? "top-full left-0 mt-4" : "left-full top-0 ml-10"
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-lg border-b border-gray-100 bg-gray-50 px-4 py-3">
        <h3 className="text-sm font-bold uppercase">Chỉnh sửa bàn {table.tableCode}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 p-4">
        {/* Mã bàn (readonly) */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Mã bàn
          </label>
          <input
            readOnly
            value={table.tableCode}
            className="w-full cursor-not-allowed rounded border border-gray-200 bg-gray-100 px-3 py-2 text-sm font-bold text-gray-500 focus:outline-none"
          />
        </div>

        {/* Số ghế stepper */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Số ghế
          </label>
          <div className="flex items-center">
            <button
              onClick={() => setCapacity((v) => Math.max(1, v - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-l border border-gray-300 hover:bg-gray-50"
            >
              −
            </button>
            <div className="flex h-10 flex-1 items-center justify-center border-y border-gray-300 text-lg font-bold">
              {capacity}
            </div>
            <button
              onClick={() => setCapacity((v) => Math.min(6, v + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-r border border-gray-300 hover:bg-gray-50"
            >
              +
            </button>
          </div>
          <p className="text-[9px] italic text-gray-400">* Bàn mặc định hình chữ nhật</p>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={async () => {
              try {
                const response = await tableService.updateTable(table.tableId, {
                  capacity,
                  tableNumber: table.tableNumber,
                  areaId: table.areaId,
                });
                if (response.isSuccess && response.data) {
                  toast.success("Cập nhật thành công");
                  onUpdate(response.data);
                  onClose();
                }
              } catch (error: any) {
                toast.error(error.message || "Không thể cập nhật");
              }
            }}
            className="w-full rounded bg-primary py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90"
          >
            <Save className="mr-1.5 inline h-4 w-4" />
            {UI_TEXT.COMMON.SAVE}
          </button>
          {/* status-specific action */}
          {table.status === TableStatus.Cleaning || table.status === TableStatus.OutOfService ? (
            <button
              onClick={async () => {
                try {
                  const response = await tableService.updateTableStatus(table.tableId, true);
                  if (response.isSuccess && table.tableId) {
                    toast.success("Đã kích hoạt bàn");
                    onUpdate({ ...table, status: TableStatus.Available });
                  }
                } catch (error) {
                  toast.error("Thao tác thất bại");
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded border border-green-200 py-2 text-sm font-bold text-green-600 hover:bg-green-50"
            >
              {UI_TEXT.TABLE.ACTIVATE}
            </button>
          ) : (
            <button
              onClick={async () => {
                try {
                  const response = await tableService.updateTableStatus(table.tableId, false);
                  if (response.isSuccess && table.tableId) {
                    toast.success("Đã ngưng hoạt động bàn");
                    onUpdate({ ...table, status: TableStatus.OutOfService });
                  }
                } catch (error) {
                  toast.error("Thao tác thất bại");
                }
              }}
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
