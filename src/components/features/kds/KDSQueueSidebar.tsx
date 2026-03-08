"use client";

import { Timer } from "lucide-react";
import React, { useEffect, useState } from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { useKdsStore } from "@/store/useKdsStore";

export function KDSQueueSidebar() {
  const orders = useKdsStore((s) => s.queueOrders);
  const startCooking = useKdsStore((s) => s.startCooking);

  // Manage currentTime internally
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside
      className="w-64 h-full bg-background-50 border-r border-border-subtle 
      flex flex-col shrink-0 z-10"
    >
      {/* Header Area */}
      <div className="p-4 border-b border-border flex flex-col gap-2">
        <div className="flex items-center justify-between pointer-events-none">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {UI_TEXT.KDS.QUEUE}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-medium text-slate-300">
              {UI_TEXT.COMMON.PAREN_LEFT}
            </span>
            <span className="text-[10px] font-bold text-slate-500">{orders.length}</span>
            <span className="text-[10px] font-medium text-slate-300">
              {UI_TEXT.COMMON.PAREN_RIGHT}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Timer className="w-4 h-4 text-sky-500" />
          <span className="font-mono font-bold text-lg text-text-main">{currentTime}</span>
        </div>
      </div>

      {/* Queue List Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        {orders.length === 0 ? (
          <div className="text-sm text-text-secondary/50 text-center py-4">
            {UI_TEXT.KDS.ORDER.EMPTY_QUEUE}
          </div>
        ) : (
          orders.map((order) => {
            const orderNumber = order.orderCode.split("-").pop() || order.orderCode;
            const itemIds = order.orderItems.map((i) => i.orderItemId);

            return (
              <div
                key={order.orderId}
                onClick={() => {
                  if (itemIds.length > 0) {
                    startCooking(itemIds[0]); // Start first item in the order
                  }
                }}
                className="bg-white px-4 py-3 rounded-xl border border-border-subtle shadow-sm hover:border-sky-200 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest">
                    {UI_TEXT.KDS.ORDER_LABEL}
                  </span>
                  <span className="font-mono font-black text-lg text-text-main group-hover:text-sky-600 transition-colors">
                    {UI_TEXT.COMMON.HASH}
                    {orderNumber}
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
