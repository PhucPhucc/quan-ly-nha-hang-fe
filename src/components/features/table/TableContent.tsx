import { Clock, User } from "lucide-react";

import { Table } from "./TablesList";

export function TableContent({ table }: { table: Table }) {
  switch (table.status) {
    case "READY":
      return (
        <p className="flex gap-1 text-sm">
          <User className="size-4" />
          {table.people} người
        </p>
      );

    case "SERVING":
      return (
        <div className="flex flex-col gap-1">
          <p className="flex justify-between text-sm border-b pb-1">
            Thời gian: <span>45m</span>
          </p>
          <span className="font-semibold">400.000 VND</span>
        </div>
      );

    case "CLEANING":
      return <p className="text-sm italic">Đang dọn dẹp</p>;

    case "RESERVED":
      return (
        <div className="flex flex-col gap-1">
          <p className="flex items-center gap-1 text-sm font-bold border-b pb-1">
            <Clock className="size-4" /> 19:30 PM
          </p>
          <span className="italic text-xs truncate">{table.people}</span>
        </div>
      );

    default:
      return null;
  }
}
