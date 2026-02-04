"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tableStatuses = [
  { id: "T-01", status: "occupied" },
  { id: "T-02", status: "free" },
  { id: "T-03", status: "occupied" },
  { id: "T-04", status: "occupied" },
  { id: "T-05", status: "reserved" },
  { id: "T-06", status: "free" },
  { id: "T-07", status: "occupied" },
  { id: "T-08", status: "free" },
  { id: "T-09", status: "occupied" },
  { id: "T-10", status: "free" },
  { id: "T-11", status: "occupied" },
  { id: "T-12", status: "occupied" },
];

export function TableStatusOverview() {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-bold">Table Occupancy</CardTitle>
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-table-empty"></span>
            <span className="text-muted-foreground">Free</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-table-inprocess"></span>
            <span className="text-muted-foreground">Occupied</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-table-reserved"></span>
            <span className="text-muted-foreground">Reserved</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-4">
          {tableStatuses.map((table) => (
            <div
              key={table.id}
              className={`
                flex aspect-square flex-col items-center justify-center rounded-lg border-2 transition-all hover:scale-105
                ${
                  table.status === "occupied"
                    ? "border-table-inprocess bg-table-inprocess/5 text-table-inprocess shadow-table-inprocess/20"
                    : table.status === "reserved"
                      ? "border-table-reserved bg-table-reserved/5 text-table-reserved shadow-table-reserved/20"
                      : "border-table-empty bg-table-empty/5 text-table-empty shadow-table-empty/20"
                }
              `}
            >
              <span className="text-sm font-bold">{table.id}</span>
              <span className="text-[10px] uppercase opacity-70">{table.status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
