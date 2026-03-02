"use client";

import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { KDSOrderGrid } from "@/components/features/kds/KDSOrderGrid";
import { KDSQueueSidebar } from "@/components/features/kds/KDSQueueSidebar";
import { KdsItemResponse, KdsQueueResponse, kdsService } from "@/services/kdsService";
import { OrderItemStatus } from "@/types/enums";
import { Order, OrderItem } from "@/types/Order";

export function KDSDashboardClient() {
  const searchParams = useSearchParams();
  const station = searchParams.get("station") || "HotKitchen";

  const [activeItems, setActiveItems] = useState<KdsItemResponse[]>([]);
  const [queueItems, setQueueItems] = useState<KdsQueueResponse[]>([]);

  const fetchKdsData = useCallback(async () => {
    try {
      const [itemsRes, queueRes] = await Promise.all([
        kdsService.getKdsItems(station),
        kdsService.getKdsQueue(station),
      ]);

      if (itemsRes.isSuccess && itemsRes.data) {
        setActiveItems(itemsRes.data);
      }
      if (queueRes.isSuccess && queueRes.data) {
        setQueueItems(queueRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch KDS data:", error);
      toast.error("Không thể tải dữ liệu KDS");
    }
  }, [station]);

  useEffect(() => {
    setTimeout(fetchKdsData, 0);
    // Poll every 10 seconds for testing/simplicity since no SignalR was found
    const interval = setInterval(fetchKdsData, 10000);
    return () => clearInterval(interval);
  }, [fetchKdsData]);

  // Format responses to match UI requirements (group by orderId)
  const formatItemsToOrders = (items: (KdsItemResponse | KdsQueueResponse)[]): Order[] => {
    const groups = new Map<string, Order>();
    items.forEach((item) => {
      if (!groups.has(item.orderId)) {
        groups.set(item.orderId, {
          orderId: item.orderId,
          orderCode: item.orderCode,
          orderType: 0,
          status: 1,
          totalAmount: 0,
          isPriority: "priorityScore" in item ? item.priorityScore > 10 : false,
          createdAt: item.createdAt,
          orderItems: [],
        } as unknown as Order);
      }

      const order = groups.get(item.orderId)!;
      order.orderItems.push({
        orderItemId: item.orderItemId,
        orderId: item.orderId,
        itemNameSnapshot: item.itemNameSnapshot,
        stationSnapshot: item.stationSnapshot,
        status: item.status === "Cooking" ? OrderItemStatus.Cooking : OrderItemStatus.Preparing,
        quantity: item.quantity,
        itemNote: item.itemNote,
        itemOptions: item.itemOptions,
        updatedAt: item.createdAt,
        itemCodeSnapshot: item.itemNameSnapshot.substring(0, 3).toUpperCase(),
        unitPriceSnapshot: 0,
      } as unknown as OrderItem);
    });

    // Sort array by first item's creation time
    return Array.from(groups.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  };

  const activeOrders = formatItemsToOrders(activeItems);
  const queueOrders = formatItemsToOrders(queueItems);

  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  const handleStartCooking = async (orderItemId: string) => {
    try {
      await kdsService.startCooking(orderItemId);
      toast.success("Đã bắt đầu nấu!");
      fetchKdsData();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Lỗi khi bắt đầu nấu");
    }
  };

  // Override the window object logic temporarily for the grid
  // We'll expose a global handler until we can refactor the grid properly, or we can just pass them if we update grid.
  // Actually, KDSOrderGrid takes no action props, it hardcodes the console.log handlers inside.
  // Let's pass the real functions down to global scope just for this hack or update the component.
  // The better way is to update KDSOrderGrid.tsx to accept props. But I'll do that next.

  return (
    <div className="flex w-full h-full overflow-hidden">
      <KDSQueueSidebar
        queueOrders={queueOrders}
        currentTime={timeString}
        onStartCooking={handleStartCooking}
      />
      <KDSOrderGrid
        orders={activeOrders}
        onItemDone={async (id) => {
          try {
            await kdsService.markReady(id);
            toast.success("Món đã hoàn thành!");
            fetchKdsData();
          } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Lỗi khi hoàn thành món");
          }
        }}
        onItemReturn={async (id, reason) => {
          try {
            await kdsService.rejectItem(id, reason);
            toast.success("Đã từ chối món!");
            fetchKdsData();
          } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Lỗi khi từ chối món");
          }
        }}
      />
    </div>
  );
}
