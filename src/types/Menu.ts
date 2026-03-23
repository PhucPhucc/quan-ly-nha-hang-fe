import { OptionType, SetMenuType, Station } from "./enums";

/**
 * Reusable Option Group (Master Data)
 * Definition of what can be selected.
 */
export interface OptionGroup {
  optionGroupId: string;
  name: string;
  optionType: OptionType;
  isActive: boolean;
  optionItems?: OptionItem[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;

  // Counts for UI display
  usageCount?: number;

  // --- LEGACY FIELDS (Staged Refactor) ---
  menuItemId?: string;
  isRequired?: boolean;
}

/**
 * Values within an Option Group.
 * Part of the Master Data.
 */
export interface OptionItem {
  optionItemId: string;
  optionGroupId: string;
  label: string;
  value: string;
  extraPrice: number;
  sortOrder: number;
  isActive: boolean;
}

/**
 * Mapping between MenuItem and OptionGroup.
 * Contains per-item configurations.
 */
export interface MenuItemOptionGroup {
  menuItemOptionGroupId: string;
  menuItemId: string;
  name: string;
  optionGroupId: string;
  optionGroup?: OptionGroup; // Populated for UI
  optionType: OptionType;
  optionItems?: OptionItem[];

  // Specific rules for this menu item
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  sortOrder: number;
  isVisible: boolean;
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

  // New relationship
  menuItemOptionGroups?: MenuItemOptionGroup[];
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
}

export interface MenuFilter {
  searchQuery?: string;
  categoryId?: string;
  isOutOfStock?: boolean;
}
