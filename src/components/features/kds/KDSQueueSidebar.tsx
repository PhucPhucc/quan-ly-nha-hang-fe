"use client";

import { Timer } from "lucide-react";
import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { KDSQueueHeaderProps } from "@/types/Kds"; // Reusing the same props interface

export function KDSQueueSidebar({ queueOrders, currentTime, onStartCooking }: KDSQueueHeaderProps) {
  return (
    <aside className="w-64 h-full bg-slate-50 border-r border-border-subtle flex flex-col shrink-0 z-10">
      {/* Header Area */}
      <div className="p-4 border-b border-border-subtle bg-white flex flex-col gap-2">
        <h2 className="text-xs font-black uppercase tracking-[0.1em] text-text-secondary">
          Hàng Đợi
          <span className="block text-[10px] opacity-60 font-medium tracking-normal mt-0.5">
            ({UI_TEXT.KDS.ORDER.PREPARING})
          </span>
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <Timer className="w-4 h-4 text-sky-500" />
          <span className="font-mono font-bold text-lg text-text-main">{currentTime}</span>
        </div>
      </div>

      {/* Queue List Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        {queueOrders.length === 0 ? (
          <div className="text-sm text-text-secondary/50 italic text-center py-4">
            {UI_TEXT.KDS.ORDER.EMPTY_QUEUE}
          </div>
        ) : (
          queueOrders.map((order) => {
            const orderNumber = order.orderCode.split("-").pop() || order.orderCode;
            const itemIds = order.orderItems.map((i) => i.orderItemId);

            return (
              <div
                key={order.orderId}
                onClick={() => {
                  if (itemIds.length > 0) {
                    onStartCooking?.(itemIds[0]); // Start first item in the order
                  }
                }}
                className="bg-white px-4 py-3 rounded-xl border border-border-subtle shadow-sm hover:border-sky-200 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest">
                    Order
                  </span>
                  <span className="font-mono font-black text-lg text-text-main group-hover:text-sky-600 transition-colors">
                    #{orderNumber}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
