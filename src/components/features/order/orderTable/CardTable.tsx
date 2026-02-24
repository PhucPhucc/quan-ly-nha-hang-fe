"use client";

import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";

import { mockTables } from "./mockData";
import TableList from "./TableList";

const CardTable = () => {
  const stats = {
    total: mockTables.length,
    ready: mockTables.filter((t) => t.status === "READY").length,
    inprocess: mockTables.filter((t) => t.status === "INPROCESS").length,
    reserved: mockTables.filter((t) => t.status === "RESERVED").length,
    cleaning: mockTables.filter((t) => t.status === "CLEANING").length,
  };

  return (
    <Tabs defaultValue="all" className="w-full h-full flex flex-col bg-background overflow-hidden">
      <div className="px-3 py-2 border-b bg-muted/20">
        <TabsList className="flex w-full justify-start gap-2 bg-transparent p-0 h-auto flex-wrap">
          <TabsTrigger
            value="all"
            className="rounded-full border border-transparent bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all gap-2"
          >
            {UI_TEXT.COMMON.ALL}
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-muted text-foreground">
              {stats.total}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="ready"
            className="rounded-full border border-transparent bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all gap-2"
          >
            {UI_TEXT.TABLE.READY}
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-table-empty/20 text-table-empty-dark">
              {stats.ready}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="inprocess"
            className="rounded-full border border-transparent bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all gap-2"
          >
            {UI_TEXT.TABLE.INPROCESS}
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-table-inprocess/20 text-table-inprocess">
              {stats.inprocess}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="reserved"
            className="rounded-full border border-transparent bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all gap-2"
          >
            {UI_TEXT.TABLE.RESERVED}
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-table-reserved/20 text-table-reserved">
              {stats.reserved}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="cleaning"
            className="rounded-full border border-transparent bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all gap-2"
          >
            {UI_TEXT.TABLE.CLEANING}
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-table-cleaning/20 text-table-cleaning">
              {stats.cleaning}
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
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
