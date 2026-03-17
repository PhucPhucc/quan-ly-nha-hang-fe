import { toast } from "sonner";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { KdsItemResponse, KdsQueueResponse, kdsService } from "@/services/kdsService";
import { KDSStation, OrderItemStatus } from "@/types/enums";
import { Order, OrderItem } from "@/types/Order";

/* ---------- helpers ---------- */

const formatItemsToOrders = (items: (KdsItemResponse | KdsQueueResponse)[]): Order[] => {
  if (!items || !Array.isArray(items)) return [];

  const groups = new Map<string, Order>();
  items.forEach((item) => {
    if (!item || !item.orderId) return;

    if (!groups.has(item.orderId)) {
      groups.set(item.orderId, {
        orderId: item.orderId,
        orderCode: item.orderCode || "N/A",
        orderType: 0,
        status: 1,
        totalAmount: 0,
        isPriority: "priorityScore" in item ? (item.priorityScore ?? 0) > 10 : false,
        createdAt: item.createdAt || new Date().toISOString(),
        orderItems: [],
      } as unknown as Order);
    }

    const order = groups.get(item.orderId)!;
    order.orderItems.push({
      orderItemId: item.orderItemId,
      orderId: item.orderId,
      itemNameSnapshot: item.itemNameSnapshot || "Unknown Item",
      stationSnapshot: item.stationSnapshot,
      status: item.status === "Cooking" ? OrderItemStatus.Cooking : OrderItemStatus.Preparing,
      quantity: item.quantity ?? 1,
      itemNote: item.itemNote,
      itemOptions: item.itemOptions || [],
      updatedAt: item.createdAt || new Date().toISOString(),
      itemCodeSnapshot: (item.itemNameSnapshot || "UNK").substring(0, 3).toUpperCase(),
      unitPriceSnapshot: 0,
    } as unknown as OrderItem);
  });

  return Array.from(groups.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
};

/* ---------- store definition ---------- */

interface KdsState {
  // data
  activeItems: KdsItemResponse[];
  queueItems: KdsQueueResponse[];
  activeOrders: Order[];
  queueOrders: Order[];
  station: KDSStation;

  // actions
  setStation: (station: KDSStation) => void;
  fetchKdsData: (targetStation?: KDSStation) => Promise<void>;
  startCooking: (orderItemId: string) => Promise<void>;
  markItemReady: (orderItemId: string) => Promise<void>;
  rejectItem: (orderItemId: string, reason: string) => Promise<void>;
}

export const useKdsStore = createWithEqualityFn<KdsState>(
  (set, get) => ({
    // ---------- state ----------
    activeItems: [],
    queueItems: [],
    activeOrders: [],
    queueOrders: [],
    station: KDSStation.Kitchen,

    // ---------- actions ----------
    setStation: (station) => set({ station }),

    fetchKdsData: async (targetStation?: KDSStation) => {
      const currentStation = targetStation || get().station;
      try {
        const [itemsRes, queueRes] = await Promise.all([
          kdsService.getKdsItems(currentStation),
          kdsService.getKdsQueue(currentStation),
        ]);

        const newActiveItems =
          itemsRes.isSuccess && itemsRes.data ? itemsRes.data : get().activeItems;
        const newQueueItems =
          queueRes.isSuccess && queueRes.data ? queueRes.data : get().queueItems;

        set({
          activeItems: newActiveItems,
          queueItems: newQueueItems,
          activeOrders: formatItemsToOrders(newActiveItems),
          queueOrders: formatItemsToOrders(newQueueItems),
        });
      } catch (error) {
        console.error("Failed to fetch KDS data:", error);
        toast.error("Không thể tải dữ liệu KDS");
      }
    },

    startCooking: async (orderItemId) => {
      try {
        await kdsService.startCooking(orderItemId);
        toast.success("Đã bắt đầu nấu!");
        get().fetchKdsData();
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Lỗi khi bắt đầu nấu");
      }
    },

    markItemReady: async (orderItemId) => {
      try {
        await kdsService.markReady(orderItemId);
        toast.success("Món đã hoàn thành!");
        get().fetchKdsData();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Lỗi khi hoàn thành món");
      }
    },

    rejectItem: async (orderItemId, reason) => {
      try {
        await kdsService.rejectItem(orderItemId, reason);
        toast.success("Đã từ chối món!");
        get().fetchKdsData();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Lỗi khi từ chối món");
      }
    },
  }),
  shallow
);
