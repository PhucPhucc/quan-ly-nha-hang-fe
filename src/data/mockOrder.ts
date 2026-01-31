import { OrderStatus, OrderType, Station } from "../types/enums";
import { Order, OrderItem, OrderItemOption } from "../types/Order";

const NOW = new Date().toISOString();

// 1. Đơn hàng tổng (Header)
export const MOCK_CREATED_ORDER: Order = {
  order_id: "ORD_001",
  order_code: "ORD-20240524-0001",
  order_type: OrderType.DINE_IN,
  status: OrderStatus.DRAFT, // Mới tạo, chưa gửi bếp
  table_id: "TABLE_01",
  total_amount: 69000, // (29k) + (35k + 5k topping)
  general_note: "Mang đồ uống lên cùng lúc",
  created_by: "EMP_01",
  created_at: NOW,
  updated_at: NOW,
};

// 2. Chi tiết món trong đơn (Body)
export const MOCK_ORDER_ITEMS: OrderItem[] = [
  // Dòng 1: Cà phê muối
  {
    order_item_id: "OI_001",
    order_id: "ORD_001",
    menu_item_id: "ITEM_CF_MUOI",
    item_code_snapshot: "CF01",
    item_name_snapshot: "Cà Phê Muối Huế",
    station_snapshot: Station.BAR,
    quantity: 1,
    unit_price_snapshot: 29000,
    item_note: "",
    created_at: NOW,
    updated_at: NOW,
  },
  // Dòng 2: Trà vải
  {
    order_item_id: "OI_002",
    order_id: "ORD_001",
    menu_item_id: "ITEM_TRA_VAI",
    item_code_snapshot: "TEA01",
    item_name_snapshot: "Trà Lài Vải Tươi",
    station_snapshot: Station.BAR,
    quantity: 1,
    unit_price_snapshot: 35000,
    item_note: "Ít đá",
    created_at: NOW,
    updated_at: NOW,
  },
];

// 3. Option của món trong đơn (Detail)
export const MOCK_ORDER_ITEM_OPTIONS: OrderItemOption[] = [
  // Option cho dòng 1 (Cà phê muối): 50% Đường
  {
    order_item_option_id: "OIO_001",
    order_item_id: "OI_001",
    option_group_name_snapshot: "Mức đường",
    option_item_label_snapshot: "50% Đường",
    option_value_snapshot: "50",
    extra_price_snapshot: 0,
    free_text_value: null,
    created_at: NOW,
  },
  // Option cho dòng 2 (Trà vải): Thêm Trân châu trắng
  {
    order_item_option_id: "OIO_002",
    order_item_id: "OI_002",
    option_group_name_snapshot: "Topping thêm",
    option_item_label_snapshot: "Trân châu trắng",
    option_value_snapshot: "pearl_white",
    extra_price_snapshot: 5000, // Giá topping
    free_text_value: null,
    created_at: NOW,
  },
];
