import { create } from "zustand";

import { MenuItem } from "@/types/Menu";

export interface CartItemOptionValue {
  optionItemId: string;
  quantity: number;
  label: string;
  extraPrice: number;
}

export interface CartItemOptionGroup {
  optionGroupId: string;
  selectedValues: CartItemOptionValue[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedOptions?: CartItemOptionGroup[];
  note?: string;
  uniqueId?: string; // To distinguish items with different options
}

interface OrderState {
  items: CartItem[];
  addItem: (
    item: MenuItem,
    quantity: number,
    options?: CartItemOptionGroup[],
    note?: string
  ) => void;
  removeItem: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, quantity: number) => void;
  clearOrder: () => void;
}

const generateUniqueId = (item: MenuItem, options?: CartItemOptionGroup[], note?: string) => {
  const optionsSignature = options
    ? options
        .map((g) =>
          g.selectedValues
            .map((v) => `${v.optionItemId}x${v.quantity}`)
            .sort()
            .join("-")
        )
        .sort()
        .join("|")
    : "";
  return `${item.menuItemId}-${optionsSignature}-${note || ""}`;
};

export const useOrderStore = create<OrderState>((set) => ({
  items: [],
  addItem: (item, quantity, options, note) =>
    set((state) => {
      const uniqueId = generateUniqueId(item, options, note);
      const existingItem = state.items.find((i) => i.uniqueId === uniqueId);

      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.uniqueId === uniqueId ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }

      const newItem: CartItem = {
        ...item,
        quantity,
        selectedOptions: options,
        note,
        uniqueId,
      };

      return { items: [...state.items, newItem] };
    }),
  removeItem: (uniqueId) =>
    set((state) => ({
      items: state.items.filter((i) => i.uniqueId !== uniqueId),
    })),
  updateQuantity: (uniqueId, quantity) =>
    set((state) => ({
      items: state.items.map((i) => (i.uniqueId === uniqueId ? { ...i, quantity } : i)),
    })),
  clearOrder: () => set({ items: [] }),
}));
