"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { OrderItemStatus } from "@/types/enums";
import { KDSOrderItemProps } from "@/types/Kds";

/* --- Sub-components --- */

interface KDSOrderItemHeaderProps {
  name: string;
  quantity: number;
}

const KDSOrderItemHeader = ({ name, quantity }: KDSOrderItemHeaderProps) => (
  <div className="flex justify-between items-start gap-2">
    <h3 className="text-text-main text-sm font-bold uppercase leading-tight line-clamp-2">
      {name}
    </h3>
    <span className="text-primary text-lg font-black shrink-0">x{quantity}</span>
  </div>
);

interface KDSOrderItemActionsProps {
  isReady: boolean;
  onDone: () => void;
  onReturn?: () => void;
  showReturn: boolean;
  name: string;
}

const KDSOrderItemActions = ({
  isReady,
  onDone,
  onReturn,
  showReturn,
  name,
}: KDSOrderItemActionsProps) => (
  <div className="flex flex-col items-end gap-1 mt-1">
    {!isReady && (
      <button
        onClick={onDone}
        aria-label={`Hoàn thành món ${name}`}
        className="bg-[#22c55e] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase hover:bg-green-600 transition-colors"
      >
        Done
      </button>
    )}
    {showReturn && (
      <button
        onClick={onReturn}
        aria-label={`Trả món ${name}`}
        className="bg-accent-red text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase hover:bg-red-600 transition-colors mt-1"
      >
        Return
      </button>
    )}
  </div>
);

/* --- Main Component --- */

export function KDSOrderItem({ item, onDone, onReturn }: KDSOrderItemProps) {
  const isReady = item.status === OrderItemStatus.Ready;

  const handleDone = () => onDone?.(item.orderItemId);
  const handleReturn = () => onReturn?.(item.orderItemId);

  const hasTag = item.itemNote && item.itemNote.length > 0;

  // Tag color mapping
  const getTagColor = (note?: string) => {
    const n = note?.toLowerCase() || "";
    if (n.includes("thêm")) return "bg-red-50 text-red-700 border-red-100";
    if (n.includes("ít")) return "bg-blue-50 text-blue-700 border-blue-100";
    if (n.includes("giòn")) return "bg-yellow-50 text-yellow-700 border-yellow-100";
    if (n.includes("nhiều")) return "bg-green-50 text-green-700 border-green-100";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const timeDate = new Date(item.createdAt);
  const formattedTime = !isNaN(timeDate.getTime())
    ? timeDate.toTimeString().substring(0, 5)
    : "00:00";

  return (
    <div className="bg-white border border-border-subtle p-2.5 rounded-lg flex flex-col justify-between min-h-[90px] relative group">
      <div className="flex flex-col">
        <KDSOrderItemHeader name={item.itemNameSnapshot} quantity={item.quantity} />
        <KDSOrderItemActions
          isReady={isReady}
          onDone={handleDone}
          onReturn={handleReturn}
          showReturn={!!item.itemNote?.includes("return")}
          name={item.itemNameSnapshot}
        />
      </div>

      <div className={cn("mt-2 flex items-center", hasTag ? "justify-between" : "justify-end")}>
        {hasTag && (
          <span
            className={cn(
              "border px-1.5 py-0.5 rounded text-[10px] font-bold",
              getTagColor(item.itemNote)
            )}
          >
            {item.itemNote?.toUpperCase()}
          </span>
        )}
        <div className="flex items-center gap-1 text-text-secondary">
          <span className="material-symbols-outlined text-sm">schedule</span>
          <span className="text-xs font-bold font-mono">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
}
