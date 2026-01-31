import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { MenuItem, OptionGroup, OptionItem } from "../types/Menu";
import { OrderItem, OrderItemOption } from "../types/Order";

interface SelectedOption {
  group: OptionGroup;
  item: OptionItem;
}

interface OrderState {
  tableId: string | null;
  items: OrderItem[];
  itemOptions: OrderItemOption[];
  totalAmount: number;

  setTable: (tableId: string) => void;

  addItem: (menuItem: MenuItem, quantity: number) => void;

  updateItemOptions: (orderItemId: string, newOptions: SelectedOption[]) => void;

  removeItem: (orderItemId: string) => void;
  updateQuantity: (orderItemId: string, delta: number) => void;
  resetOrder: () => void;
}

const calculateTotal = (items: OrderItem[], options: OrderItemOption[]): number => {
  return items.reduce((total, item) => {
    const itemTotal = item.unit_price_snapshot;
    const currentOptions = options.filter((opt) => opt.order_item_id === item.order_item_id);
    const optionsTotal = currentOptions.reduce((sum, opt) => sum + opt.extra_price_snapshot, 0);
    return total + (itemTotal + optionsTotal) * item.quantity;
  }, 0);
};

const isSameOptions = (
  existingOptions: OrderItemOption[],
  incomingOptions: SelectedOption[]
): boolean => {
  if (existingOptions.length !== incomingOptions.length) return false;
  const existingValues = existingOptions.map((o) => o.option_value_snapshot).sort();
  const incomingValues = incomingOptions.map((o) => o.item.value).sort();
  return existingValues.every((val, index) => val === incomingValues[index]);
};

export const useOrderStore = create<OrderState>()(
  immer((set) => ({
    tableId: null,
    items: [],
    itemOptions: [],
    totalAmount: 0,

    setTable: (tableId) =>
      set((state) => {
        state.tableId = tableId;
      }),

    addItem: (menuItem, quantity) =>
      set((state) => {
        const incomingOptions: SelectedOption[] = [];

        const existingItemCandidates = state.items.filter(
          (item) => item.menu_item_id === menuItem.menu_item_id
        );

        let foundMatchItem: OrderItem | undefined;

        for (const candidate of existingItemCandidates) {
          const candidateOptions = state.itemOptions.filter(
            (opt) => opt.order_item_id === candidate.order_item_id
          );
          if (isSameOptions(candidateOptions, incomingOptions)) {
            foundMatchItem = candidate;
            break;
          }
        }

        if (foundMatchItem) {
          const itemInState = state.items.find(
            (i) => i.order_item_id === foundMatchItem!.order_item_id
          );
          if (itemInState) {
            itemInState.quantity += quantity;
          }
        } else {
          const orderItemId = crypto.randomUUID();
          const now = new Date().toISOString();

          const newItem: OrderItem = {
            order_item_id: orderItemId,
            order_id: "DRAFT",
            menu_item_id: menuItem.menu_item_id,
            item_code_snapshot: menuItem.code,
            item_name_snapshot: menuItem.name,
            station_snapshot: menuItem.station,
            quantity: quantity,
            unit_price_snapshot: menuItem.dine_in_price,
            item_note: "",
            created_at: now,
            updated_at: now,
          };
          state.items.push(newItem);
        }

        state.totalAmount = calculateTotal(state.items, state.itemOptions);
      }),

    updateItemOptions: (orderItemId, newOptions) =>
      set((state) => {
        const itemIndex = state.items.findIndex((i) => i.order_item_id === orderItemId);
        if (itemIndex === -1) return;

        state.itemOptions = state.itemOptions.filter((opt) => opt.order_item_id !== orderItemId);

        const now = new Date().toISOString();
        const newOptionRecords: OrderItemOption[] = newOptions.map((opt) => ({
          order_item_option_id: crypto.randomUUID(),
          order_item_id: orderItemId,
          option_group_name_snapshot: opt.group.name,
          option_item_label_snapshot: opt.item.label,
          option_value_snapshot: opt.item.value,
          extra_price_snapshot: opt.item.extra_price,
          free_text_value: null,
          created_at: now,
        }));

        state.itemOptions.push(...newOptionRecords);

        state.totalAmount = calculateTotal(state.items, state.itemOptions);
      }),

    removeItem: (orderItemId) =>
      set((state) => {
        state.items = state.items.filter((i) => i.order_item_id !== orderItemId);
        state.itemOptions = state.itemOptions.filter((o) => o.order_item_id !== orderItemId);
        state.totalAmount = calculateTotal(state.items, state.itemOptions);
      }),

    updateQuantity: (orderItemId, delta) =>
      set((state) => {
        const item = state.items.find((i) => i.order_item_id === orderItemId);
        if (item) {
          const newQuantity = item.quantity + delta;
          if (newQuantity > 0) {
            item.quantity = newQuantity;
          } else {
            state.items = state.items.filter((i) => i.order_item_id !== orderItemId);
            state.itemOptions = state.itemOptions.filter((o) => o.order_item_id !== orderItemId);
          }
          state.totalAmount = calculateTotal(state.items, state.itemOptions);
        }
      }),

    resetOrder: () =>
      set((state) => {
        state.tableId = null;
        state.items = [];
        state.itemOptions = [];
        state.totalAmount = 0;
      }),
  }))
);
