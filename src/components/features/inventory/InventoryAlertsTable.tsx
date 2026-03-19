"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Clock, History } from "lucide-react";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";

import { InventoryPagination } from "./components/InventoryPagination";
import {
  INVENTORY_LOADING_CLASS,
  INVENTORY_TABLE_CONTAINER_CLASS,
  INVENTORY_TABLE_SURFACE_CLASS,
  INVENTORY_TH_CLASS,
  INVENTORY_THEAD_CLASS,
  INVENTORY_THEAD_ROW_CLASS,
  INVENTORY_TROW_CLASS,
} from "./components/inventoryStyles";

export function InventoryAlertsTable() {
  const [activeTab, setActiveTab] = useState("low-stock");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["ingredients", currentPage, pageSize],
    queryFn: () => inventoryService.getIngredients(currentPage, pageSize),
  });

  const ingredients = data?.data?.items || [];
  const totalItems = data?.data?.totalCount || 0;
  const totalPages = data?.data?.totalPages || 1;

  const lowStockItems = ingredients.filter((i) => i.currentStock <= i.lowStockThreshold);
  const expiringItems = ingredients.filter((i) => i.expirationDate !== undefined);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className={INVENTORY_LOADING_CLASS}>
          <History className="mr-3 h-5 w-5 animate-spin text-primary/40" />
          <span className="text-sm font-bold tracking-tight text-foreground/30 capitalize">
            {UI_TEXT.COMMON.LOADING}
            {UI_TEXT.COMMON.ELLIPSIS}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`${INVENTORY_TABLE_SURFACE_CLASS} flex flex-col overflow-hidden shadow-none rounded-[1.5rem]`}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="p-4 bg-background/50 border-b border-border/30">
            <TabsList className="grid w-full grid-cols-2 h-11 bg-muted/30 p-1 rounded-xl">
              <TabsTrigger
                value="low-stock"
                className="rounded-lg h-9 data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider transition-all gap-2"
              >
                <AlertTriangle className="h-3.5 w-3.5 mb-0.5" />
                {UI_TEXT.INVENTORY.ALERT_TAB_LOW_STOCK}
                <span className="ml-1 opacity-40 tabular-nums">
                  {UI_TEXT.COMMON.PAREN_LEFT}
                  {lowStockItems.length}
                  {UI_TEXT.COMMON.PAREN_RIGHT}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="expiring"
                className="rounded-lg h-9 data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider transition-all gap-2"
              >
                <Clock className="h-3.5 w-3.5 mb-0.5" />
                {UI_TEXT.INVENTORY.ALERT_TAB_EXPIRING}
                <span className="ml-1 opacity-40 tabular-nums">
                  {UI_TEXT.COMMON.PAREN_LEFT}
                  {expiringItems.length}
                  {UI_TEXT.COMMON.PAREN_RIGHT}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="low-stock" className="m-0 border-none outline-none">
            <div className={INVENTORY_TABLE_CONTAINER_CLASS}>
              <Table>
                <TableHeader className={INVENTORY_THEAD_CLASS}>
                  <TableRow className={INVENTORY_THEAD_ROW_CLASS}>
                    <TableHead className={`${INVENTORY_TH_CLASS} pl-8`}>
                      {UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}
                    </TableHead>
                    <TableHead className={INVENTORY_TH_CLASS}>
                      {UI_TEXT.INVENTORY.TABLE.COL_ITEM}
                    </TableHead>
                    <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                      {UI_TEXT.INVENTORY.TABLE.COL_CURRENT_STOCK}
                    </TableHead>
                    <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                      {UI_TEXT.INVENTORY.TABLE.COL_THRESHOLD}
                    </TableHead>
                    <TableHead className={`${INVENTORY_TH_CLASS} pr-8 text-center`}>
                      {UI_TEXT.INVENTORY.TABLE.COL_STATUS}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-32 text-center text-muted-foreground/30 font-medium italic"
                      >
                        {UI_TEXT.INVENTORY.TABLE.EMPTY_ALERT}
                      </TableCell>
                    </TableRow>
                  ) : (
                    lowStockItems.map((item, index) => (
                      <TableRow key={item.ingredientId || index} className={INVENTORY_TROW_CLASS}>
                        <TableCell className="pl-8 font-mono text-[10px] text-muted-foreground/50 font-bold uppercase tracking-tight">
                          {item.code || UI_TEXT.COMMON.DASH}
                        </TableCell>
                        <TableCell className="font-bold text-foreground/80">{item.name}</TableCell>
                        <TableCell className="text-center font-black text-rose-500 tabular-nums">
                          {item.currentStock} {item.unit}
                        </TableCell>
                        <TableCell className="text-center font-bold text-muted-foreground/40 tabular-nums">
                          {item.lowStockThreshold} {item.unit}
                        </TableCell>
                        <TableCell className="pr-8 text-center">
                          <Badge
                            className={`rounded-lg uppercase text-[9px] font-black tracking-widest px-2.5 py-0.5 border-none shadow-none ${
                              item.currentStock === 0
                                ? "bg-rose-50 text-rose-600"
                                : "bg-orange-50 text-orange-600"
                            }`}
                          >
                            {item.currentStock === 0
                              ? UI_TEXT.INVENTORY.STOCK.STATUS_OUT
                              : UI_TEXT.INVENTORY.STOCK.STATUS_LOW}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="expiring" className="m-0 border-none outline-none">
            <div className={INVENTORY_TABLE_CONTAINER_CLASS}>
              <Table>
                <TableHeader className={INVENTORY_THEAD_CLASS}>
                  <TableRow className={INVENTORY_THEAD_ROW_CLASS}>
                    <TableHead className={`${INVENTORY_TH_CLASS} pl-8`}>
                      {UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}
                    </TableHead>
                    <TableHead className={INVENTORY_TH_CLASS}>
                      {UI_TEXT.INVENTORY.TABLE.COL_ITEM}
                    </TableHead>
                    <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                      {UI_TEXT.INVENTORY.TABLE.COL_EXPIRATION}
                    </TableHead>
                    <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                      {UI_TEXT.INVENTORY.TABLE.COL_REMAINING}
                    </TableHead>
                    <TableHead className={`${INVENTORY_TH_CLASS} pr-8 text-center`}>
                      {UI_TEXT.INVENTORY.TABLE.COL_STATUS}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-32 text-center text-muted-foreground/30 font-medium italic"
                      >
                        {UI_TEXT.INVENTORY.TABLE.EMPTY_EXPIRING}
                      </TableCell>
                    </TableRow>
                  ) : (
                    expiringItems.map((item, index) => (
                      <TableRow key={item.ingredientId || index} className={INVENTORY_TROW_CLASS}>
                        <TableCell className="pl-8 font-mono text-[10px] text-muted-foreground/50 font-bold uppercase tracking-tight">
                          {item.code || "N/A"}
                        </TableCell>
                        <TableCell className="font-bold text-foreground/80">{item.name}</TableCell>
                        <TableCell className="text-center font-bold text-muted-foreground/70 tabular-nums italic text-xs">
                          {item.expirationDate
                            ? new Date(item.expirationDate).toLocaleDateString(
                                UI_TEXT.COMMON.LOCALE_VI
                              )
                            : UI_TEXT.INVENTORY.TABLE.EM_DASH}
                        </TableCell>
                        <TableCell className="text-center font-black text-foreground/90 tabular-nums">
                          {item.currentStock} {item.unit}
                        </TableCell>
                        <TableCell className="pr-8 text-center">
                          <Badge className="bg-orange-50 text-orange-600 rounded-lg uppercase text-[9px] font-black tracking-widest px-2.5 py-0.5 border-none shadow-none">
                            {UI_TEXT.INVENTORY.TABLE.EXPIRING_BADGE}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        <InventoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
