"use client";

import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { KDSOrderGridProps } from "@/types/Kds";

import { KDSOrderBox } from "./KDSOrderBox";

export function KDSOrderGrid({ orders }: KDSOrderGridProps) {
  // WIP calculation logic
  const cookingItemsCount = orders.reduce((acc, order) => {
    return acc + (order.orderItems?.filter((item) => item.status === 2).length || 0); // OrderItemStatus.Cooking is 2
  }, 0);
  const WIP_LIMIT = 4;
  const isWipLimitReached = cookingItemsCount >= WIP_LIMIT;

  // Mock action handlers for the KDS (UI demo purposes)
  const handleCompleteOrder = (orderId: string) => {
    console.log("Complete order", orderId);
  };

  const handleItemDone = (orderItemId: string) => {
    console.log("Item done", orderItemId);
  };

  const handleItemReturn = (orderItemId: string, reason: string) => {
    console.log("Returning item:", orderItemId, "with reason:", reason);
  };

  if (orders.length === 0) {
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
      <div className="px-6 py-2.5 flex items-center justify-between border-b border-border-subtle bg-white shadow-sm z-10">
        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">
          Khu vực chế biến • Station 1
        </div>
      </div>

      <div className="flex-1 w-full overflow-hidden flex custom-scrollbar overflow-x-auto">
        {orders.map((order, colIdx) => (
          <div
            key={order.orderId}
            className={cn(
              "shrink-0 w-1/4 min-w-[300px] flex flex-col bg-white",
              colIdx < orders.length - 1 && "border-r border-border-subtle"
            )}
          >
            <KDSOrderBox
              order={order}
              onCompleteOrder={handleCompleteOrder}
              onItemDone={handleItemDone}
              onItemReturn={handleItemReturn}
            />
          </div>
        ))}

        {/* Fill empty columns to maintain the 4-column look if there are fewer than 4 orders */}
        {orders.length < 4 &&
          Array.from({ length: 4 - orders.length }).map((_, idx) => (
            <div
              key={`empty-col-${idx}`}
              className={cn(
                "shrink-0 w-1/4 min-w-[300px] flex flex-col bg-gray-50/50",
                idx < 3 - orders.length && "border-r border-border-subtle"
              )}
            ></div>
          ))}
      </div>
    </main>
  );
}
