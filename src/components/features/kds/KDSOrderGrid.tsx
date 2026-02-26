"use client";

import React from "react";

import { KDSOrderGridProps } from "@/types/Kds";

import { KDSOrderBox } from "./KDSOrderBox";

export function KDSOrderGrid({ orders }: KDSOrderGridProps) {
  // Mock action handlers for the KDS (UI demo purposes)
  const handleCompleteOrder = (orderId: string) => {
    console.log("Complete order", orderId);
  };

  const handleItemDone = (orderItemId: string) => {
    console.log("Item done", orderItemId);
  };

  const handleItemReturn = (orderItemId: string) => {
    console.log("Item return", orderItemId);
  };

  if (orders.length === 0) {
    return (
      <main className="flex-1 w-full bg-border-subtle overflow-hidden flex items-center justify-center">
        <div className="text-text-secondary text-2xl font-medium font-display opacity-50">
          Chưa có đơn hàng nào cần thực hiện
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full grid grid-cols-2 grid-rows-2 gap-px bg-border-subtle overflow-hidden">
      {orders.slice(0, 4).map((order) => (
        <KDSOrderBox
          key={order.orderId}
          order={order}
          onCompleteOrder={handleCompleteOrder}
          onItemDone={handleItemDone}
          onItemReturn={handleItemReturn}
        />
      ))}
      {/* If there are less than 4 orders, we can fill the empty grid spaces with blanks to maintain structure */}
      {Array.from({ length: Math.max(0, 4 - orders.length) }).map((_, idx) => (
        <div key={`empty-${idx}`} className="bg-background-main flex items-center justify-center">
          <span className="text-border-subtle text-[80px] material-symbols-outlined opacity-20">
            restaurant
          </span>
        </div>
      ))}
    </main>
  );
}
