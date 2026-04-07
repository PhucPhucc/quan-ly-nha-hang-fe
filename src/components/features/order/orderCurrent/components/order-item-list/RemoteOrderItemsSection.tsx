import React from "react";

import { OrderItemStatus } from "@/types/enums";
import { OrderItem } from "@/types/Order";

import {
  getComboNameFromNote,
  getRemoteItemTotal,
  sortOrderItemsByStatus,
  sortTopLevelRemoteItems,
} from "./order-item-list.utils";
import { RemoteOrderItemCard } from "./RemoteOrderItemCard";

interface RemoteOrderItemsSectionProps {
  remoteItems: OrderItem[];
  comboDisplayMap: {
    parentIdByChildId: Map<string, string>;
    childrenByParentId: Map<string, OrderItem[]>;
  };
  itemIndexMap: Map<string, number>;
  expandedComboIds: Record<string, boolean>;
  hoveredComboId: string | null;
  setHoveredComboId: React.Dispatch<React.SetStateAction<string | null>>;
  toggleComboChildren: (orderItemId: string) => void;
  onCancel?: (itemId: string) => void;
}

export const RemoteOrderItemsSection: React.FC<RemoteOrderItemsSectionProps> = ({
  remoteItems,
  comboDisplayMap,
  itemIndexMap,
  expandedComboIds,
  hoveredComboId,
  setHoveredComboId,
  toggleComboChildren,
  onCancel,
}) => {
  const sortedTopLevelRemoteItems = React.useMemo(() => {
    return sortTopLevelRemoteItems(remoteItems, comboDisplayMap, itemIndexMap);
  }, [remoteItems, comboDisplayMap, itemIndexMap]);

  return (
    <>
      {sortedTopLevelRemoteItems.map((item) => {
        const sortedComboChildren = sortOrderItemsByStatus(
          comboDisplayMap.childrenByParentId.get(item.orderItemId) ?? [],
          itemIndexMap
        );
        const comboChildrenTotal = sortedComboChildren.reduce(
          (sum, comboChild) => sum + getRemoteItemTotal(comboChild) * comboChild.quantity,
          0
        );
        const itemTotal = getRemoteItemTotal(item) * item.quantity + comboChildrenTotal;

        const isComboExpanded =
          sortedComboChildren.length > 0 &&
          (Boolean(expandedComboIds[item.orderItemId]) || hoveredComboId === item.orderItemId);

        const itemHasComboNote = Boolean(getComboNameFromNote(item.itemNote));
        const itemIsFree =
          sortedComboChildren.length === 0 &&
          !itemHasComboNote &&
          (item.isFreeItem || item.unitPriceSnapshot === 0);

        // Calculate effective combo status based on children
        const getEffectiveComboStatus = (): OrderItemStatus => {
          if (sortedComboChildren.length === 0) return item.status;

          const childStatuses = sortedComboChildren.map((child) => child.status);
          // If any child is cooking, show cooking
          if (childStatuses.some((s) => s === OrderItemStatus.Cooking))
            return OrderItemStatus.Cooking;
          // Otherwise, if any child is preparing (but not cooking), show preparing
          if (childStatuses.some((s) => s === OrderItemStatus.Preparing))
            return OrderItemStatus.Preparing;
          // If any child is rejected, keep the combo rejected instead of marking it completed.
          if (childStatuses.some((s) => s === OrderItemStatus.Rejected))
            return OrderItemStatus.Rejected;
          // If all children are completed/cancelled, show completed.
          if (
            childStatuses.every(
              (s) =>
                s === OrderItemStatus.Completed ||
                s === OrderItemStatus.Cancelled ||
                s === OrderItemStatus.Rejected
            )
          )
            return OrderItemStatus.Completed;
          // Default to parent status
          return item.status;
        };

        const effectiveStatus = getEffectiveComboStatus();
        // Create item with effective status for display
        const itemWithEffectiveStatus = { ...item, status: effectiveStatus };

        return (
          <RemoteOrderItemCard
            key={item.orderItemId}
            item={itemWithEffectiveStatus}
            isFree={itemIsFree}
            isCombo={sortedComboChildren.length > 0}
            isClickable={sortedComboChildren.length > 0}
            isComboExpanded={isComboExpanded}
            priceOverride={itemTotal / Math.max(item.quantity, 1)}
            onMouseEnter={
              sortedComboChildren.length > 0 ? () => setHoveredComboId(item.orderItemId) : undefined
            }
            onMouseLeave={
              sortedComboChildren.length > 0
                ? () =>
                    setHoveredComboId((currentHoveredId) =>
                      currentHoveredId === item.orderItemId ? null : currentHoveredId
                    )
                : undefined
            }
            onClick={
              sortedComboChildren.length > 0
                ? () => toggleComboChildren(item.orderItemId)
                : undefined
            }
            onCancel={onCancel}
          >
            {sortedComboChildren.length > 0 && (
              <div
                id={`combo-items-${item.orderItemId}`}
                aria-hidden={!isComboExpanded}
                className={
                  isComboExpanded
                    ? "mt-3 grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity,margin-top] duration-500 ease-out"
                    : "mt-0 grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity,margin-top] duration-500 ease-in-out pointer-events-none"
                }
              >
                <div
                  className={
                    isComboExpanded
                      ? "min-h-0 translate-y-0 overflow-hidden transition-transform duration-500 ease-out"
                      : "min-h-0 translate-y-1 overflow-hidden transition-transform duration-500 ease-in-out"
                  }
                >
                  <div className="space-y-3">
                    {sortedComboChildren.map((comboItem) => {
                      const comboItemHasComboNote = Boolean(
                        getComboNameFromNote(comboItem.itemNote)
                      );
                      const comboItemIsFree =
                        !comboItemHasComboNote &&
                        (comboItem.isFreeItem || comboItem.unitPriceSnapshot === 0);

                      return (
                        <RemoteOrderItemCard
                          key={comboItem.orderItemId}
                          item={comboItem}
                          isFree={comboItemIsFree}
                          hidePrice
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </RemoteOrderItemCard>
        );
      })}
    </>
  );
};
