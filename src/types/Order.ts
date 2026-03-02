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
  itemOptions?: string;

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
