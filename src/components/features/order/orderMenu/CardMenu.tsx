import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";

const CardMenu = () => {
  return (
    <Tabs defaultValue="all" className="w-full h-full flex flex-col">
      <TabsList className="w-full flex justify-start gap-0 p-0 bg-transparent h-auto z-10 relative">
        <TabsTrigger
          value="all"
          className="gap-2 rounded-t-xl rounded-b-none border border-b-0 border-transparent data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-foreground transition-all relative top-px data-[state=active]:font-black data-[state=active]:border-t-primary/50"
        >
          {UI_TEXT.COMMON.ALL}
        </TabsTrigger>
        <TabsTrigger
          value="cf"
          className="gap-2 rounded-t-xl rounded-b-none border border-b-0 border-transparent data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-foreground transition-all relative top-px data-[state=active]:font-black data-[state=active]:border-t-primary/50"
        >
          Caffee
        </TabsTrigger>
        <TabsTrigger
          value="soup"
          className="gap-2 rounded-t-xl rounded-b-none border border-b-0 border-transparent data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-foreground transition-all relative top-px data-[state=active]:font-black data-[state=active]:border-t-primary/50"
        >
          Soup
        </TabsTrigger>
        <TabsTrigger
          value="tea"
          className="gap-2 rounded-t-xl rounded-b-none border border-b-0 border-transparent data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-foreground transition-all relative top-px data-[state=active]:font-black data-[state=active]:border-t-primary/50"
        >
          Tea
        </TabsTrigger>
      </TabsList>

      <div className="flex-1 min-h-0 border bg-background rounded-b-xl rounded-tr-xl shadow-sm overflow-hidden flex flex-col">
        <TabsContent value="all" className="flex-1 m-0 h-full p-0">
          {/* <OrderList menuList={[]} /> */}
        </TabsContent>
        <TabsContent value="cf" className="flex-1 m-0 h-full p-0">
          {/* <OrderList menuList={[]} /> */}
        </TabsContent>
        <TabsContent value="soup" className="flex-1 m-0 h-full p-0">
          {/* <OrderList menuList={[]} /> */}
        </TabsContent>
        <TabsContent value="tea" className="flex-1 m-0 h-full p-0">
          {/* <OrderList menuList={[]} /> */}
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default CardMenu;

// const menuAll = MOCK_MENU_ITEMS.filter((item) => item);
// const menuCF = MOCK_MENU_ITEMS.filter((item) => item.category_id === "CAT_01");
