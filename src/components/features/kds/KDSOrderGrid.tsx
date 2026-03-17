"use client";

import { ChefHat } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UI_TEXT } from "@/lib/UI_Text";
import { useKdsStore } from "@/store/useKdsStore";

import { KDSItemCard } from "./KDSItemCard";

export function KDSOrderGrid() {
  const orders = useKdsStore((s) => s.activeOrders);

  const allOrderItems = orders.flatMap((order) =>
    (order.orderItems || []).map((item) => ({
      ...order,
      orderItems: [item],
    }))
  );

  const itemsToDisplay = allOrderItems.slice(0, 4);

  if (allOrderItems.length === 0) {
    return (
      <main className="flex-1 w-full bg-background overflow-hidden flex items-center justify-center p-6">
        <Card className="w-full max-w-xl">
          <CardContent>
            <EmptyState
              title={UI_TEXT.KDS.ORDER.EMPTY_GRID}
              description={UI_TEXT.KDS.ORDER.EMPTY}
              icon={ChefHat}
            />
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-background flex flex-col overflow-hidden min-w-0">
      <ScrollArea className="flex-1 w-full p-3">
        <div className="flex flex-col gap-2.5">
          {itemsToDisplay.map((virtualOrder) => {
            const item = virtualOrder.orderItems[0];
            return (
              <Card
                key={`${virtualOrder.orderId}-${item.orderItemId}`}
                className="overflow-hidden border-border-subtle rounded-lg p-0"
              >
                <KDSItemCard
                  item={item}
                  orderCode={virtualOrder.orderCode}
                  orderType={virtualOrder.orderType}
                />
              </Card>
            );
          })}

          {itemsToDisplay.length < 4 &&
            Array.from({ length: 4 - itemsToDisplay.length }).map((_, idx) => (
              <Card
                key={`empty-col-${idx}`}
                className="bg-muted border-dashed border-border-subtle min-h-24 rounded-lg p-0"
              />
            ))}
        </div>
      </ScrollArea>
    </main>
  );
}
