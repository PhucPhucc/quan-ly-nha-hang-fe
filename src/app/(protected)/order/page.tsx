import { Armchair, UtensilsCrossed } from "lucide-react";

import OrderCurrent from "@/components/features/order/orderCurrent/OrderCurrent";
import CardMenu from "@/components/features/order/orderMenu/CardMenu";
import CardTable from "@/components/features/order/orderTable/CardTable";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const page = () => {
  return (
    <div className="flex h-[calc(100vh-100px)] w-full bg-muted/40 p-2 gap-2 overflow-hidden">
      {/* Left Column: Table List & Menu Selection */}
      <Tabs defaultValue="table" className="flex-[1.5] gap-0 w-full min-w-0 h-full flex flex-col">
        <TabsList className="w-full flex justify-start gap-0 p-0 bg-transparent h-auto z-10 rounded-t-lg rounded-b-none relative border-b border-border">
          <TabsTrigger
            value="table"
            className="gap-2 rounded-t-none data-[state=active]:rounded-t-xl rounded-b-none border border-b-0 border-transparent px-4 py-3 text-muted-foreground transition-all relative top-px data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:font-black data-[state=active]:shadow-none"
          >
            <Armchair className="size-4" />
            <span>Bàn</span>
          </TabsTrigger>
          <TabsTrigger
            value="menu"
            className="gap-2 rounded-t-none data-[state=active]:rounded-t-xl rounded-b-none border border-b-0 border-transparent px-4 py-3 text-muted-foreground transition-all relative top-px data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:font-black data-[state=active]:shadow-none"
          >
            <UtensilsCrossed className="size-4" />
            <span>Thực đơn</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0 border border-border border-t-0 bg-background rounded-b-xl shadow-sm overflow-hidden flex flex-col">
          <TabsContent value="table" className="flex-1 min-h-0 h-full m-0 p-0 ">
            <CardTable />
          </TabsContent>
          <TabsContent value="menu" className="flex-1 min-h-0 h-full m-0 p-0">
            <CardMenu />
          </TabsContent>
        </div>
      </Tabs>

      {/* Right Column: Order Details */}
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
    </div>
  );
};

export default page;
