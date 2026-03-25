"use client";

import { FileText, Loader2 } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types/enums";
import { Order as OrderModel } from "@/types/Order";

import { OrderDetailsTabs } from "./components/OrderDetailsTabs";
import { useOrderDetails } from "./useOrderDetails";

interface OrderDetailsDrawerProps {
  open: boolean;
  order: OrderModel | null;
  onOpenChange: (open: boolean) => void;
}

const orderStatusClass = (status: string) => {
  if (status === OrderStatus.Completed) return "table-pill-success";
  if (status === OrderStatus.Cancelled) return "table-pill-danger";
  if (status === OrderStatus.Paid) return "table-pill-info";
  if (status === OrderStatus.Serving) return "table-pill-primary";
  return "table-pill-neutral";
};

export default function OrderDetailsDrawer({ open, order, onOpenChange }: OrderDetailsDrawerProps) {
  const { current, preCheckBill, loading, handleSplitBill } = useOrderDetails(open, order);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-full p-0 sm:max-w-[92vw]">
        <div className="flex h-full min-h-0 flex-col">
          <DrawerHeader className="border-b px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <DrawerTitle className="text-2xl font-black text-table-text-strong">
                  {current?.orderCode || UI_TEXT.ORDER.DETAIL.TITLE}
                </DrawerTitle>
                <div className="mt-2 flex flex-wrap gap-2">
                  {current && (
                    <Badge
                      variant="outline"
                      className={cn("table-pill border-0", orderStatusClass(current.status))}
                    >
                      {current.status}
                    </Badge>
                  )}
                  {current?.isPriority && (
                    <Badge variant="outline" className="table-pill table-pill-danger border-0">
                      {UI_TEXT.ORDER.BOARD.VIP}
                    </Badge>
                  )}
                </div>
              </div>
              <DrawerClose asChild>
                <Button variant="outline">{UI_TEXT.COMMON.CLOSE}</Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-6 px-6 py-5">
              {loading && (
                <div className="flex h-64 items-center justify-center rounded-2xl border bg-card">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
                  <span className="text-muted-foreground">{UI_TEXT.ORDER.DETAIL.LOADING}</span>
                </div>
              )}

              {!loading && !current && (
                <EmptyState
                  title={UI_TEXT.ORDER.DETAIL.EMPTY_TITLE}
                  description={UI_TEXT.ORDER.DETAIL.EMPTY_DESC}
                  icon={FileText}
                />
              )}

              {!loading && current && (
                <OrderDetailsTabs
                  current={current}
                  preCheckBill={preCheckBill}
                  handleSplitBill={handleSplitBill}
                />
              )}
            </div>
          </ScrollArea>

          <DrawerFooter className="border-t px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                {current?.orderItems?.length
                  ? UI_TEXT.ORDER.DETAIL.ITEM_COUNT(current.orderItems.length)
                  : UI_TEXT.ORDER.DETAIL.ITEMS_EMPTY_TITLE}
              </span>
              <DrawerClose asChild>
                <Button variant="outline">{UI_TEXT.COMMON.CLOSE}</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
