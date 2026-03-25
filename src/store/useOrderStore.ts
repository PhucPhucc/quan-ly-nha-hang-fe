import { DateRange } from "react-day-picker";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { orderService, PaginationParams } from "@/services/orderService";
import { OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

export type ActiveTab = string;

const TAKEAWAY_TAB = "takeaway";

export type OrderActiveView = "order" | "menu";

export interface OrderBoardState {
  orders: Order[];
  activeOrderDetails: Order | null;
  loading: boolean;
  orderDetailsLoading: boolean;

  // ui state
  activeTab: ActiveTab;
  activeView: OrderActiveView;
  selectedOrderId: string | null;
  searchQuery: string;
  selectedStatuses: string[];
  dateRange?: DateRange;
  sortOrder: string;

  // actions
  fetchOrders: (option?: { pageNumber?: number; pageSize?: number }) => Promise<void>;
  fetchOrderDetails: (id: string) => Promise<void>;
  clearOrderDetails: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  setActiveView: (view: OrderActiveView) => void;
  setSelectedOrderId: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setSelectedStatuses: (s: string[]) => void;
  setDateRange: (d?: DateRange) => void;
  setSortOrder: (s: string) => void;
  resetFilters: () => void;
  updateActiveOrderDiscount: (discount: number, voucherCode?: string) => void;
  patchActiveOrderDetails: (patch: Partial<Order>) => void;

  // order mutations
  addOrder: (order: Order) => void;
  removeOrder: (orderId: string) => void;
  updateOrder: (order: Order) => void;
  checkoutOrder: (
    orderId: string,
    paymentMethod: string,
    amountReceived?: number
  ) => Promise<boolean>;

  // selectors (derived)
  isTakeawayTab: () => boolean;
  dineInOrders: () => Order[];
  takeawayOrders: () => Order[];
  filteredTakeaways: () => Order[];
  toggleStatus: (status: string) => void;
  stats: () => {
    total: number;
    dineIn: number;
    takeaway: number;
  };
}

export const useOrderBoardStore = createWithEqualityFn<OrderBoardState>(
  (set, get) => ({
    // ---------- state ----------
    orders: [],
    activeOrderDetails: null,
    loading: true,
    orderDetailsLoading: false,

    activeTab: "", // will be set to first area ID on mount
    activeView: "order",
    selectedOrderId: null,
    searchQuery: "",
    selectedStatuses: [],
    dateRange: undefined,
    sortOrder: "newest",

    // ---------- actions ----------
    fetchOrders: async (option = {}) => {
      try {
        set({ loading: true });
        const { searchQuery, activeTab, selectedStatuses, dateRange } = get();

        const params: PaginationParams = {
          ...option,
          search: searchQuery || undefined,
          fromDate: dateRange?.from?.toISOString(),
          toDate: dateRange?.to?.toISOString(),
        };

        // Map activeTab to OrderType
        if (activeTab === TAKEAWAY_TAB) {
          params.orderType = OrderType.Takeaway;
        } else if (activeTab) {
          // An area tab is selected — fetch dine-in orders
          params.orderType = OrderType.DineIn;
        }

        // Map status
        if (selectedStatuses.length > 0) {
          params.status = selectedStatuses[0] as OrderStatus;
        }

        const res = await orderService.getOrders(params);
        if (res.isSuccess && res.data) {
          set({ orders: res.data.items || [] });
        }
      } catch (e) {
        console.error("Fetch orders failed", e);
      } finally {
        set({ loading: false });
      }
    },

    fetchOrderDetails: async (id: string) => {
      try {
        set({ orderDetailsLoading: true });
        const res = await orderService.getOrderById(id);
        if (res.isSuccess && res.data) {
          set({ activeOrderDetails: res.data });
        }
      } catch (e) {
        console.error("Fetch order details failed", e);
      } finally {
        set({ orderDetailsLoading: false });
      }
    },

    clearOrderDetails: () => set({ activeOrderDetails: null }),

    setActiveTab: (activeTab) => {
      set({ activeTab });
      get().fetchOrders();
    },
    setActiveView: (activeView) => set({ activeView }),
    setSelectedOrderId: (selectedOrderId) => set({ selectedOrderId }),
    setSearchQuery: (searchQuery) => {
      set({ searchQuery });
      get().fetchOrders();
    },
    setSelectedStatuses: (selectedStatuses) => {
      set({ selectedStatuses });
      get().fetchOrders();
    },
    setDateRange: (dateRange) => set({ dateRange }),
    setSortOrder: (sortOrder) => set({ sortOrder }),

    addOrder: (order: Order) =>
      set((state) => {
        const exists = state.orders.some((o) => o.orderId === order.orderId);
        if (exists) return state;

        return {
          orders: [order, ...state.orders],
        };
      }),

    removeOrder: (orderId) =>
      set((state) => ({
        orders: state.orders.filter((o) => o.orderId !== orderId),
      })),

    updateOrder: (order) =>
      set((state) => ({
        orders: state.orders.map((o) => (o.orderId === order.orderId ? order : o)),
      })),

    checkoutOrder: async (orderId: string, paymentMethod: string, amountReceived?: number) => {
      try {
        const res = await orderService.checkoutOrder(orderId, paymentMethod, amountReceived);
        if (res.isSuccess) {
          await get().fetchOrders();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Checkout failed:", error);
        return false;
      }
    },

    resetFilters: () => {
      set({
        searchQuery: "",
        selectedStatuses: [],
      });
      get().fetchOrders();
    },

    updateActiveOrderDiscount: (discount: number, voucherCode?: string) => {
      set((state) => {
        if (!state.activeOrderDetails) return state;
        return {
          activeOrderDetails: {
            ...state.activeOrderDetails,
            discountAmount: discount,
            voucherCode: voucherCode || undefined,
            appliedVoucherCode: voucherCode || undefined,
          },
        };
      });
    },

    patchActiveOrderDetails: (patch) => {
      set((state) => {
        if (!state.activeOrderDetails) return state;
        return {
          activeOrderDetails: {
            ...state.activeOrderDetails,
            ...patch,
          },
        };
      });
    },

    isTakeawayTab: () => get().activeTab === TAKEAWAY_TAB,

    dineInOrders: () => get().orders.filter((o) => o.orderType === OrderType.DineIn),

    takeawayOrders: () => get().orders.filter((o) => o.orderType === OrderType.Takeaway),

    filteredTakeaways: () => {
      const { activeTab, searchQuery, selectedStatuses } = get();
      if (activeTab !== TAKEAWAY_TAB) return [];

      return get()
        .takeawayOrders()
        .filter((o) => {
          const statusString = o.status === OrderStatus.Serving ? "tk_serving" : "tk_ready";

          const matchesStatus =
            selectedStatuses.length === 0 || selectedStatuses.includes(statusString);

          const matchesSearch =
            !searchQuery || o.orderCode.toLowerCase().includes(searchQuery.toLowerCase());

          return matchesStatus && matchesSearch;
        });
    },

    toggleStatus: (status: string) => {
      set((state) => ({
        selectedStatuses: state.selectedStatuses.includes(status)
          ? state.selectedStatuses.filter((s) => s !== status)
          : [...state.selectedStatuses, status],
      }));
      get().fetchOrders();
    },

    stats: () => ({
      total: get().orders.length,
      dineIn: get().dineInOrders().length,
      takeaway: get().takeawayOrders().length,
    }),
  }),
  shallow
);
