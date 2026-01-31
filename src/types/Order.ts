import { ActionType, OrderStatus, OrderType, Station } from "./enums";

export interface Order {
  order_id: string;
  order_code: string;
  order_type: OrderType;
  status: OrderStatus;
  table_id: string | null;
  total_amount: number;
  general_note: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  order_item_id: string;
  order_id: string;
  menu_item_id: string;
  item_code_snapshot: string;
  item_name_snapshot: string;
  station_snapshot: Station;
  quantity: number;
  unit_price_snapshot: number;
  item_note: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItemOption {
  order_item_option_id: string;
  order_item_id: string;
  option_group_name_snapshot: string;
  option_item_label_snapshot: string;
  option_value_snapshot: string;
  extra_price_snapshot: number;
  free_text_value: string | null;
  created_at: string;
}

export interface OrderAuditLog {
  log_id: string;
  order_id: string;
  employee_id: string;
  action: ActionType;

  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;

  change_reason: string | null;
  created_at: string;
}
