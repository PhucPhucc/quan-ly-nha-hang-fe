import { OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

const ACTIVE_TABLE_ORDER_STATUSES = new Set<OrderStatus>([OrderStatus.Serving]);

export const isTableOccupyingOrder = (order: Order) =>
  Boolean(order.tableId && ACTIVE_TABLE_ORDER_STATUSES.has(order.status));

export const isMergeCandidateOrder = (order: Order, sourceOrderId?: string) =>
  order.orderId !== sourceOrderId &&
  order.orderType === OrderType.DineIn &&
  isTableOccupyingOrder(order);
