import { create } from "zustand";

import { CartItem, CartItemOptionGroup } from "@/types/Cart";
import { MenuItem } from "@/types/Menu";

// Tạo key duy nhất cho từng dòng trong giỏ hàng dựa trên menuItemId + options đã chọn.
// Nếu chọn options khác nhau → thêm dòng mới; cùng options → tăng số lượng.
function buildCartItemKey(menuItemId: string, options: CartItemOptionGroup[]): string {
  const optionsPart = options
    .map(
      (g) =>
        `${g.optionGroupId}:${g.selectedValues
          .map((v) => v.optionItemId)
          .sort()
          .join(",")}`
    )
    .sort()
    .join("|");
  return `${menuItemId}__${optionsPart}`;
}

interface CartState {
  items: Record<string, CartItem[]>; // Keyed by orderId (or tableId)

  addItem: (
    orderId: string,
    menuItem: MenuItem,
    quantity: number,
    selectedOptions: CartItemOptionGroup[],
    note: string,
    baseUnitPrice: number
  ) => void;
  updateQuantity: (orderId: string, cartItemKey: string, delta: number) => void;
  removeItem: (orderId: string, cartItemKey: string) => void;
  clearCart: (orderId: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: {},

  addItem: (orderId, menuItem, quantity, selectedOptions, note, baseUnitPrice) => {
    if (!orderId) return;

    const extraPrice = selectedOptions
      .flatMap((g) => g.selectedValues)
      .reduce((acc, v) => acc + v.extraPrice, 0);

    const unitPrice = baseUnitPrice + extraPrice;
    const cartItemKey = buildCartItemKey(menuItem.menuItemId, selectedOptions);

    set((state) => {
      const currentItems = state.items[orderId] || [];
      const existing = currentItems.find((i) => i.cartItemKey === cartItemKey);

      let newItems;
      if (existing) {
        newItems = currentItems.map((i) =>
          i.cartItemKey === cartItemKey
            ? { ...i, quantity: i.quantity + quantity, note: note || i.note }
            : i
        );
      } else {
        const newItem: CartItem = {
          cartItemKey,
          menuItem,
          quantity,
          selectedOptions,
          note,
          unitPrice,
        };
        newItems = [...currentItems, newItem];
      }

      return {
        items: {
          ...state.items,
          [orderId]: newItems,
        },
      };
    });
  },

  updateQuantity: (orderId, cartItemKey, delta) => {
    set((state) => {
      const currentItems = state.items[orderId] || [];
      const newItems = currentItems
        .map((i) => (i.cartItemKey === cartItemKey ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0);

      return {
        items: {
          ...state.items,
          [orderId]: newItems,
        },
      };
    });
  },

  removeItem: (orderId, cartItemKey) => {
    set((state) => {
      const currentItems = state.items[orderId] || [];
      const newItems = currentItems.filter((i) => i.cartItemKey !== cartItemKey);

      return {
        items: {
          ...state.items,
          [orderId]: newItems,
        },
      };
    });
  },

  clearCart: (orderId) =>
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [orderId]: _, ...rest } = state.items;
      return { items: rest };
    }),
}));
