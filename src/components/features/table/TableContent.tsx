import { Clock, User } from "lucide-react";

import { UI_TEXT } from "@/lib/UI_Text";

import { Table } from "./TablesList";

const MOCK_TIME = "45m";
const MOCK_MONEY = "400.000 VND";
const MOCK_TIME_2 = "19:30 PM";

export function TableContent({ table }: { table: Table }) {
  switch (table.status) {
    case "READY":
      return (
        <p className="flex gap-1 text-sm">
          <User className="size-4" />
          {table.people} {UI_TEXT.COMMON.PEOPLE}
        </p>
      );

    case "SERVING":
      return (
        <div className="flex flex-col gap-1">
          <p className="flex justify-between text-sm border-b pb-1">
            {UI_TEXT.COMMON.TIME_LABEL} <span>{MOCK_TIME}</span>
          </p>
          <span className="font-semibold">{MOCK_MONEY}</span>
        </div>
      );

    case "CLEANING":
      return <p className="text-sm italic">{UI_TEXT.TABLE.CLEANING}</p>;

    case "RESERVED":
      return (
        <div className="flex flex-col gap-1">
          <p className="flex items-center gap-1 text-sm font-bold border-b pb-1">
            <Clock className="size-4" /> {MOCK_TIME_2}
          </p>
          <span className="italic text-xs truncate">{table.people}</span>
        </div>
      );

    default:
      return null;
  }
}
