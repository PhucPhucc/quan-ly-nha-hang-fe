import OrderCount from "@/components/features/order/OrderCount";
import OrderCurrent from "@/components/features/order/OrderCurrent";
import OrderList from "@/components/features/order/OrderList";
import SearchMenuOrder from "@/components/features/order/SearchMenuOrder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_MENU_ITEMS } from "@/data/mockMenu";
import { UI_TEXT } from "@/lib/UI_Text";

const page = () => {
  return (
    <div className="min-h-0 flex-1">
      <div className="mb-4">
        <OrderCount />
      </div>
      <div className="flex gap-4 w-full flex-1 min-h-0">
        <div className="flex-2/3">
          <SearchMenuOrder />
          <Tabs defaultValue="all" className="mt-2">
            <TabsList>
              <TabsTrigger value="all">{UI_TEXT.COMMON.ALL}</TabsTrigger>
              <TabsTrigger value="cf">Caffee</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <OrderList menuList={menuAll} />
            </TabsContent>
            <TabsContent value="cf">
              <OrderList menuList={menuCF} />
            </TabsContent>
          </Tabs>
        </div>
        <OrderCurrent />
      </div>
    </div>
  );
};

export default page;

const menuAll = MOCK_MENU_ITEMS.filter((item) => item);
const menuCF = MOCK_MENU_ITEMS.filter((item) => item.category_id === "CAT_01");
