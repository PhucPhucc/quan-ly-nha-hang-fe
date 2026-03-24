import { Loader2, Plus } from "lucide-react";

import { useElapsedTime } from "@/hooks/useElapsedTime";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types/enums";

import DropdownFeature from "./components/DropdownFeature";

export type Table = {
  tableId?: string;
  tableNumber: number;
  status: OrderStatus;
  label: string;
  people: number;
  elapsedTime?: string;
  price?: string;
  createdAt?: string;
  orderId?: string;
  orderCount?: number;
};

type TableItemProps = {
  table: Table;
  onTableClick?: () => void;
  currentOrderCode?: string;
  isLoading?: boolean;
};
const TableItem = ({ table, onTableClick, currentOrderCode, isLoading }: TableItemProps) => {
  const timeRunning = useElapsedTime(table.createdAt);

  const isReady = table.status === OrderStatus.Ready;
  const isServing = table.status === OrderStatus.Serving;
  const isClickable = (isReady || isServing) && !!onTableClick;
  return (
    <li
      onClick={isClickable ? onTableClick : undefined}
      onKeyDown={(e) => {
        if (isClickable && onTableClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onTableClick();
        }
      }}
      // role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={cn(
        "flex flex-col items-center justify-center transition-all active:scale-90 group px-1 focus:outline-none",
        isClickable ? "cursor-pointer" : "cursor-default"
      )}
    >
      <div
        className={cn(
          "relative border-2 w-28 h-20 sm:w-36 sm:h-24 m-3 rounded-xl transition-all duration-300 shadow-sm group-hover:shadow-md overflow-visible",
          getStatusColor(table.status)
        )}
      >
        <FootTableItem position="top" color={getFootColor(table.status)} />
        <FootTableItem position="bottom" color={getFootColor(table.status)} />
        <FootTableItem position="left" color={getFootColor(table.status)} />
        <FootTableItem position="right" color={getFootColor(table.status)} />

        <div className="p-1.5 h-full flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start">
            {currentOrderCode && (
              <div className="flex items-center gap-2">
                <p className="text-[12px] font-semibold font-mono tracking-wider">
                  {UI_TEXT.COMMON.HASH}
                  {currentOrderCode.slice(-3)}
                </p>
                {(table.orderCount ?? 1) > 1 && (
                  <span className="rounded-full border border-table-serving/40 bg-background/90 px-2 py-0.5 text-[10px] font-bold text-table-serving">
                    {UI_TEXT.ORDER.BOARD.ORDER_COUNT(table.orderCount!)}
                  </span>
                )}
              </div>
            )}
            {table.status === OrderStatus.Serving && <DropdownFeature table={table} />}
          </div>

          {isReady ? (
            <div className="flex items-center justify-center flex-1">
              {isLoading ? (
                <Loader2 className="size-5 text-muted-foreground/50 animate-spin" />
              ) : (
                <Plus className="size-5 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors" />
              )}
            </div>
          ) : (
            <div className="flex justify-between items-center gap-0.5">
              {/* <p className="flex gap-1 text-xs font-bold text-foreground/70 truncate">
                <Users className="size-3 shrink-0" />
                <span>{table.people}</span>
              </p> */}
              {table.status === OrderStatus.Serving && (
                <>
                  <div className="flex items-center bg-background/90 p-1 rounded-full border border-table-serving/50">
                    <span className="text-[8px] font-black text-table-serving leading-none">
                      {timeRunning}
                    </span>
                  </div>
                  <p className="font-black text-xs text-primary truncate leading-none">
                    {table.price || "0"}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <p
        className={cn(
          "mt-3 text-[10px] font-black uppercase tracking-tighter transition-colors text-center w-full",
          table.status === OrderStatus.Ready ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {table.label}
      </p>
    </li>
  );
};

const FootTableItem = ({ position, color }: { position: string; color: string }) => {
  let cssDefault = "absolute";

  switch (position) {
    case "top":
      cssDefault += " -top-2.5 w-full h-1.5 flex justify-center gap-2 px-3";
      break;
    case "bottom":
      cssDefault += " -bottom-2.5 w-full h-1.5 flex justify-center gap-2 px-3";
      break;
    case "left":
      cssDefault += " -left-2.5 h-full flex flex-col justify-center gap-2 py-3";
      break;
    case "right":
      cssDefault += " -right-2.5 h-full flex flex-col justify-center gap-2 py-3";
      break;
    default:
      break;
  }

  return (
    <div className={cssDefault}>
      {position === "top" || position === "bottom" ? (
        <>
          <div className={cn("w-1/3 rounded-full transition-colors", color)}></div>
          <div className={cn("w-1/3 rounded-full transition-colors", color)}></div>
        </>
      ) : (
        <div className={cn("w-1.5 h-1/3 rounded-full transition-colors", color)}></div>
      )}
    </div>
  );
};

export default TableItem;

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Ready:
      return "border-table-empty/60 bg-table-empty/20";
    case OrderStatus.Serving:
      return "border-table-serving/60 bg-table-serving/20";
    case OrderStatus.Reserved:
      return "border-table-reserved/60 bg-table-reserved/20";
    case OrderStatus.OutOfService:
      return "border-table-out-of-service/60 bg-table-out-of-service/20";
    default:
      return "border-secondary-foreground/30";
  }
};

const getFootColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Ready:
      return "bg-table-empty/50";
    case OrderStatus.Serving:
      return "bg-table-serving/50";
    case OrderStatus.Reserved:
      return "bg-table-reserved/50";
    case OrderStatus.OutOfService:
      return "bg-table-out-of-service/50";
    default:
      return "bg-secondary-foreground/40";
  }
};
