import { OrderType } from "./enums";
import { OrderItem } from "./Order";

export interface KDSItemCardProps {
  item: OrderItem;
  orderCode: string;
  orderType: OrderType;
}

export interface KdsBacklogSummary {
  totalProcessingItems: number;
  waitingCount: number;
  preparingCount: number;
  delayedCount: number;
  preparingPercentage: number;
}
