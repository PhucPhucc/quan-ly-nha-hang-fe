"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";

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
  const t = UI_TEXT.DASHBOARD.TABLE_OCCUPANCY;
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-bold">{t.TITLE}</CardTitle>
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-table-empty"></span>
            <span className="text-muted-foreground">{t.FREE}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-table-inprocess"></span>
            <span className="text-muted-foreground">{t.OCCUPIED}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-table-reserved"></span>
            <span className="text-muted-foreground">{t.RESERVED}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-4">
          {tableStatuses.map((table) => {
            const displayStatus =
              table.status === "occupied"
                ? t.OCCUPIED
                : table.status === "reserved"
                  ? t.RESERVED
                  : t.FREE;
            return (
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
                <span className="text-[10px] uppercase opacity-70">{displayStatus}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
