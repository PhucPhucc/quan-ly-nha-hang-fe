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

  // Distribute orders into 4 columns
  const columns: (typeof orders)[] = [[], [], [], []];
  orders.forEach((order, index) => {
    columns[index % 4].push(order);
  });

  return (
    <main className="flex-1 w-full bg-white flex flex-col overflow-hidden">
      {/* WIP Information Bar - Simplified */}
      <div className="px-6 py-2.5 flex items-center justify-between border-b border-border-subtle bg-white shadow-sm z-10">
        {/* <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-text-secondary font-black text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">precision_manufacturing</span>
            <span>
              {UI_TEXT.KDS.NAV.WIP_LABEL}: {cookingItemsCount}/{WIP_LIMIT}
            </span>
          </div>
        </div> */}

        <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">
          Khu vực chế biến • Station 1
        </div>
      </div>

      <div className="flex-1 w-full overflow-hidden flex custom-scrollbar overflow-x-auto">
        {columns.map((colOrders, colIdx) => (
          <div
            key={`col-${colIdx}`}
            className={cn(
              "flex-1 min-w-[300px] flex flex-col bg-white overflow-y-auto custom-scrollbar",
              colIdx < 3 && "border-r border-border-subtle"
            )}
          >
            <div className="flex flex-col gap-0.5">
              {colOrders.map((order) => (
                <KDSOrderBox
                  key={order.orderId}
                  order={order}
                  onCompleteOrder={handleCompleteOrder}
                  onItemDone={handleItemDone}
                  onItemReturn={handleItemReturn}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
