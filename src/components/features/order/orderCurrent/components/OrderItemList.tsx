import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { UI_TEXT } from "@/lib/UI_Text";
import { CartItem } from "@/types/Cart";
import { OrderItem } from "@/types/Order";

import { CartOrderItemCard } from "./order-item-list/CartOrderItemCard";
import {
  buildComboDisplayMap,
  createOrderItemIndexMap,
} from "./order-item-list/order-item-list.utils";
import { RemoteOrderItemsSection } from "./order-item-list/RemoteOrderItemsSection";

interface OrderItemListProps {
  items: CartItem[];
  remoteItems?: OrderItem[];
  onUpdateQuantity: (cartItemKey: string, delta: number) => void;
  onRemoveItem: (cartItemKey: string) => void;
}

const OrderItemList: React.FC<OrderItemListProps> = ({
  items,
  remoteItems = [],
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const comboDisplayMap = React.useMemo(() => buildComboDisplayMap(remoteItems), [remoteItems]);
  const itemIndexMap = React.useMemo(() => createOrderItemIndexMap(remoteItems), [remoteItems]);

  const [expandedComboIds, setExpandedComboIds] = React.useState<Record<string, boolean>>({});
  const [hoveredComboId, setHoveredComboId] = React.useState<string | null>(null);

  const toggleComboChildren = (orderItemId: string) => {
    setExpandedComboIds((previousState) => ({
      ...previousState,
      [orderItemId]: !previousState[orderItemId],
    }));
  };

  return (
    <ScrollArea className="flex-1 overflow-auto no-scrollbar" type="always">
      <div className="py-4 space-y-4 px-2">
        {items.length === 0 && remoteItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground italic text-sm text-center">
            {UI_TEXT.ORDER.CURRENT.EMPTY}
          </div>
        ) : (
          <>
            {items.map((item) => (
              <CartOrderItemCard
                key={item.cartItemKey}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
              />
            ))}

            <RemoteOrderItemsSection
              remoteItems={remoteItems}
              comboDisplayMap={comboDisplayMap}
              itemIndexMap={itemIndexMap}
              expandedComboIds={expandedComboIds}
              hoveredComboId={hoveredComboId}
              setHoveredComboId={setHoveredComboId}
              toggleComboChildren={toggleComboChildren}
            />
          </>
        )}
      </div>
    </ScrollArea>
  );
};

export default OrderItemList;
