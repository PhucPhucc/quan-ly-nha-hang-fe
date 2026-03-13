import { ReceiptText } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import { OrderStatus } from "@/types/enums";

interface OrderCurrentHeaderProps {
  tableName: string;
  itemCount: number;
  status?: OrderStatus;
}

const StatusMap: Record<OrderStatus, { label: string; color: string }> = {
  Ready: { label: UI_TEXT.TABLE.READY, color: "bg-table-empty text-muted-foreground" },
  Serving: { label: UI_TEXT.TABLE.SERVING, color: "bg-table-serving text-muted " },
  Reserved: { label: UI_TEXT.TABLE.RESERVED, color: "bg-table-reserved text-muted " },
  Cleaning: { label: UI_TEXT.TABLE.CLEANING, color: "bg-table-cleaning text-muted " },
  Cancelled: { label: UI_TEXT.TABLE.CANCELLED, color: "bg-orange-500 text-muted " },
  Completed: { label: UI_TEXT.TABLE.COMPLETED, color: "bg-emerald-500 text-muted " },
  Paid: { label: "Đã thanh toán", color: "bg-slate-500 text-muted " },
  OutOfService: {
    label: UI_TEXT.TABLE.OUT_OF_SERVICE,
    color: "bg-table-out-of-service text-muted ",
  },
};

//  : UI_TEXT.TABLE.SERVING
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
        className={`${StatusMap[status || OrderStatus.Ready]?.color || "bg-muted-foreground"} border-none py-0.5 text-[10px]`}
      >
        {StatusMap[status || OrderStatus.Ready]?.label || status}
      </Badge>
    </CardHeader>
  );
};

export default OrderCurrentHeader;
