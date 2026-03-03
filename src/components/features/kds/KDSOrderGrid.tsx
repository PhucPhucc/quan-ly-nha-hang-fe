"use client";

import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { useKdsStore } from "@/store/useKdsStore";

import { KDSItemCard } from "./KDSItemCard";

export function KDSOrderGrid() {
  const orders = useKdsStore((s) => s.activeOrders);

  // Flatten order items to get a list of items to display
  const allOrderItems = orders.flatMap((order) =>
    (order.orderItems || []).map((item) => ({
      ...order,
      orderItems: [item],
    }))
  );

  // We only display the first 4 items in the grid columns based on the requirement
  const itemsToDisplay = allOrderItems.slice(0, 4);

  if (allOrderItems.length === 0) {
    return (
      <main className="flex-1 w-full bg-border-subtle overflow-hidden flex items-center justify-center">
        <div className="text-text-secondary text-2xl font-black font-display opacity-50 uppercase tracking-tighter">
          {UI_TEXT.KDS.ORDER.EMPTY_GRID}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full bg-white flex flex-col overflow-hidden">
      {/* WIP Information Bar - Simplified */}
      <div className="px-10 py-4 flex items-center justify-between border-b border-border-subtle bg-white shadow-sm z-10">
        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">
          Khu vực chế biến • Station 1
        </div>
      </div>

      <div className="flex-1 w-full overflow-hidden flex flex-col custom-scrollbar overflow-y-auto bg-slate-100 p-4 gap-4">
        {itemsToDisplay.map((virtualOrder) => {
          const item = virtualOrder.orderItems[0];
          return (
            <div
              key={`${virtualOrder.orderId}-${item.orderItemId}`}
              className="shrink-0 flex flex-col bg-white rounded-xl shadow-sm border border-border-subtle overflow-hidden"
            >
              <KDSItemCard
                item={item}
                orderCode={virtualOrder.orderCode}
                orderType={virtualOrder.orderType}
              />
            </div>
          );
        })}

        {/* Fill empty rows to maintain the 4-row look if there are fewer than 4 items */}
        {itemsToDisplay.length < 4 &&
          Array.from({ length: 4 - itemsToDisplay.length }).map((_, idx) => (
            <div
              key={`empty-col-${idx}`}
              className="shrink-0 flex flex-col bg-gray-50/50 rounded-xl border border-dashed border-border-subtle min-h-[140px]"
            ></div>
          ))}
      </div>
    </main>
  );
}
