import { create } from "zustand";

import { MenuItem } from "@/types/Menu";

interface OrderItem extends MenuItem {
  quantity: number;
}

interface OrderState {
  items: OrderItem[];
  addItem: (item: MenuItem, quantity: number) => void;
  removeItem: (itemCode: string) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  items: [],
  addItem: (item, quantity) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.code === item.code);
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.code === item.code ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity }] };
    }),
  removeItem: (itemCode) =>
    set((state) => ({
      items: state.items.filter((i) => i.code !== itemCode),
    })),
  clearOrder: () => set({ items: [] }),
}));
