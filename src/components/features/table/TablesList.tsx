"use client";

import { Badge } from "@/components/ui/badge";
import { UI_TEXT } from "@/lib/UI_Text";
import clsx from "clsx";
import { Clock, SprayCan, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const TablesList = () => {
  const router = useRouter();

  const handleOrder = (tableNumber: number) => {
    router.push("/order?number=" + tableNumber);
  };

  return (
    <ul className='grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-4 gap-6'>
      {tables.map((table) => (
        <li
          key={table.tableNumber}
          className={clsx(
            "w-full h-full py-2 px-3 aspect-square shadow-2xs hover:shadow-xl hover:scale-105 ring-2 transition duration-300 rounded-lg",
            {
              "bg-order-pending/50 ring-order-pending":
                table.status === "READY",
              "bg-order-cooking/50 ring-order-cooking":
                table.status === "INPROCESS",
              "bg-order-served/50 ring-order-served":
                table.status === "CLEANING",
            },
          )}
          onClick={() => handleOrder(table.tableNumber)}
        >
          <div className='w-full h-full flex flex-col justify-between items-center'>
            <p className='text-2xl font-semibold'>{table.tableNumber}</p>
            <Badge variant='outline' className='bg-white hidden md:inline'>
              {table.label}
            </Badge>
            <span className="inline md:hidden text-gray-700">
              {table.status === "CLEANING" && <SprayCan />}
              {table.status === "READY" && <Users />}
              {table.status === "INPROCESS" && <Clock />}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TablesList;

const tables = [
  { tableNumber: 1, status: "READY", label: UI_TEXT.TABLE.READY },
  { tableNumber: 2, status: "INPROCESS", label: UI_TEXT.TABLE.INPROCESS },
  { tableNumber: 3, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING },
  { tableNumber: 4, status: "READY", label: UI_TEXT.TABLE.READY },
  { tableNumber: 5, status: "INPROCESS", label: UI_TEXT.TABLE.INPROCESS },
  { tableNumber: 6, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING },
  { tableNumber: 7, status: "READY", label: UI_TEXT.TABLE.READY },
  { tableNumber: 8, status: "INPROCESS", label: UI_TEXT.TABLE.INPROCESS },
  { tableNumber: 9, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING },
  { tableNumber: 10, status: "READY", label: UI_TEXT.TABLE.READY },
  { tableNumber: 11, status: "INPROCESS", label: UI_TEXT.TABLE.INPROCESS },
  { tableNumber: 12, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING },
  { tableNumber: 13, status: "READY", label: UI_TEXT.TABLE.READY },
  { tableNumber: 14, status: "INPROCESS", label: UI_TEXT.TABLE.INPROCESS },
  { tableNumber: 15, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING },
  { tableNumber: 16, status: "READY", label: UI_TEXT.TABLE.READY },
  { tableNumber: 17, status: "INPROCESS", label: UI_TEXT.TABLE.INPROCESS },
  { tableNumber: 18, status: "CLEANING", label: UI_TEXT.TABLE.CLEANING },
  { tableNumber: 19, status: "READY", label: UI_TEXT.TABLE.READY },
  { tableNumber: 20, status: "INPROCESS", label: UI_TEXT.TABLE.INPROCESS },
];
