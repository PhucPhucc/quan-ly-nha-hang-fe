import React from "react";

import { OrderItem } from "@/types/Order";

import {
  getComboNameFromNote,
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
}

export const RemoteOrderItemsSection: React.FC<RemoteOrderItemsSectionProps> = ({
  remoteItems,
  comboDisplayMap,
  itemIndexMap,
  expandedComboIds,
  hoveredComboId,
  setHoveredComboId,
  toggleComboChildren,
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

        const isComboExpanded =
          sortedComboChildren.length > 0 &&
          (Boolean(expandedComboIds[item.orderItemId]) || hoveredComboId === item.orderItemId);

        const itemHasComboNote = Boolean(getComboNameFromNote(item.itemNote));
        const itemIsFree =
          sortedComboChildren.length === 0 &&
          !itemHasComboNote &&
          (item.isFreeItem || item.unitPriceSnapshot === 0);

        return (
          <RemoteOrderItemCard
            key={item.orderItemId}
            item={item}
            isFree={itemIsFree}
            isCombo={sortedComboChildren.length > 0}
            isClickable={sortedComboChildren.length > 0}
            isComboExpanded={isComboExpanded}
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
