export interface Category {
  categoryId: string;
  name: string;
  type: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  menuItemId: string;
  code: string;
  name: string;
  imageUrl: string;
  description: string;
  categoryId: string;
  categoryName: string;
  priceDineIn: number;
  priceTakeAway: number | null;
  cost: number | null;
  station: number;
  isOutOfStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OptionGroup {
  optionGroupId: string;
  menuItemId: string;
  name: string;
  optionType: number;
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface OptionItem {
  optionItemId: string;
  optionGroupId: string;
  label: string;
  value: string;
  extraPrice: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SetMenu {
  setMenuId: string;
  code: string;
  name: string;
  setType: number;
  imageUrl: string;
  description: string;
  price: number;
  cost: number;
  isOutOfStock: boolean;
  createdByEmployeeId: string;
  updatedByEmployeeId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SetMenuItem {
  setMenuItemId: number;
  setMenuId: string;
  menuItemId: string;
  quantity: number;
  createdAt: string;
}
