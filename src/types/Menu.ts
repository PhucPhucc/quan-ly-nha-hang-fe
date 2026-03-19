import { OptionType, SetMenuType, Station } from "./enums";

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
  optionItems?: OptionItem[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface OptionItem {
  optionItemId: string;
  optionGroupId: string;
  label: string;
  value: string;
  extraPrice: number;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}
export interface Category {
  categoryId: string;
  name: string;
  codePrefix?: string;
  type: number;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface MenuItem {
  menuItemId: string;
  name: string;
  code: string;
  description: string;
  price: number;
  costPrice: number;
  expectedTime: number;
  imageUrl: string;
  station: Station;
  categoryId: string;
  categoryName?: string;
  isOutOfStock: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SetMenu {
  setMenuId: string;
  code: string;
  name: string;
  setType: SetMenuType;
  imageUrl?: string;
  description?: string;
  price: number;
  costPrice: number;
  isOutOfStock: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuFilter {
  searchQuery?: string;
  categoryId?: string;
  isOutOfStock?: boolean;
}
