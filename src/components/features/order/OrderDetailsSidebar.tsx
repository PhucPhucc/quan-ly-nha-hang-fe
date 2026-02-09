import { Armchair, UtensilsCrossed } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import OrderCurrent from "./orderCurrent/OrderCurrent";

const OrderDetailsSidebar = () => {
  return (
    <div className="flex-1 flex flex-col h-full min-h-0 w-full">
      <Tabs
        defaultValue="detail"
        className="flex-1 flex flex-col h-full min-h-0 w-full border bg-background rounded-xl shadow-sm overflow-hidden"
      >
        <div className="border-b bg-muted/20 flex items-center justify-between px-4 py-2 shrink-0 h-14">
          <div className="flex items-center gap-3 font-black text-primary text-base">
            <div className="flex items-center justify-center size-9 bg-primary/10 rounded-lg">
              <Armchair className="size-5" />
            </div>
            <span>Bàn 01</span>
          </div>
          <TabsList className="h-9 bg-muted p-1 rounded-t-lg">
            <TabsTrigger
              value="detail"
              className="h-full rounded-md text-xs px-4 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Chi tiết
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="h-full rounded-md text-xs px-4 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Lịch sử
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
          <EmptyState
            title="Chưa có lịch sử"
            description="Bàn này chưa có đơn hàng nào được hoàn thành"
            icon={UtensilsCrossed}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderDetailsSidebar;
