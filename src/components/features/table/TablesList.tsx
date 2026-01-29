"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { useRouter } from "next/navigation";

const TablesList = () => {
  const router = useRouter();

  const handleOrder = (tableNumber: number) => {
    router.push("/order?number=" + tableNumber);
  };

  return (
    <ul className='grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-4 gap-4'>
      {tables.map((table) => (
        <li
          key={table.tableNumber}
          className='w-full h-full p-2 bg-card aspect-square shadow-2xs hover:shadow-md border transition duration-300 rounded-lg'
        >
          <div className='flex justify-between items-center'>
            <p className='text-2xl font-semibold'>{table.tableNumber}</p>
            <span className='text-xs py-1 px-2 bg-order-served text-white rounded-2xl '>
              {table.status === "READY"}
              {UI_TEXT.TABLE.READY}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TablesList;

const tables = [
  { tableNumber: 1, status: "READY" },
  { tableNumber: 2, status: "INPROCESS" },
  { tableNumber: 3, status: "CLEANING" },
  { tableNumber: 4, status: "READY" },
  { tableNumber: 5, status: "INPROCESS" },
  { tableNumber: 6, status: "CLEANING" },
  { tableNumber: 7, status: "READY" },
  { tableNumber: 8, status: "INPROCESS" },
  { tableNumber: 9, status: "CLEANING" },
  { tableNumber: 10, status: "READY" },
  { tableNumber: 11, status: "INPROCESS" },
  { tableNumber: 12, status: "CLEANING" },
  { tableNumber: 13, status: "READY" },
  { tableNumber: 14, status: "INPROCESS" },
  { tableNumber: 15, status: "CLEANING" },
  { tableNumber: 16, status: "READY" },
  { tableNumber: 17, status: "INPROCESS" },
  { tableNumber: 18, status: "CLEANING" },
  { tableNumber: 19, status: "READY" },
  { tableNumber: 20, status: "INPROCESS" },
];
