import { OrderType } from "./enums";
import { Order, OrderItem } from "./Order";

export interface KDSQueueHeaderProps {
  queueOrders: Order[];
  currentTime: string;
  onStartCooking?: (orderItemId: string) => void;
}

export interface KDSItemCardProps {
  item: OrderItem;
  orderCode: string;
  orderType: OrderType;
  onDone?: (orderItemId: string) => void;
  onReturn?: (orderItemId: string, reason: string) => void;
}

export interface KDSOrderGridProps {
  orders: Order[];
  onItemDone?: (orderItemId: string) => void;
  onItemReturn?: (orderItemId: string, reason: string) => void;
}
