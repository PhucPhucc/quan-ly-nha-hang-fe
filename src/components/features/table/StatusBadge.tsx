import clsx from "clsx";

import { Badge } from "@/components/ui/badge";

import { Table } from "./TablesList";

export function StatusBadge({ table }: { table: Table }) {
  return (
    <Badge
      variant="outline"
      className={clsx(
        "absolute top-3 right-3 text-xs px-2 py-1 font-bold border-2",
        badgeStyle[table.status]
      )}
    >
      {table.label}
    </Badge>
  );
}

const badgeStyle = {
  READY: "bg-table-empty/15 text-table-empty border-table-empty",
  INPROCESS: "bg-table-inprocess/15 text-table-inprocess border-table-inprocess",
  CLEANING: "bg-table-cleaning/15 text-table-cleaning border-table-cleaning",
  RESERVED: "bg-table-reserved/15 text-table-reserved border-table-reserved",
};
