import { create } from "zustand";

import { CartComboChildSelection, CartItem, CartItemOptionGroup } from "@/types/Cart";
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

function buildComboChildrenKey(children: CartComboChildSelection[] = []): string {
  if (!Array.isArray(children)) return "";
  return children
    .map(
      (child) =>
        `${child.menuItemId}:${child.selectedOptions
          .map(
            (g) =>
              `${g.optionGroupId}:${g.selectedValues
                .map((v) => v.optionItemId)
                .sort()
                .join(",")}`
          )
          .sort()
          .join(";")}`
    )
    .sort()
    .join("|");
}

function buildComboChildrenExtraPrice(children: CartComboChildSelection[] = []): number {
  if (!Array.isArray(children)) return 0;

  return children.reduce((total, child) => {
    const childOptionsTotal = child.selectedOptions.reduce((groupTotal, group) => {
      const valuesTotal = group.selectedValues.reduce(
        (valueTotal, value) => valueTotal + Number(value.extraPrice || 0) * (value.quantity || 1),
        0
      );
      return groupTotal + valuesTotal;
    }, 0);

    return total + childOptionsTotal * (child.quantity || 1);
  }, 0);
}

interface CartState {
  items: Record<string, CartItem[]>; // Keyed by orderId (or tableId)

  addItem: (
    orderId: string,
    menuItem: MenuItem,
    quantity: number,
    selectedOptions: CartItemOptionGroup[],
    comboChildren?: CartComboChildSelection[],
    note?: string,
    baseUnitPrice?: number
  ) => void;
  updateQuantity: (orderId: string, cartItemKey: string, delta: number) => void;
  removeItem: (orderId: string, cartItemKey: string) => void;
  clearCart: (orderId: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: {},

  addItem: (
    orderId,
    menuItem,
    quantity,
    selectedOptions,
    comboChildren = [],
    note = "",
    baseUnitPrice = 0
  ) => {
    if (!orderId) return;

    const extraPrice = selectedOptions
      .flatMap((g) => g.selectedValues)
      .reduce((acc, v) => acc + Number(v.extraPrice || 0) * (v.quantity || 1), 0);

    const comboExtraPrice = buildComboChildrenExtraPrice(comboChildren);
    const unitPrice = baseUnitPrice + extraPrice + comboExtraPrice;
    const cartItemKey =
      buildCartItemKey(menuItem.menuItemId, selectedOptions) +
      `__combo:${buildComboChildrenKey(comboChildren)}`;

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
          comboChildren,
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
