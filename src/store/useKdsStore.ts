import { toast } from "sonner";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { UI_TEXT } from "@/lib/UI_Text";
import { KdsItemResponse, KdsQueueResponse, kdsService } from "@/services/kdsService";
import { KDSStation, OrderItemStatus } from "@/types/enums";
import { Order, OrderItem } from "@/types/Order";

const normalizeOrderItemStatus = (status: unknown): OrderItemStatus => {
  const normalized = String(status ?? "")
    .trim()
    .toLowerCase();

  switch (normalized) {
    case "1":
    case "preparing":
      return OrderItemStatus.Preparing;
    case "2":
    case "cooking":
      return OrderItemStatus.Cooking;
    case "3":
    case "completed":
      return OrderItemStatus.Completed;
    case "4":
    case "cancelled":
    case "canceled":
      return OrderItemStatus.Cancelled;
    case "5":
    case "rejected":
      return OrderItemStatus.Rejected;
    default:
      return OrderItemStatus.Preparing;
  }
};

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
        isPriority: Boolean(item.isPriority || item.isOrderPriority),
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
      status: normalizeOrderItemStatus(item.status),
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

interface KdsState {
  activeItems: KdsItemResponse[];
  queueItems: KdsQueueResponse[];
  activeOrders: Order[];
  queueOrders: Order[];
  station: KDSStation;
  setStation: (station: KDSStation) => void;
  fetchKdsData: (targetStation?: KDSStation) => Promise<void>;
  startCooking: (orderItemId: string) => Promise<void>;
  completeItemCooking: (orderItemId: string) => Promise<void>;
  rejectItem: (orderItemId: string, reason: string) => Promise<void>;
}

export const useKdsStore = createWithEqualityFn<KdsState>(
  (set, get) => ({
    activeItems: [],
    queueItems: [],
    activeOrders: [],
    queueOrders: [],
    station: KDSStation.Kitchen,

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
        toast.error(UI_TEXT.KDS.FETCH_ERROR);
      }
    },

    startCooking: async (orderItemId) => {
      try {
        await kdsService.startCooking(orderItemId);
        toast.success(UI_TEXT.KDS.START_COOKING_SUCCESS);
        get().fetchKdsData();
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Loi khi bat dau nau");
      }
    },

    completeItemCooking: async (orderItemId) => {
      try {
        await kdsService.completeCooking(orderItemId);
        toast.success(UI_TEXT.KDS.COMPLETE_COOKING_SUCCESS);
        get().fetchKdsData();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Loi khi hoan thanh mon");
      }
    },

    rejectItem: async (orderItemId, reason) => {
      try {
        await kdsService.rejectItem(orderItemId, reason);
        toast.success(UI_TEXT.KDS.REJECT_ITEM_SUCCESS);
        get().fetchKdsData();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Loi khi tu choi mon");
      }
    },
  }),
  shallow
);
