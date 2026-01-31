import { CategoryType, OptionType, SetMenuType, Station } from "./enums";

export interface Category {
  category_id: string;
  name: string;
  category_type: CategoryType;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface MenuItem {
  menu_item_id: string;
  code: string;
  name: string;
  image_url: string;
  description: string;
  category_id: string;
  dine_in_price: number;
  take_away_price: number | null;
  cost_price: number;
  station: Station;
  is_out_of_stock: boolean;
  created_by_employee_id: string;
  updated_by_employee_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface OptionGroup {
  option_group_id: string;
  menu_item_id: string;
  name: string;
  option_type: OptionType;
  is_required: boolean;
  min_select: number;
  max_select: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface OptionItem {
  option_item_id: string;
  option_group_id: string;
  label: string;
  value: string;
  extra_price: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SetMenu {
  set_menu_id: string;
  code: string;
  name: string;
  set_type: SetMenuType;
  image_url: string;
  description: string;
  price: number;
  cost_price: number;
  is_out_of_stock: boolean;
  created_by_employee_id: string;
  updated_by_employee_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SetMenuItem {
  set_menu_item_id: number;
  set_menu_id: string;
  menu_item_id: string;
  quantity: number;
  created_at: string;
}
