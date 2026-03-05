import clsx from "clsx";
import { memo } from "react";

import { StatusBadge } from "./StatusBadge";
import { TableContent } from "./TableContent";
import { Table } from "./TablesList";

interface TableCardProps {
  table: Table;
  onClick: (id: number) => void;
}

function TableCard({ table, onClick }: TableCardProps) {
  return (
    <li
      className={clsx(baseStyle, statusStyle[table.status], "focus:outline-none focus:ring-4")}
      onClick={() => onClick(table.tableNumber)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(table.tableNumber);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Bàn số ${table.tableNumber}, trạng thái ${table.status}`}
    >
      <p className="text-2xl font-semibold">{table.tableNumber}</p>

      <StatusBadge table={table} />

      <TableContent table={table} />
    </li>
  );
}

export default memo(TableCard);

const baseStyle = `
  relative w-full h-full py-3 px-4 aspect-4/3
  shadow-2xs flex flex-col justify-between
  space-y-2 cursor-pointer
  hover:shadow-xl hover:scale-105
  ring-2 transition duration-300 rounded-lg
`;

const statusStyle = {
  READY: "bg-table-empty/5 ring-table-empty",
  SERVING: "bg-table-serving/5 ring-table-serving",
  CLEANING: "bg-table-cleaning ring-table-cleaning text-white",
  RESERVED: "bg-table-reserved/5 ring-table-reserved",
};
