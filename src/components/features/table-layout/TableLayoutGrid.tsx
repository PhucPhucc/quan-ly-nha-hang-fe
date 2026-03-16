"use client";

import { useState } from "react";

import BackgroundDot from "@/components/shared/BackgroundDot";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";
import { useTableStore } from "@/store/useTableStore";
import { Area, AreaType, Table, TableStatus } from "@/types/Table-Layout";

import AddTableDialog from "./AddTableDialog";
import EditTablePanel from "./EditTablePanel";
import TableLayoutCard from "./TableLayoutCard";

interface Props {
  area: Area;
}

const isActive = (s: TableStatus) => s !== TableStatus.OutOfService;

export default function TableLayoutGrid({ area }: Props) {
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
    <Card className="flex flex-col overflow-hidden">
      {/* ─── Summary bar ─── */}
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-6 mb-2.5">
          <span className="text-sm font-medium text-muted-foreground">
            {area.name} {UI_TEXT.COMMON.DASH}{" "}
            {stats.map((stat, index) => (
              <span key={index}>
                <strong>{stat.value}</strong> {stat.label}
                {index < stats.length - 1 && ` ${UI_TEXT.COMMON.BULLET} `}
              </span>
            ))}
          </span>
        </div>
        {area.description && (
          <p className="text-xs text-slate-500">{area.description}</p>
        )}
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

      {/* ─── Toolbar ─── */}
      <div className="border-b bg-white px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="max-w-64 w-full">
            <Input
              placeholder="Tìm kiếm bàn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <AddTableDialog
              areaType={area.type}
              existingTableCount={tables.length}
              onCreate={async ({ capacity }) => {
                await createTable(capacity, area.areaId);
              }}
            />
          </div>
        </div>
      </div>
      <BackgroundDot>
        <div className="relative p-12">
          <div className="grid min-h-100 grid-cols-4 gap-x-12 gap-y-20">
            {filtered.map((table) => (
              <div key={table.tableId} className="relative">
                <TableLayoutCard
                  table={table}
                  isSelected={selectedTable?.tableId === table.tableId}
                  onClick={handleClick}
                />
                {/* Edit panel khi selected */}
                {selectedTable?.tableId === table.tableId && (
                <EditTablePanel
                  table={table}
                  onClose={() => setSelectedTable(null)}
                  onUpdateInfo={updateTableInfo}
                  onUpdateStatus={updateTableCurrentStatus}
                  areaType={area.type}
                />
                )}
              </div>
            ))}
          </div>
        </div>
      </BackgroundDot>
      {/* ─── Grid ─── */}
    </Card>
  );
}
