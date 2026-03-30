import React from "react";

import { UI_TEXT } from "@/lib/UI_Text";
import { formatCurrency } from "@/lib/utils";
import { OrderItem } from "@/types/Order";

import { getDisplayNote } from "./order-item-list.utils";

interface OrderItemMetaProps {
  item: OrderItem;
}

export const OrderItemMeta: React.FC<OrderItemMetaProps> = ({ item }) => {
  const displayItemNote = getDisplayNote(item.itemNote);

  return (
    <>
      {item.optionGroups && item.optionGroups.length > 0 ? (
        <div className="mt-1 space-y-0.5">
          {item.optionGroups
            .flatMap((group) =>
              group.optionValues.map((value) => ({
                ...value,
                groupNameSnapshot: group.groupNameSnapshot,
              }))
            )
            .map((value) => (
              <p
                key={value.orderItemOptionValueId}
                className="text-[10px] text-muted-foreground flex items-center justify-between"
              >
                <span>
                  {value.groupNameSnapshot ? `${value.groupNameSnapshot}: ` : ""}
                  {value.labelSnapshot}
                </span>
                {value.extraPriceSnapshot > 0 && (
                  <span className="ml-2">
                    {UI_TEXT.COMMON.PLUS}
                    {formatCurrency(value.extraPriceSnapshot)}
                  </span>
                )}
              </p>
            ))}
        </div>
      ) : (
        item.itemOptions && (
          <p className="text-[10px] text-muted-foreground mt-1">
            {item.itemOptions.split(";").join(", ")}
          </p>
        )
      )}

      {displayItemNote && (
        <p className="text-[10px] italic mt-1">{UI_TEXT.ORDER.NOTE(displayItemNote)}</p>
      )}
    </>
  );
};
