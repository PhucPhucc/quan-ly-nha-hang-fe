"use client";

import React from "react";

import { KDSOrderBoxProps } from "@/types/Kds";

import { KDSOrderItem } from "./KDSOrderItem";

/* --- Sub-components --- */

interface KDSOrderBoxHeaderProps {
  orderCode: string;
  status: number;
  onComplete: () => void;
}

const KDSOrderBoxHeader = ({ orderCode, status, onComplete }: KDSOrderBoxHeaderProps) => (
  <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle bg-white shrink-0">
    <div className="flex items-center gap-3">
      <span className="bg-primary text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
        {status === 1 ? "SERVING" : "COOKING"}
      </span>
      <h2 className="text-text-main font-mono font-black text-2xl">{orderCode}</h2>
    </div>
    <button
      onClick={onComplete}
      aria-label={`Hoàn tất đơn ${orderCode}`}
      className="bg-accent-green hover:bg-green-600 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="material-symbols-outlined font-bold text-lg">done_all</span>
      <span className="text-xs font-black uppercase tracking-tight">HOÀN TẤT ĐƠN</span>
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
    <section className="bg-background-main flex flex-col overflow-hidden min-h-0">
      <KDSOrderBoxHeader
        orderCode={order.orderCode}
        status={order.status}
        onComplete={handleComplete}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 grid grid-cols-2 gap-2 content-start">
        {order.orderItems && order.orderItems.length > 0 ? (
          order.orderItems.map((item) => (
            <KDSOrderItem
              key={item.orderItemId}
              item={item}
              onDone={onItemDone}
              onReturn={onItemReturn}
            />
          ))
        ) : (
          <div className="col-span-2 text-center text-text-secondary py-8 italic text-sm">
            Không có món trong đơn
          </div>
        )}
      </div>
    </section>
  );
}
