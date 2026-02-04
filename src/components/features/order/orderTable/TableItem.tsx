import { UtensilsCrossed } from "lucide-react";
import React from "react";

type Table = {
  tableNumber: number;
  status: "INPROCESS" | "READY" | "CLEANING" | "RESERVED";
  label: string;
  people: number;
};
const TableItem = ({ table }: { table: Table }) => {
  return (
    <li className="aspect-3/4 rounded-md flex flex-col items-center justify-center hover:bg-secondary-foreground/10">
      <div className="relative border-2 w-full h-16 border-secondary-foreground/30 rounded-2xl">
        <FootTableItem position="top" />

        <FootTableItem position="bottom" />

        <FootTableItem position="left" />

        <FootTableItem position="right" />

        <div className="p-2 text-xs">
          <div className="flex justify-between ">
            <p>60.000</p>
            <p>2g6p</p>
          </div>
          <p className="flex items-center gap-1 text-secondary-foreground/70 mt-0.5">
            <UtensilsCrossed className="size-3" />
            <span>{table.people}</span>
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm"></p>
    </li>
  );
};

const FootTableItem = ({ position }: { position: string }) => {
  let cssDefault = "absolute";

  switch (position) {
    case "top":
      cssDefault += " -top-2 w-full h-1 flex justify-center gap-2 px-2";
      break;
    case "bottom":
      cssDefault += " -bottom-2 w-full h-1 flex justify-center gap-2 px-2";
      break;
    case "left":
      cssDefault += " -left-2 h-full flex flex-col justify-center gap-2 py-2";
      break;
    case "right":
      cssDefault += " -right-2 h-full flex flex-col justify-center gap-2 py-2";
      break;
    default:
      break;
  }

  return (
    <div className={cssDefault}>
      {position === "top" || position === "bottom" ? (
        <>
          <div className="w-1/2 bg-secondary-foreground/30 rounded-md"></div>
          <div className="w-1/2 bg-secondary-foreground/30 rounded-md"></div>
        </>
      ) : (
        <div className="w-1 h-full bg-secondary-foreground/30 rounded-md"></div>
      )}
    </div>
  );
};

export default TableItem;
