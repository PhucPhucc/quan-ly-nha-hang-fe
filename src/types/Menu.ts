import { OptionType, Station } from "./enums";

export interface Category {
  categoryId: string;
  name: string;
  type: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  menuItemId: string;
  code: string;
  name: string;
  imageUrl: string;
  description: string;

  categoryId: string;
  categoryName: string;

  station: Station;
  expectedTime: number;

  price: number;
  costPrice: number;

  isOutOfStock: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface SetMenu {
  setMenuId: string;
  code: string;
  name: string;
  setType: string;
  imageUrl: string;
  description: string;
  price: number;
  costPrice: number;
  isOutOfStock: boolean;
  createdAt: string;
  updatedAt: string;
  setMenuItems?: SetMenuItem[];
  items?: SetMenuItem[];
}
export interface OptionItem {
  optionItemId: string;
  optionGroupId: string;
  menuItemId: string;

  label: string;
  value: string;

  extraPrice: number;

  sortOrder: number;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface OptionGroup {
  optionGroupId: string;
  menuItemId: string;

  name: string;
  optionType: OptionType;

  isRequired: boolean;
  minSelect: number;
  maxSelect: number;

  sortOrder: number;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  optionItems?: OptionItem[];
}

export interface SetMenuItem {
  setMenuItemId?: string;
  setMenuId?: string;
  menuItemId: string;
  quantity: number;
  createdAt?: string;
}
export interface MenuItemFormValues {
  code: string;
  name: string;
  imageUrl: string;
  imageFile: File | null;
  removeExistingImage: boolean;
  price: number;
  costPrice: number;
  categoryId: string;
  station: number;
  description: string;
  expectedTime: number;
}

export interface MenuItemUpdateBody {
  menuItemId: string;
  name: string;
  imageUrl: string;
  description: string;
  categoryId: string;
  station: number;
  expectedTime: number;
  price: number;
  costPrice: number;
}
export interface SetMenuFormValues {
  code: string;
  name: string;
  imageUrl: string;
  price: number;
  costPrice: number;
  description: string;
  categoryId: string;
  expectedTime: number;
  station: number;
  imageFile: File | null;
  items: SetMenuItem[];
  removeExistingImage?: boolean;
}

export interface SetMenuItemInput {
  menuItemId: string;
  quantity: number;
}

export interface SetMenuCreateBody {
  name: string;
  setType: "COMBO" | string;
  categoryId: string;
  imageUrl: string;
  description: string;
  price: number;
  costPrice: number;
  items: SetMenuItemInput[];
}

export interface SetMenuUpdateBody extends Omit<SetMenuCreateBody, "code"> {
  setMenuId: string;
}
