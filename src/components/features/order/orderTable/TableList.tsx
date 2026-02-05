"use client";

import React from "react";
import TableItem, { Table } from "./TableItem";
import TableStats from "./TableStats";
import TableLegend from "./TableLegend";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockTables } from "./mockData";

interface TableListProps {
  statusFilter?: string;
}

const TableList = ({ statusFilter = "all" }: TableListProps) => {
  const filteredTables =
    statusFilter === "all"
      ? mockTables
      : mockTables.filter((t) => t.status.toLowerCase() === statusFilter.toLowerCase());

  return (
    <div className="flex flex-col h-full min-h-0">
      <TableStats tables={mockTables} />
      <TableLegend />

      <ScrollArea className="flex-1 mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 px-2 pb-24">
          {filteredTables.map((table) => (
            <TableItem key={table.tableNumber} table={table} />
          ))}
        </div>

        {filteredTables.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-sm">Không tìm thấy bàn nào</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default TableList;
