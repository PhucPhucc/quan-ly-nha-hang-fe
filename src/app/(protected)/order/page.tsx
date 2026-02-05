import { Armchair, UtensilsCrossed } from "lucide-react";

import OrderCurrent from "@/components/features/order/orderCurrent/OrderCurrent";
import CardMenu from "@/components/features/order/orderMenu/CardMenu";
import CardTable from "@/components/features/order/orderTable/CardTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const page = () => {
  return (
    <div className="flex h-[calc(100vh-70px)] w-full bg-muted/40 p-2 gap-2 overflow-hidden">
      {/* Left Column: Table List & Menu Selection */}
      <Tabs defaultValue="table" className="flex-[1.5] w-full min-w-0 h-full flex flex-col">
        <TabsList className="w-full flex justify-start gap-0 p-0 bg-transparent h-auto z-10 relative">
          <TabsTrigger
            value="table"
            className="gap-2 rounded-t-xl rounded-b-none border border-b-0 border-transparent data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-primary transition-all relative top-px data-[state=active]:font-black data-[state=active]:border-t-primary/50"
          >
            <Armchair className="size-4" />
            <span>Bàn</span>
          </TabsTrigger>
          <TabsTrigger
            value="menu"
            className="gap-2 rounded-t-xl rounded-b-none border border-b-0 border-transparent data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-foreground transition-all relative top-px data-[state=active]:font-black data-[state=active]:border-t-primary/50"
          >
            <UtensilsCrossed className="size-4" />
            <span>Thực đơn</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0 border bg-background rounded-b-xl rounded-tr-xl shadow-sm overflow-hidden flex flex-col">
          <TabsContent value="table" className="flex-1 min-h-0 h-full m-0 p-0">
            <CardTable />
          </TabsContent>
          <TabsContent value="menu" className="flex-1 min-h-0 h-full m-0 p-0">
            <CardMenu />
          </TabsContent>
        </div>
      </Tabs>

      {/* Right Column: Order Details */}
      <div className="flex-1 flex flex-col h-full min-h-0 w-full">
        <div className="w-full flex justify-start gap-0 p-0 bg-transparent h-auto z-10 relative">
          <div className="flex items-center gap-2 rounded-t-xl rounded-b-none border border-b-0 border-border bg-background px-4 py-3 text-primary font-black border-t-primary/50 relative top-px">
            <Armchair className="size-4" />
            <span>Bàn 01</span>
          </div>
        </div>

        <div className="flex-1 min-h-0 border bg-background rounded-b-xl rounded-tr-xl shadow-sm overflow-hidden flex flex-col">
          <Tabs defaultValue="detail" className="flex-1 flex flex-col min-h-0">
            <div className="border-b px-2 bg-muted/20">
              <TabsList className="h-9 bg-transparent p-0">
                <TabsTrigger
                  value="detail"
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none"
                >
                  Chi tiết
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none"
                >
                  Lịch sử
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="detail" className="flex-1 min-h-0 m-0 p-0">
              <OrderCurrent />
            </TabsContent>
            <TabsContent value="history" className="flex-1 min-h-0 m-0 p-4">
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                Lịch sử đơn hàng
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default page;
