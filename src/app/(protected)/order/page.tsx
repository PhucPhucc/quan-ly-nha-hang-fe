import OrderCurrent from "@/components/features/order/orderCurrent/OrderCurrent";
import CardMenu from "@/components/features/order/orderMenu/CardMenu";
import CardTable from "@/components/features/order/orderTable/CardTable";
import SearchMenuOrder from "@/components/features/order/SearchMenuOrder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const page = () => {
  return (
    <div className="min-h-0 flex-1 flex gap-4">
      {/* left side */}
      <Tabs defaultValue="table" className="flex-1">
        <TabsList variant="line" className="w-full flex gap-2 justify-between mb-2">
          <div className="flex items-center">
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
          </div>
          <SearchMenuOrder />
        </TabsList>
        <TabsContent value="table">
          <CardTable />
        </TabsContent>
        <TabsContent value="menu">
          <CardMenu />
        </TabsContent>
      </Tabs>

      {/* right side */}
      <Tabs defaultValue="current" className="flex-1">
        <TabsList variant="line" className="mb-2">
          <TabsTrigger value="current">
            {/* {UI_TEXT.ORDER.CURRENT_ORDER} */}
            don hang hien tai
          </TabsTrigger>
          <TabsTrigger value="order-history">
            {/* {UI_TEXT.ORDER.ORDER_HISTORY} */}
            lich su don hang
          </TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          <OrderCurrent />
        </TabsContent>
        <TabsContent value="order-history">{/* <OrderHistory /> */}</TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
