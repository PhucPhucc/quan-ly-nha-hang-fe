import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";

import TableItem from "./TableItem";

const TableList = () => {
  return (
    <ul className="grid grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-2 px-2">
      {tables.map((table) => (
        <TableItem key={table.tableNumber} table={table} />
      ))}
    </ul>
  );
};

export default TableList;

const label = [
  {
    id: 1,
    text: UI_TEXT.TABLE.READY,
    css: "bg-table-empty",
  },
  {
    id: 2,
    text: UI_TEXT.TABLE.RESERVED,
    css: "bg-table-reserved",
  },
  {
    id: 3,
    text: UI_TEXT.TABLE.CLEANING,
    css: "bg-table-cleaning",
  },
  {
    id: 4,
    text: UI_TEXT.TABLE.INPROCESS,
    css: "bg-table-inprocess",
  },
];
type Table = {
  tableNumber: number;
  status: "INPROCESS" | "READY" | "CLEANING" | "RESERVED";
  label: string;
  people: number;
};
const tables: Table[] = [
  { tableNumber: 1, status: "READY", label: UI_TEXT.TABLE.READY, people: 2 },
  { tableNumber: 2, status: "INPROCESS", label: UI_TEXT.TABLE.INPROCESS, people: 4 },
  { tableNumber: 3, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING, people: 4 },
  { tableNumber: 4, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  { tableNumber: 5, status: "INPROCESS", label: UI_TEXT.TABLE.INPROCESS, people: 3 },
  { tableNumber: 6, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  { tableNumber: 7, status: "READY", label: UI_TEXT.TABLE.READY, people: 6 },
  { tableNumber: 8, status: "INPROCESS", label: UI_TEXT.TABLE.INPROCESS, people: 4 },
  { tableNumber: 9, status: "INPROCESS", label: UI_TEXT.TABLE.INPROCESS, people: 2 },
  { tableNumber: 10, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  { tableNumber: 11, status: "RESERVED", label: UI_TEXT.TABLE.RESERVED, people: 1 },
  { tableNumber: 12, status: "RESERVED", label: UI_TEXT.TABLE.RESERVED, people: 3 },
  { tableNumber: 13, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  { tableNumber: 14, status: "INPROCESS", label: UI_TEXT.TABLE.INPROCESS, people: 4 },
  { tableNumber: 15, status: "READY", label: UI_TEXT.TABLE.READY, people: 2 },
  { tableNumber: 16, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING, people: 4 },
  { tableNumber: 17, status: "INPROCESS", label: UI_TEXT.TABLE.INPROCESS, people: 1 },
  { tableNumber: 18, status: "INPROCESS", label: UI_TEXT.TABLE.INPROCESS, people: 6 },
  { tableNumber: 19, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  { tableNumber: 20, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING, people: 2 },
];
