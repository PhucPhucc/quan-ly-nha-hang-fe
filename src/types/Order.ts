import { OrderItemStatus, OrderStatus, OrderType } from "./enums";

export interface OrderItem {
  orderItemId: string;
  orderId: string;
  menuItemId: string;

  itemCodeSnapshot: string;
  itemNameSnapshot: string;
  stationSnapshot: string;

  status: OrderItemStatus;
  quantity: number;
  unitPriceSnapshot: number;
  itemNote?: string;

  createdAt: string;
  updatedAt?: string;
  canceledAt?: string;
}

export interface Order {
  orderId: string;
  orderCode: string;
  orderType: OrderType;
  status: OrderStatus;
  tableId?: string;

  note?: string;
  totalAmount: number;
  isPriority: boolean;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  orderItems: OrderItem[];
}

export const DINE_IN_STATUSES = [
  { value: "ready", label: "Bàn trống", color: "bg-table-empty" },
  { value: "inprocess", label: "Đang sử dụng", color: "bg-table-inprocess" },
  { value: "reserved", label: "Đặt trước", color: "bg-table-reserved" },
  { value: "cleaning", label: "Đang dọn", color: "bg-table-cleaning" },
];

export const TAKEAWAY_STATUSES = [
  { value: "tk_inprocess", label: "Đang nấu", color: "bg-orange-500" },
  { value: "tk_ready", label: "Sẵn sàng", color: "bg-emerald-500" },
];
