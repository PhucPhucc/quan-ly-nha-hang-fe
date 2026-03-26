"use client";

import { Armchair } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { useOrderBoardStore } from "@/store/useOrderStore";
import { OrderType } from "@/types/enums";

import OrderCurrent from "./orderCurrent/OrderCurrent";
import OrderHistory from "./orderCurrent/OrderHistory";

const OrderDetailsSidebar = () => {
  const order = useOrderBoardStore((state) => state.activeOrderDetails);

  const tableName = order
    ? order.orderType === OrderType.Takeaway
      ? UI_TEXT.ORDER.BOARD.TAKEAWAY
      : UI_TEXT.TABLE.TABLE_LABEL(order.tableId?.slice(-2) || "--")
    : UI_TEXT.ORDER.BOARD.NOT_SELECTED_TABLE;
  return (
    <div className="flex-1 flex flex-col h-full min-h-0 w-full overflow-x-hidden">
      <Tabs
        defaultValue="detail"
        className="flex-1 flex flex-col h-full min-h-0 w-full border bg-background rounded-xl shadow-sm overflow-hidden"
      >
        <div className="border-b bg-muted/20 flex items-center justify-between px-4 py-2 shrink-0 h-14">
          <div className="flex items-center gap-3 font-black text-primary text-base">
            <div className="flex items-center justify-center size-9 bg-primary/10 rounded-lg">
              <Armchair className="size-5" />
            </div>
            <span>{tableName}</span>
          </div>
          <TabsList className="h-9 bg-muted p-1 rounded-t-lg">
            <TabsTrigger
              value="detail"
              className="h-full rounded-md text-xs px-4 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              {UI_TEXT.BUTTON.DETAIL}
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="h-full rounded-md text-xs px-4 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              {UI_TEXT.BUTTON.HISTORY}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="detail"
          className="flex-1 m-0 p-0 min-h-0 overflow-hidden flex flex-col"
        >
          <OrderCurrent />
        </TabsContent>
        <TabsContent
          value="history"
          className="flex-1 m-0 p-0 min-h-0 overflow-hidden flex flex-col"
        >
          {/* <EmptyState
            title={UI_TEXT.AUDIT_LOG.EMPTY}
            description="Bàn này chưa có đơn hàng nào được hoàn thành"
            icon={UtensilsCrossed}
          /> */}
          <OrderHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderDetailsSidebar;
