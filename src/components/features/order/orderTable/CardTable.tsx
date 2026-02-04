import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";

import CardContainer from "../CardContainer";
import TableList from "./TableList";

const CardTable = () => {
  return (
    <CardContainer>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{UI_TEXT.COMMON.ALL}</TabsTrigger>
          <TabsTrigger value="ready">{UI_TEXT.TABLE.READY}</TabsTrigger>
          <TabsTrigger value="inprocess">{UI_TEXT.TABLE.INPROCESS}</TabsTrigger>
          <TabsTrigger value="reserved">{UI_TEXT.TABLE.RESERVED}</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <TableList />
        </TabsContent>
        <TabsContent value="ready"></TabsContent>
        <TabsContent value="inprocess"></TabsContent>
        <TabsContent value="reserved"></TabsContent>
      </Tabs>
    </CardContainer>
  );
};

export default CardTable;
