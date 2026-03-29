import { OrderItemStatus } from "@/types/enums";

export const COMBO_PARENT_ORDER_ITEM_ID_FIELDS = [
  "parentOrderItemId",
  "parentItemId",
  "orderItemParentId",
  "comboParentOrderItemId",
  "comboOrderItemId",
  "setMenuOrderItemId",
  "parentId",
] as const;

export const COMBO_NOTE_PATTERN = /\[\s*combo\s*:\s*([^\]]+)\]/i;

export const ORDER_ITEM_STATUS_PRIORITY: Record<OrderItemStatus, number> = {
  [OrderItemStatus.Cooking]: 0,
  [OrderItemStatus.Preparing]: 1,
  [OrderItemStatus.Rejected]: 2,
  [OrderItemStatus.Cancelled]: 3,
  [OrderItemStatus.Completed]: 4,
};
