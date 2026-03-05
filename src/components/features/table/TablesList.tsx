"use client";

import { useRouter } from "next/navigation";

import { UI_TEXT } from "@/lib/UI_Text";

import TableCard from "./TableCard";

const TablesList = () => {
  const router = useRouter();

  const handleOrder = (tableNumber: number) => {
    router.push("/order?number=" + tableNumber);
  };

  return (
    <ul className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 grid-cols-3 gap-6">
      {tables.map((table) => (
        <TableCard key={table.tableNumber} table={table} onClick={handleOrder} />
      ))}
    </ul>
  );
};

export interface Table {
  tableNumber: number;
  status: "READY" | "SERVING" | "CLEANING" | "RESERVED";
  label: string;
  people: number;
}

export default TablesList;

export const tables: Table[] = [
  { tableNumber: 1, status: "READY", label: UI_TEXT.TABLE.READY, people: 2 },
  { tableNumber: 2, status: "SERVING", label: UI_TEXT.TABLE.SERVING, people: 4 },
  { tableNumber: 3, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING, people: 4 },
  { tableNumber: 4, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  { tableNumber: 5, status: "SERVING", label: UI_TEXT.TABLE.SERVING, people: 3 },
  { tableNumber: 6, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  { tableNumber: 7, status: "READY", label: UI_TEXT.TABLE.READY, people: 6 },
  { tableNumber: 8, status: "SERVING", label: UI_TEXT.TABLE.SERVING, people: 4 },
  { tableNumber: 9, status: "SERVING", label: UI_TEXT.TABLE.SERVING, people: 2 },
  { tableNumber: 10, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  { tableNumber: 11, status: "RESERVED", label: UI_TEXT.TABLE.RESERVED, people: 1 },
  { tableNumber: 12, status: "RESERVED", label: UI_TEXT.TABLE.RESERVED, people: 3 },
  { tableNumber: 13, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  { tableNumber: 14, status: "SERVING", label: UI_TEXT.TABLE.SERVING, people: 4 },
  { tableNumber: 15, status: "READY", label: UI_TEXT.TABLE.READY, people: 2 },
  { tableNumber: 16, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING, people: 4 },
  { tableNumber: 17, status: "SERVING", label: UI_TEXT.TABLE.SERVING, people: 1 },
  { tableNumber: 18, status: "SERVING", label: UI_TEXT.TABLE.SERVING, people: 6 },
  { tableNumber: 19, status: "READY", label: UI_TEXT.TABLE.READY, people: 4 },
  { tableNumber: 20, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING, people: 2 },
  { tableNumber: 21, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING, people: 2 },
  { tableNumber: 22, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING, people: 2 },
  { tableNumber: 23, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING, people: 2 },
  { tableNumber: 24, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING, people: 2 },
  { tableNumber: 25, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING, people: 2 },
];
