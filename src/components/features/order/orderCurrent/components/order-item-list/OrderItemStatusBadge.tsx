import React from "react";

import { Badge } from "@/components/ui/badge";
import { UI_TEXT } from "@/lib/UI_Text";
import { OrderItemStatus } from "@/types/enums";

interface OrderItemStatusBadgeProps {
  status: OrderItemStatus;
}

export const OrderItemStatusBadge: React.FC<OrderItemStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case OrderItemStatus.Preparing:
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600 text-[10px] py-0">
          {UI_TEXT.ORDER.CURRENT.STATUS_PREP}
        </Badge>
      );
    case OrderItemStatus.Cooking:
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600 text-[10px] py-0">
          {UI_TEXT.ORDER.CURRENT.STATUS_COOKING}
        </Badge>
      );
    case OrderItemStatus.Completed:
      return (
        <Badge className="bg-slate-500 hover:bg-slate-600 text-[10px] py-0">
          {UI_TEXT.ORDER.CURRENT.STATUS_DONE}
        </Badge>
      );
    default:
      return null;
  }
};
