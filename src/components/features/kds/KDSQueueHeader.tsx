"use client";

import React, { useEffect, useRef } from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { KDSQueueHeaderProps } from "@/types/Kds";

export function KDSQueueHeader({ queueOrders, currentTime }: KDSQueueHeaderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll effect can be added here if needed, or drag-to-scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += e.deltaY;
      }
    };
    const node = scrollRef.current;
    if (node) {
      node.addEventListener("wheel", handleWheel, { passive: true });
    }
    return () => {
      if (node) {
        node.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return (
    <header className="h-16 w-full bg-white border-b border-border-subtle flex items-center shrink-0 z-10">
      <div className="px-6 border-r border-border-subtle h-full flex items-center bg-gray-50/50">
        <h2 className="text-[10px] font-black uppercase tracking-tighter text-text-secondary leading-tight w-16">
          HÀNG ĐỢI
          <br />({UI_TEXT.KDS.ORDER.PREPARING})
        </h2>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto flex items-center gap-3 px-6 no-scrollbar cursor-pointer"
      >
        {queueOrders.length === 0 && (
          <div className="text-sm text-text-secondary italic">{UI_TEXT.KDS.ORDER.EMPTY_QUEUE}</div>
        )}
        {queueOrders.map((order) => {
          const orderNumber = order.orderCode.split("-").pop() || order.orderCode;
          return (
            <div
              key={order.orderId}
              className="flex-shrink-0 bg-white text-text-secondary px-4 py-1 rounded-full border border-border-subtle font-bold text-lg hover:bg-gray-50 transition-colors"
            >
              #{orderNumber}
            </div>
          );
        })}
      </div>
      <div className="px-6 border-l border-border-subtle h-full flex items-center gap-3">
        <span className="material-symbols-outlined text-text-secondary text-base">timer</span>
        <span className="font-mono font-bold text-lg text-text-secondary">{currentTime}</span>
      </div>
    </header>
  );
}
