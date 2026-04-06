import { toast } from "sonner";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { UI_TEXT } from "@/lib/UI_Text";
import {
  KdsItemResponse,
  KdsQueueResponse,
  kdsService,
  KdsSettingsResponse,
} from "@/services/kdsService";
import { KDSStation, OrderItemStatus } from "@/types/enums";
import { Order, OrderItem } from "@/types/Order";

export const normalizeOrderItemStatus = (status: unknown): OrderItemStatus => {
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

const formatItemsToOrders = (
  items: (KdsItemResponse | KdsQueueResponse)[],
  preserveQueuePosition = false
): Order[] => {
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
    const orderItem: OrderItem & { queuePosition?: number } = {
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
    } as unknown as OrderItem & { queuePosition?: number };

    if (preserveQueuePosition && "queuePosition" in item && item.queuePosition) {
      orderItem.queuePosition = item.queuePosition;
    }

    order.orderItems.push(orderItem);
  });

  const result = Array.from(groups.values());

  if (preserveQueuePosition) {
    result.sort((a, b) => {
      const aMinPos = Math.min(
        ...a.orderItems.map(
          (i) => (i as unknown as { queuePosition?: number }).queuePosition ?? 999
        )
      );
      const bMinPos = Math.min(
        ...b.orderItems.map(
          (i) => (i as unknown as { queuePosition?: number }).queuePosition ?? 999
        )
      );
      return aMinPos - bMinPos;
    });

    result.forEach((order) => {
      order.orderItems.sort((a, b) => {
        const aPos = (a as unknown as { queuePosition?: number }).queuePosition ?? 999;
        const bPos = (b as unknown as { queuePosition?: number }).queuePosition ?? 999;
        return aPos - bPos;
      });
    });
  } else {
    result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  return result;
};

interface KdsState {
  activeItems: KdsItemResponse[];
  queueItems: KdsQueueResponse[];
  activeOrders: Order[];
  queueOrders: Order[];
  station: KDSStation;
  settings: KdsSettingsResponse | null;
  setStation: (station: KDSStation) => void;
  fetchKdsData: (targetStation?: KDSStation) => Promise<void>;
  upsertItem: (item: KdsItemResponse | KdsQueueResponse) => void;
  removeListItem: (orderItemId: string) => void;
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
    settings: null,

    setStation: (station) => set({ station }),

    fetchKdsData: async (targetStation?: KDSStation) => {
      const currentStation = targetStation || get().station;
      try {
        const [itemsRes, queueRes, settingsRes] = await Promise.all([
          kdsService.getKdsItems(currentStation),
          kdsService.getKdsQueue(currentStation),
          kdsService.getKdsSettings(),
        ]);

        const newActiveItems =
          itemsRes.isSuccess && itemsRes.data ? itemsRes.data : get().activeItems;
        const newQueueItems =
          queueRes.isSuccess && queueRes.data ? queueRes.data : get().queueItems;
        const newSettings =
          settingsRes.isSuccess && settingsRes.data ? settingsRes.data : get().settings;

        set({
          activeItems: newActiveItems,
          queueItems: newQueueItems,
          settings: newSettings,
          activeOrders: formatItemsToOrders(newActiveItems),
          queueOrders: formatItemsToOrders(newQueueItems, true),
        });
      } catch (error) {
        console.error("Failed to fetch KDS data:", error);
        toast.error(UI_TEXT.KDS.FETCH_ERROR);
      }
    },
    upsertItem: (item) => {
      const isPreparing = normalizeOrderItemStatus(item.status) === OrderItemStatus.Preparing;
      const isCooking = normalizeOrderItemStatus(item.status) === OrderItemStatus.Cooking;

      if (isCooking) {
        // Update Active Items
        const currentActive = get().activeItems;
        const exists = currentActive.some((i) => i.orderItemId === item.orderItemId);
        let newActive;
        if (exists) {
          newActive = currentActive.map((i) =>
            i.orderItemId === item.orderItemId ? (item as KdsItemResponse) : i
          );
        } else {
          newActive = [...currentActive, item as KdsItemResponse];
        }

        // Remove from Queue if it was there
        const newQueue = get().queueItems.filter((i) => i.orderItemId !== item.orderItemId);

        set({
          activeItems: newActive,
          queueItems: newQueue,
          activeOrders: formatItemsToOrders(newActive),
          queueOrders: formatItemsToOrders(newQueue, true),
        });
      } else if (isPreparing) {
        // Update Queue Items
        const currentQueue = get().queueItems;
        const exists = currentQueue.some((i) => i.orderItemId === item.orderItemId);
        let newQueue;
        if (exists) {
          newQueue = currentQueue.map((i) =>
            i.orderItemId === item.orderItemId ? (item as KdsQueueResponse) : i
          );
        } else {
          newQueue = [...currentQueue, item as KdsQueueResponse];
        }

        // Remove from Active if it was there (e.g. Returned to Queue)
        const newActive = get().activeItems.filter((i) => i.orderItemId !== item.orderItemId);

        set({
          activeItems: newActive,
          queueItems: newQueue,
          activeOrders: formatItemsToOrders(newActive),
          queueOrders: formatItemsToOrders(newQueue, true),
        });
      } else {
        // Completed/Rejected/Cancelled - Remove from both
        get().removeListItem(item.orderItemId);
      }
    },

    removeListItem: (orderItemId) => {
      const newActive = get().activeItems.filter((i) => i.orderItemId !== orderItemId);
      const newQueue = get().queueItems.filter((i) => i.orderItemId !== orderItemId);
      set({
        activeItems: newActive,
        queueItems: newQueue,
        activeOrders: formatItemsToOrders(newActive),
        queueOrders: formatItemsToOrders(newQueue, true),
      });
    },

    startCooking: async (orderItemId) => {
      try {
        await kdsService.startCooking(orderItemId);
        toast.success(UI_TEXT.KDS.START_COOKING_SUCCESS);
        get().fetchKdsData();
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Có lỗi khi bắt đầu nấu");
      }
    },

    completeItemCooking: async (orderItemId) => {
      try {
        await kdsService.completeCooking(orderItemId);
        toast.success(UI_TEXT.KDS.COMPLETE_COOKING_SUCCESS);
        get().fetchKdsData();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Có lỗi khi hoàn thành món");
      }
    },

    rejectItem: async (orderItemId, reason) => {
      try {
        await kdsService.rejectItem(orderItemId, reason);
        toast.success(UI_TEXT.KDS.REJECT_ITEM_SUCCESS);
        get().fetchKdsData();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Có lỗi khi từ chối món");
      }
    },
  }),
  shallow
);
