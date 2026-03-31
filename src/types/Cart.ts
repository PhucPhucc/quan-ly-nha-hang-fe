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
  groupName?: string;
  selectedValues: CartItemOptionValue[];
}

export interface CartComboChildSelection {
  menuItemId: string;
  menuItemName?: string;
  quantity: number;
  selectedOptions: CartItemOptionGroup[];
}

export interface CartItem {
  /** Unique key per line in the cart (menuItemId + serialized options) */
  cartItemKey: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: CartItemOptionGroup[];
  comboChildren?: CartComboChildSelection[];
  note: string;
  /** Unit price = base price + extra from options */
  unitPrice: number;
}
