import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";

import CardContainer from "../CardContainer";

const CardMenu = () => {
  return (
    <CardContainer>
      <Tabs defaultValue="all" className="mt-2">
        <TabsList>
          <TabsTrigger value="all">{UI_TEXT.COMMON.ALL}</TabsTrigger>
          <TabsTrigger value="cf">Caffee</TabsTrigger>
          <TabsTrigger value="soup">Soup</TabsTrigger>
          <TabsTrigger value="tea">Tea</TabsTrigger>
        </TabsList>
        <TabsContent value="all">{/* <OrderList menuList={[]} /> */}</TabsContent>
        <TabsContent value="cf">{/* <OrderList menuList={[]} /> */}</TabsContent>
      </Tabs>
    </CardContainer>
  );
};

export default CardMenu;

// const menuAll = MOCK_MENU_ITEMS.filter((item) => item);
// const menuCF = MOCK_MENU_ITEMS.filter((item) => item.category_id === "CAT_01");
