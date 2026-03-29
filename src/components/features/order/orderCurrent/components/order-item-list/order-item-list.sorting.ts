import { OrderItemStatus } from "@/types/enums";
import { OrderItem } from "@/types/Order";

import { ORDER_ITEM_STATUS_PRIORITY } from "./order-item-list.constants";
import { ComboDisplayMap } from "./order-item-list.types";

export const getOrderItemStatusPriority = (status: OrderItemStatus): number => {
  return ORDER_ITEM_STATUS_PRIORITY[status] ?? Number.MAX_SAFE_INTEGER;
};

export const createOrderItemIndexMap = (remoteItems: OrderItem[]): Map<string, number> => {
  return new Map(remoteItems.map((item, index) => [item.orderItemId, index]));
};

export const compareOrderItemsByStatus = (
  firstItem: OrderItem,
  secondItem: OrderItem,
  itemIndexMap: Map<string, number>
): number => {
  const priorityDiff =
    getOrderItemStatusPriority(firstItem.status) - getOrderItemStatusPriority(secondItem.status);
  if (priorityDiff !== 0) {
    return priorityDiff;
  }

  const firstItemIndex = itemIndexMap.get(firstItem.orderItemId) ?? Number.MAX_SAFE_INTEGER;
  const secondItemIndex = itemIndexMap.get(secondItem.orderItemId) ?? Number.MAX_SAFE_INTEGER;

  return firstItemIndex - secondItemIndex;
};

export const sortOrderItemsByStatus = (
  items: OrderItem[],
  itemIndexMap: Map<string, number>
): OrderItem[] => {
  return [...items].sort((firstItem, secondItem) =>
    compareOrderItemsByStatus(firstItem, secondItem, itemIndexMap)
  );
};

const getTopLevelItemPriority = (item: OrderItem, comboDisplayMap: ComboDisplayMap): number => {
  const itemPriority = getOrderItemStatusPriority(item.status);
  const comboChildren = comboDisplayMap.childrenByParentId.get(item.orderItemId) ?? [];

  if (comboChildren.length === 0) {
    return itemPriority;
  }

  return comboChildren.reduce((currentPriority, comboChild) => {
    return Math.min(currentPriority, getOrderItemStatusPriority(comboChild.status));
  }, itemPriority);
};

export const sortTopLevelRemoteItems = (
  remoteItems: OrderItem[],
  comboDisplayMap: ComboDisplayMap,
  itemIndexMap: Map<string, number>
): OrderItem[] => {
  const topLevelItems = remoteItems.filter(
    (item) => !comboDisplayMap.parentIdByChildId.has(item.orderItemId)
  );

  return [...topLevelItems].sort((firstItem, secondItem) => {
    const priorityDiff =
      getTopLevelItemPriority(firstItem, comboDisplayMap) -
      getTopLevelItemPriority(secondItem, comboDisplayMap);
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return compareOrderItemsByStatus(firstItem, secondItem, itemIndexMap);
  });
};
