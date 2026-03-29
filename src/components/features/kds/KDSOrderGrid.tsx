"use client";

import { ChefHat } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UI_TEXT } from "@/lib/UI_Text";
import { KdsStationKey } from "@/services/kdsService";
import { useKdsStore } from "@/store/useKdsStore";
import { KDSStation } from "@/types/enums";

import { KDSItemCard } from "./KDSItemCard";

export function KDSOrderGrid() {
  const { activeOrders, station, settings } = useKdsStore();
  const orders = activeOrders;

  // Resolve WIP limit for current station
  const stationKeyMap: Record<string, KdsStationKey> = {
    [KDSStation.HotKitchen]: "HotKitchen",
    [KDSStation.ColdKitchen]: "ColdKitchen",
    [KDSStation.Bar]: "Bar",
    [KDSStation.Kitchen]: "HotKitchen", // Fallback
  };

  const currentStationKey = stationKeyMap[station] || "HotKitchen";
  const stationSetting = settings?.stationWipLimits.find(
    (s) => s.station?.toString().toLowerCase() === currentStationKey.toLowerCase()
  );
  const wipLimit = stationSetting?.enabled ? stationSetting.limit : 4; // Default to 4 if not set or disabled

  const allOrderItems = orders.flatMap((order) =>
    (order.orderItems || []).map((item) => ({
      ...order,
      orderItems: [item],
    }))
  );

  const itemsToDisplay = allOrderItems.slice(0, wipLimit);

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

          {itemsToDisplay.length < wipLimit &&
            Array.from({ length: wipLimit - itemsToDisplay.length }).map((_, idx) => (
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
