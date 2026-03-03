import { OrderType } from "./enums";
import { OrderItem } from "./Order";

export interface KDSItemCardProps {
  item: OrderItem;
  orderCode: string;
  orderType: OrderType;
}
