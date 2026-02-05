"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import TableList from "./TableList";
import { mockTables } from "./mockData";

const CardTable = () => {
  const stats = {
    total: mockTables.length,
    ready: mockTables.filter((t) => t.status === "READY").length,
    inprocess: mockTables.filter((t) => t.status === "INPROCESS").length,
    reserved: mockTables.filter((t) => t.status === "RESERVED").length,
    cleaning: mockTables.filter((t) => t.status === "CLEANING").length,
  };

  return (
    <Tabs defaultValue="all" className="w-full h-full flex flex-col">
      <TabsList className="w-full flex justify-start gap-0 p-0 bg-transparent h-auto z-10 relative">
        <TabsTrigger
          value="all"
          className="gap-2 rounded-t-xl rounded-b-none border border-b-0 border-transparent data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-foreground transition-all relative top-px data-[state=active]:font-black data-[state=active]:border-t-primary/50"
        >
          {UI_TEXT.COMMON.ALL}{" "}
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-secondary text-foreground">
            {stats.total}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="ready"
          className="gap-2 rounded-t-xl rounded-b-none border border-b-0 border-transparent data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-table-empty-dark transition-all relative top-px data-[state=active]:font-black data-[state=active]:border-t-table-empty-dark/50"
        >
          {UI_TEXT.TABLE.READY}{" "}
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-table-empty/20 text-table-empty-dark">
            {stats.ready}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="inprocess"
          className="gap-2 rounded-t-xl rounded-b-none border border-b-0 border-transparent data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-table-inprocess transition-all relative top-px data-[state=active]:font-black data-[state=active]:border-t-table-inprocess/50"
        >
          {UI_TEXT.TABLE.INPROCESS}{" "}
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-table-inprocess/20 text-table-inprocess">
            {stats.inprocess}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="reserved"
          className="gap-2 rounded-t-xl rounded-b-none border border-b-0 border-transparent data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-table-reserved transition-all relative top-px data-[state=active]:font-black data-[state=active]:border-t-table-reserved/50"
        >
          {UI_TEXT.TABLE.RESERVED}{" "}
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-table-reserved/20 text-table-reserved">
            {stats.reserved}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="cleaning"
          className="gap-2 rounded-t-xl rounded-b-none border border-b-0 border-transparent data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-table-cleaning transition-all relative top-px data-[state=active]:font-black data-[state=active]:border-t-table-cleaning/50"
        >
          {UI_TEXT.TABLE.CLEANING}{" "}
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-table-cleaning/20 text-table-cleaning">
            {stats.cleaning}
          </span>
        </TabsTrigger>
      </TabsList>

      <div className="flex-1 min-h-0 border bg-background rounded-b-xl rounded-tr-xl shadow-sm overflow-hidden flex flex-col">
        <TabsContent value="all" className="flex-1 m-0 h-full p-0">
          <TableList statusFilter="all" />
        </TabsContent>
        <TabsContent value="ready" className="flex-1 m-0 h-full p-0">
          <TableList statusFilter="ready" />
        </TabsContent>
        <TabsContent value="inprocess" className="flex-1 m-0 h-full p-0">
          <TableList statusFilter="inprocess" />
        </TabsContent>
        <TabsContent value="reserved" className="flex-1 m-0 h-full p-0">
          <TableList statusFilter="reserved" />
        </TabsContent>
        <TabsContent value="cleaning" className="flex-1 m-0 h-full p-0">
          <TableList statusFilter="cleaning" />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default CardTable;
