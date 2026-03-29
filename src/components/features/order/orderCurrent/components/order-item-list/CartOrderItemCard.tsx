import { Minus, Plus, Trash2 } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UI_TEXT } from "@/lib/UI_Text";
import { formatCurrency } from "@/lib/utils";
import { CartItem, CartItemOptionGroup } from "@/types/Cart";

interface CartOrderItemCardProps {
  item: CartItem;
  onUpdateQuantity: (cartItemKey: string, delta: number) => void;
  onRemoveItem: (cartItemKey: string) => void;
}

const formatPriceLine = (price: number, quantity: number): string => {
  return `${formatCurrency(price)} x ${quantity} = ${formatCurrency(price * quantity)}`;
};

export const CartOrderItemCard: React.FC<CartOrderItemCardProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <div className="group relative flex flex-col gap-2 p-3 rounded-xl border border-primary/20 bg-primary/5 transition-all">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-sm leading-tight">{item.menuItem.name}</h4>
          <p className="text-xs text-primary font-bold mt-1">
            {formatPriceLine(item.unitPrice, item.quantity)}
          </p>

          {item.selectedOptions.flatMap((group: CartItemOptionGroup) => group.selectedValues)
            .length > 0 && (
            <div className="mt-1 space-y-0.5">
              {item.selectedOptions
                .flatMap((group: CartItemOptionGroup) =>
                  group.selectedValues.map((value) => ({ ...value, groupName: group.groupName }))
                )
                .map((value) => (
                  <p
                    key={value.optionItemId}
                    className="text-[10px] text-muted-foreground flex items-center justify-between"
                  >
                    <span>
                      {UI_TEXT.COMMON.BULLET}
                      {value.groupName ? `${value.groupName}: ` : ""}
                      {value.label}
                    </span>
                    {value.extraPrice > 0 && (
                      <span>
                        {UI_TEXT.COMMON.PLUS}
                        {formatCurrency(value.extraPrice)}
                      </span>
                    )}
                  </p>
                ))}
            </div>
          )}

          {item.note && (
            <p className="text-[10px] text-orange-600 italic mt-1">
              {UI_TEXT.ORDER.NOTE(item.note)}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemoveItem(item.cartItemKey)}
          className="p-1.5 text-primary hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between mt-1">
        <Badge
          variant="ghost"
          className="text-[10px] font-bold px-2 py-0.5 border-none bg-order-new/15 text-order-new animate-fade-in-right"
        >
          {UI_TEXT.ORDER.CURRENT.NEW}
        </Badge>

        <div className="flex items-center bg-background rounded-lg border border-border shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 rounded-none rounded-l-lg hover:bg-secondary"
            onClick={() => onUpdateQuantity(item.cartItemKey, -1)}
          >
            <Minus className="size-3" />
          </Button>
          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 rounded-none rounded-r-lg hover:bg-secondary"
            onClick={() => onUpdateQuantity(item.cartItemKey, 1)}
          >
            <Plus className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
