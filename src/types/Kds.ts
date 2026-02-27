import { Order, OrderItem } from "./Order";

export interface KDSQueueHeaderProps {
  queueOrders: Order[];
  currentTime: string;
}

export interface KDSOrderItemProps {
  item: OrderItem;
  onDone?: (orderItemId: string) => void;
  onReturn?: (orderItemId: string, reason: string) => void;
}

export interface KDSOrderBoxProps {
  order: Order;
  onCompleteOrder?: (orderId: string) => void;
  onItemDone?: (orderItemId: string) => void;
  onItemReturn?: (orderItemId: string, reason: string) => void;
}

export interface KDSOrderGridProps {
  orders: Order[];
}
