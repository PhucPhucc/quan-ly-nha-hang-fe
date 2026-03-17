"use client";

import { Timer } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <aside className="w-72 h-full shrink-0 z-10 border-r bg-background">
      <div className="p-4 border-b space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {UI_TEXT.KDS.QUEUE}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground">
              {UI_TEXT.KDS.TOTAL_ORDERS}
              {UI_TEXT.COMMON.COLON}
            </span>
            <Badge variant="outline" className="text-[11px] font-semibold px-2 py-1">
              {orders.length}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Timer className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono font-semibold">{currentTime}</span>
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-92px)] p-3">
        <div className="space-y-2">
          {orders.length === 0 ? (
            <EmptyState
              title={UI_TEXT.KDS.ORDER.EMPTY_QUEUE}
              icon={Timer}
              className="min-h-[200px]"
            />
          ) : (
            orders.map((order) => {
              const orderNumber = order.orderCode.split("-").pop() || order.orderCode;
              const itemIds = order.orderItems.map((i) => i.orderItemId);

              return (
                <Button
                  key={order.orderId}
                  variant="outline"
                  onClick={() => {
                    if (itemIds.length > 0) {
                      startCooking(itemIds[0]);
                    }
                  }}
                  className="w-full justify-between rounded-lg text-left px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      {UI_TEXT.KDS.ORDER_LABEL}
                    </span>
                    <span className="font-mono text-lg font-bold text-foreground">
                      {UI_TEXT.COMMON.HASH}
                      {orderNumber}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[11px] font-semibold"
                    title="Số loại món trong đơn"
                  >
                    {UI_TEXT.KDS.ITEM.ITEMS_IN_ORDER_LABEL}
                    {UI_TEXT.COMMON.COLON} {order.orderItems.length}
                  </Badge>
                </Button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
