"use client";

import React from "react";
import TableItem, { Table } from "./TableItem";
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
      <TableLegend />

      <ScrollArea className="flex-1 overflow-auto" type="always">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 pt-4 pb-10 px-2">
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
