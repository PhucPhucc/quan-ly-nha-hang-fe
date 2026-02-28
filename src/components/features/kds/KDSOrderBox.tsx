"use client";

import { Check } from "lucide-react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { KDSOrderBoxProps } from "@/types/Kds";

import { KDSOrderItem } from "./KDSOrderItem";

/* --- Sub-components --- */

interface KDSOrderBoxHeaderProps {
  orderCode: string;
  status: number;
  onComplete: () => void;
}

const KDSOrderBoxHeader = ({ orderCode, status, onComplete }: KDSOrderBoxHeaderProps) => (
  <div className="flex items-center justify-between px-3 py-1.5 border-b border-border-subtle bg-white shrink-0">
    <div className="flex items-center gap-2 overflow-hidden">
      <span className="bg-primary text-white px-1.5 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-tight shrink-0">
        {status === 1 ? UI_TEXT.KDS.ORDER.STATUS_SERVING : UI_TEXT.KDS.ORDER.STATUS_COOKING}
      </span>
      <h2 className="text-text-main font-mono font-black text-lg truncate whitespace-nowrap">
        {orderCode}
      </h2>
    </div>
    <button
      onClick={onComplete}
      aria-label={`${UI_TEXT.KDS.ORDER.COMPLETE_BTN} ${orderCode}`}
      className="bg-accent-green hover:bg-green-600 text-white p-1 rounded transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center"
      title={UI_TEXT.KDS.ORDER.COMPLETE_BTN}
    >
      <span className="material-symbols-outlined font-bold text-base leading-none">
        <Check />
      </span>
    </button>
  </div>
);

/* --- Main Component --- */

export function KDSOrderBox({
  order,
  onCompleteOrder,
  onItemDone,
  onItemReturn,
}: KDSOrderBoxProps) {
  const handleComplete = () => {
    if (onCompleteOrder) onCompleteOrder(order.orderId);
  };

  return (
    <section className="bg-white flex flex-col overflow-hidden h-full">
      <KDSOrderBoxHeader
        orderCode={order.orderCode}
        status={order.status}
        onComplete={handleComplete}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 p-3">
        {order.orderItems && order.orderItems.length > 0 ? (
          order.orderItems.map((item) => (
            <KDSOrderItem
              key={item.orderItemId}
              item={item}
              onDone={onItemDone}
              onReturn={onItemReturn}
              isPriority={order.isPriority}
            />
          ))
        ) : (
          <div className="text-center text-text-secondary py-8 italic text-sm">
            {UI_TEXT.KDS.ORDER.EMPTY}
          </div>
        )}
      </div>
    </section>
  );
}
