"use client";

import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { OrderItemStatus } from "@/types/enums";
import { KDSOrderItemProps } from "@/types/Kds";

import { KDSRejectModal } from "./KDSRejectModal";

/* --- Sub-components --- */

interface KDSOrderItemHeaderProps {
  name: string;
  quantity: number;
  note?: string;
}

const KDSOrderItemHeader = ({
  name,
  quantity,
  note,
  isPriority,
  status,
}: KDSOrderItemHeaderProps & { isPriority?: boolean; status: OrderItemStatus }) => (
  <div className="flex justify-between items-start gap-2 w-full">
    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
      <div className="flex items-center gap-1.5 flex-wrap">
        <h3 className="text-text-main text-sm font-bold uppercase leading-tight line-clamp-2">
          {name}
        </h3>
        {isPriority && (
          <span className="bg-amber-100 text-amber-700 px-1 py-0.5 rounded text-[8px] font-black uppercase border border-amber-200 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[10px]">star</span>
            {UI_TEXT.KDS.ITEM.VIP_LABEL}
          </span>
        )}
        <span
          className={cn(
            "px-1 py-0.5 rounded text-[8px] font-black uppercase border",
            status === OrderItemStatus.Preparing
              ? "bg-slate-100 text-slate-600 border-slate-200"
              : "bg-blue-100 text-blue-700 border-blue-200"
          )}
        >
          {status === OrderItemStatus.Preparing
            ? UI_TEXT.KDS.ITEM.STATUS_PREPARING
            : UI_TEXT.KDS.ITEM.STATUS_COOKING}
        </span>
      </div>
      {note && (
        <p className="text-muted-foreground text-[11px] italic font-medium leading-tight line-clamp-2">
          {note}
        </p>
      )}
    </div>
    <span className="text-primary text-lg font-black shrink-0 ml-auto self-start">x{quantity}</span>
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
        aria-label={`${UI_TEXT.KDS.ITEM.DONE} ${name}`}
        className="bg-[#22c55e] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase hover:bg-green-600 transition-colors"
      >
        {UI_TEXT.KDS.ITEM.DONE}
      </button>
    )}
    {showReturn && (
      <button
        onClick={onReturn}
        aria-label={`${UI_TEXT.KDS.ITEM.RETURN} ${name}`}
        className="bg-accent-red text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase hover:bg-red-600 transition-colors mt-1"
      >
        {UI_TEXT.KDS.ITEM.RETURN}
      </button>
    )}
  </div>
);

/* --- Main Component --- */

export function KDSOrderItem({
  item,
  onDone,
  onReturn,
  isPriority,
}: KDSOrderItemProps & { isPriority?: boolean }) {
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false);
  const isReady = item.status === OrderItemStatus.Ready;

  const handleDone = () => onDone?.(item.orderItemId);
  const handleReturnConfirm = (reason: string) => onReturn?.(item.orderItemId, reason);

  const hasTag = item.itemNote && item.itemNote.length > 0;

  const getTagColor = (note?: string) => {
    const text = note?.toLowerCase() || "";
    if (text.includes(UI_TEXT.KDS.ITEM.KEYWORD_ADD.toLowerCase()))
      return "bg-green-100 text-green-700 border-green-200";
    if (text.includes(UI_TEXT.KDS.ITEM.KEYWORD_LESS.toLowerCase()))
      return "bg-amber-100 text-amber-700 border-amber-200";
    if (
      text.includes(UI_TEXT.KDS.ITEM.KEYWORD_CRISPY.toLowerCase()) ||
      text.includes(UI_TEXT.KDS.ITEM.KEYWORD_MANY.toLowerCase())
    )
      return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="bg-white border border-border-subtle p-2.5 rounded-lg flex flex-col justify-between min-h-[90px] relative group">
      <div className="flex flex-col min-w-0">
        <KDSOrderItemHeader
          name={item.itemNameSnapshot}
          quantity={item.quantity}
          note={
            item.itemNote && !item.itemNote.toLowerCase().includes("return")
              ? item.itemNote
              : undefined
          }
          status={item.status}
          isPriority={isPriority}
        />
        <KDSOrderItemActions
          isReady={isReady}
          onDone={handleDone}
          onReturn={() => setIsRejectModalOpen(true)}
          showReturn={true}
          name={item.itemNameSnapshot}
        />
      </div>

      <KDSRejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleReturnConfirm}
        itemName={item.itemNameSnapshot}
      />

      <div className={cn("mt-2 flex items-center", hasTag ? "justify-start" : "hidden")}>
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
      </div>
    </div>
  );
}
