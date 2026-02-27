import { MenuItem } from "./Menu";

export interface CartItemOptionValue {
  optionItemId: string;
  quantity: number;
  label: string;
  extraPrice: number;
  note?: string;
}

export interface CartItemOptionGroup {
  optionGroupId: string;
  selectedValues: CartItemOptionValue[];
}

export interface CartItem {
  /** Unique key per line in the cart (menuItemId + serialized options) */
  cartItemKey: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: CartItemOptionGroup[];
  note: string;
  /** Unit price = base price + extra from options */
  unitPrice: number;
}
