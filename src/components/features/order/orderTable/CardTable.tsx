"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import CardContainer from "../CardContainer";
import TableList from "./TableList";

const CardTable = () => {
  return (
    <CardContainer className="flex-1 min-h-0">
      <Tabs defaultValue="all" className="w-full h-full flex flex-col min-h-0">
        <TabsList
          variant="line"
          className="w-full flex justify-start gap-4 mb-4 border-b border-foreground/5 shadow-none"
        >
          <TabsTrigger value="all">{UI_TEXT.COMMON.ALL}</TabsTrigger>
          <TabsTrigger value="ready">{UI_TEXT.TABLE.READY}</TabsTrigger>
          <TabsTrigger value="inprocess">{UI_TEXT.TABLE.INPROCESS}</TabsTrigger>
          <TabsTrigger value="reserved">{UI_TEXT.TABLE.RESERVED}</TabsTrigger>
          <TabsTrigger value="cleaning">{UI_TEXT.TABLE.CLEANING}</TabsTrigger>
        </TabsList>

        <div className="flex-1 min-h-0">
          <TabsContent value="all" className="h-full m-0">
            <TableList statusFilter="all" />
          </TabsContent>
          <TabsContent value="ready" className="h-full m-0">
            <TableList statusFilter="ready" />
          </TabsContent>
          <TabsContent value="inprocess" className="h-full m-0">
            <TableList statusFilter="inprocess" />
          </TabsContent>
          <TabsContent value="reserved" className="h-full m-0">
            <TableList statusFilter="reserved" />
          </TabsContent>
          <TabsContent value="cleaning" className="h-full m-0">
            <TableList statusFilter="cleaning" />
          </TabsContent>
        </div>
      </Tabs>
    </CardContainer>
  );
};

export default CardTable;
