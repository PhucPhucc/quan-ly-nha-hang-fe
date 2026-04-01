import { Ticket } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn, formatCurrency } from "@/lib/utils";
import { OrderItem } from "@/types/Order";

import { getRemoteItemTotal } from "./order-item-list.utils";
import { OrderItemMeta } from "./OrderItemMeta";
import { OrderItemStatusBadge } from "./OrderItemStatusBadge";

interface RemoteOrderItemCardProps {
  item: OrderItem;
  isFree: boolean;
  isCombo?: boolean;
  hidePrice?: boolean;
  priceOverride?: number;
  isClickable?: boolean;
  className?: string;
  isComboExpanded?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const RemoteOrderItemCard: React.FC<RemoteOrderItemCardProps> = ({
  item,
  isFree,
  isCombo = false,
  hidePrice = false,
  priceOverride,
  isClickable = false,
  className,
  isComboExpanded = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
  children,
}) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col gap-2 rounded-xl border p-3 transition-all duration-500 ease-out motion-reduce:transition-none",
        isClickable && "cursor-pointer",
        isCombo
          ? "border-primary/20 bg-primary/5"
          : isFree
            ? "bg-emerald-500/10 border-emerald-500/20"
            : "border-border/50 bg-secondary/20",
        isClickable &&
          "hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/[0.07] hover:shadow-md hover:shadow-primary/10 active:scale-[0.99]",
        className,
        isComboExpanded && "border-primary/35 bg-primary/[0.08] shadow-md shadow-primary/10"
      )}
    >
      <div className="flex justify-between flex-1 text-muted-foreground">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4
              className={cn(
                "font-semibold text-sm leading-tight",
                isFree ? "text-emerald-700" : "text-foreground"
              )}
            >
              {item.itemNameSnapshot}
            </h4>
            {isCombo && (
              <Badge
                variant="outline"
                className="border-primary/20 bg-primary/10 text-primary text-[10px] py-0"
              >
                {UI_TEXT.MENU.TAB_COMBO_S}
              </Badge>
            )}
            {isFree && (
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px] py-0 gap-1">
                <Ticket className="w-3 h-3" />
                {UI_TEXT.VOUCHER.GIFT_BADGE}
              </Badge>
            )}
          </div>

          <OrderItemMeta item={item} />
        </div>

        <div className={cn("text-sm font-medium text-right", isFree ? "text-emerald-600" : "")}>
          {!hidePrice && (
            <p>{formatCurrency(isFree ? 0 : (priceOverride ?? getRemoteItemTotal(item)))}</p>
          )}
          <p>{UI_TEXT.ORDER.QUANTITY(item.quantity)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-1">
        <div className="animate-fade-in-right">
          <OrderItemStatusBadge status={item.status} />
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {children}
    </div>
  );
};
