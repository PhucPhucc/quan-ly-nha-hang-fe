import OrderCurrent from "@/components/features/order/orderCurrent/OrderCurrent";
import CardMenu from "@/components/features/order/orderMenu/CardMenu";
import CardTable from "@/components/features/order/orderTable/CardTable";
import SearchMenuOrder from "@/components/features/order/SearchMenuOrder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";

const page = () => {
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col lg:flex-row gap-6 p-4 overflow-hidden bg-background/50">
      {/* left side: Table & Menu Selection */}
      <Tabs defaultValue="table" className="flex-[1.5] flex flex-col min-h-0">
        <TabsList
          variant="line"
          className="w-full flex items-center justify-between mb-4 border-b border-foreground/5"
        >
          <div className="flex items-center gap-1">
            <TabsTrigger value="table" className="px-6">
              {UI_TEXT.TABLE.TITLE}
            </TabsTrigger>
            <TabsTrigger value="menu" className="px-6">
              Menu
            </TabsTrigger>
          </div>
          <SearchMenuOrder />
        </TabsList>
        <div className="flex-1 min-h-0 overflow-hidden">
          <TabsContent value="table" className="flex-1 min-h-0 m-0">
            <CardTable />
          </TabsContent>
          <TabsContent value="menu" className="flex-1 min-h-0 m-0">
            <CardMenu />
          </TabsContent>
        </div>
      </Tabs>

      {/* right side: Current Order & History */}
      <Tabs defaultValue="current" className="flex-1 flex flex-col min-h-0">
        <TabsList variant="line" className="w-full flex gap-4 mb-4 border-b border-foreground/5">
          <TabsTrigger value="current" className="px-6">
            {UI_TEXT.DASHBOARD.RECENT_ORDERS.TITLE}
          </TabsTrigger>
          <TabsTrigger value="order-history" className="px-6">
            Lịch sử
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 min-h-0 overflow-hidden">
          <TabsContent value="current" className="flex-1 min-h-0 h-full m-0">
            <OrderCurrent />
          </TabsContent>
          <TabsContent
            value="order-history"
            className="flex-1 min-h-0 h-full m-0 text-muted-foreground text-center pt-20"
          >
            {UI_TEXT.ORDER.EMPTY}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default page;
