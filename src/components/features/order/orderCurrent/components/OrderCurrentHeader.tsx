import { ReceiptText } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";

interface OrderCurrentHeaderProps {
  tableName: string;
  itemCount: number;
  status: string;
}

const OrderCurrentHeader: React.FC<OrderCurrentHeaderProps> = ({
  tableName,
  itemCount,
  status,
}) => {
  return (
    <CardHeader className="py-2 px-3 border-b flex flex-row items-center justify-between shrink-0">
      <div>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <ReceiptText className="size-4 text-primary" />
          {UI_TEXT.DASHBOARD.RECENT_ORDERS.TITLE}
        </CardTitle>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {UI_TEXT.ORDER.DESCRIPTION_DETAIL(tableName, itemCount)}
        </p>
      </div>
      <Badge
        variant="outline"
        className="bg-table-inprocess text-white border-none py-0.5 text-[10px]"
      >
        {status}
      </Badge>
    </CardHeader>
  );
};

export default OrderCurrentHeader;
