"use client";

import { ChefHat } from "lucide-react";
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
    <main className="flex-1 w-full bg-background flex flex-col overflow-hidden">
      {/* WIP Information Bar - Simplified */}
      <div className="px-10 py-4 flex items-center justify-between border-b border-border-subtle shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg backdrop-blur-sm border border-border">
            <ChefHat className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-secondary-foreground flex items-center">
            {UI_TEXT.KDS.STATION_PREFIX}
          </h2>
        </div>
      </div>

      <div className="flex-1 w-full overflow-hidden flex flex-col custom-scrollbar overflow-y-auto p-4 gap-4">
        {itemsToDisplay.map((virtualOrder) => {
          const item = virtualOrder.orderItems[0];
          return (
            <div
              key={`${virtualOrder.orderId}-${item.orderItemId}`}
              className="shrink-0 flex flex-col bg-card rounded-xl shadow-sm border border-border-subtle overflow-hidden"
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
              className="shrink-0 flex flex-col bg-gray-50/50 rounded-xl border border-dashed border-border-subtle min-h-35"
            ></div>
          ))}
      </div>
    </main>
  );
}
