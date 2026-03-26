"use client";

import { ChevronDown, ChevronUp, Play, Timer } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UI_TEXT } from "@/lib/UI_Text";
import { useKdsStore } from "@/store/useKdsStore";

export function KDSQueueSidebar() {
  const orders = useKdsStore((s) => s.queueOrders);
  const startCooking = useKdsStore((s) => s.startCooking);
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  const toggleOpen = (id: string) => {
    setOpenStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
    <aside className="z-10 h-full w-64 shrink-0 border-r bg-background xl:w-72">
      <div className="space-y-2 border-b p-4 pl-2 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <SidebarTrigger className="size-8" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {UI_TEXT.KDS.QUEUE}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className=" text-muted-foreground">
              {UI_TEXT.KDS.TOTAL_ORDERS}
              {UI_TEXT.COMMON.COLON}
            </span>
            <span className="flex size-5 items-center justify-center rounded-full border font-semibold p-1 text-[10px]">
              {orders.length}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-2 text-foreground">
          <Timer className="size-5 text-muted-foreground" />
          <span className="font-mono font-semibold">{currentTime}</span>
        </div>
      </div>

      <ScrollArea className="h-[calc(100%-92px)] p-3">
        <div className="space-y-3">
          {orders.length === 0 ? (
            <EmptyState title={UI_TEXT.KDS.ORDER.EMPTY_QUEUE} icon={Timer} className="min-h-50" />
          ) : (
            orders.map((order) => {
              const orderNumber = order.orderCode.split("-").pop() || order.orderCode;
              const isOpen = openStates[order.orderId] || false;

              return (
                <Collapsible
                  key={order.orderId}
                  open={isOpen}
                  onOpenChange={() => toggleOpen(order.orderId)}
                  className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:bg-slate-50/10"
                >
                  <div className="flex items-center justify-between p-3">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {UI_TEXT.KDS.ORDER_LABEL}
                        </span>
                        <span className="font-mono text-base font-black text-foreground">
                          {UI_TEXT.COMMON.HASH}
                          {orderNumber}
                        </span>
                      </div>
                      <Badge variant="secondary" className="w-fit scale-90 px-1.5 py-0 text-[10px]">
                        {UI_TEXT.KDS.ITEM.ITEMS_IN_ORDER_LABEL}
                        {UI_TEXT.COMMON.COLON} {order.orderItems.length}
                      </Badge>
                    </div>

                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent className="border-t bg-slate-50/30 p-2 pt-0 transition-all">
                    <div className="mt-2 space-y-1">
                      {order.orderItems.map((item) => (
                        <div
                          key={item.orderItemId}
                          className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-background/50 p-2 transition-colors hover:bg-background"
                        >
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-xs font-bold text-foreground">
                              {item.itemNameSnapshot}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {UI_TEXT.KDS.ITEM.QTY_PREFIX}
                              {item.quantity}
                            </span>
                          </div>
                          <Button
                            size="icon"
                            variant="default"
                            className="h-7 w-7 rounded-lg shadow-sm"
                            title={UI_TEXT.KDS.AUDIT.ACTION_START}
                            onClick={(e) => {
                              e.stopPropagation();
                              startCooking(item.orderItemId);
                            }}
                          >
                            <Play className="h-3.5 w-3.5 fill-current" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
