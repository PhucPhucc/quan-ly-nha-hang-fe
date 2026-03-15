"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Clock } from "lucide-react";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

function getAlertRowKey(
  item: { ingredientId?: string; code?: string; name?: string },
  index: number
) {
  return item.ingredientId ?? item.code ?? item.name ?? `inventory-alert-${index}`;
}

export function InventoryAlertsTable() {
  const [activeTab, setActiveTab] = useState("low-stock");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ingredients", currentPage, pageSize],
    queryFn: () => inventoryService.getIngredients(currentPage, pageSize),
  });

  const ingredients = data?.data?.items || [];
  const totalPages = data?.data?.totalPages || 1;

  // Fake filter for mock logic, real one would query explicit API parameters
  const lowStockItems = ingredients.filter((i) => i.currentStock <= i.lowStockThreshold);
  const expiringItems = ingredients.filter((i) => i.expirationDate !== undefined); // mock logic

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex flex-col text-center">
        <h2 className="mb-1 text-xl font-semibold text-slate-900">
          {UI_TEXT.INVENTORY.ALERTS_TITLE}
        </h2>
        <p className="text-muted-foreground text-sm">{UI_TEXT.INVENTORY.ALERTS_DESC}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 grid h-auto w-full grid-cols-2 rounded-xl bg-slate-100 p-1">
          <TabsTrigger
            value="low-stock"
            className="flex items-center justify-center gap-2 rounded-lg"
          >
            <AlertTriangle className="w-4 h-4" />
            {UI_TEXT.INVENTORY.ALERT_TAB_LOW_STOCK}
            <Badge
              variant="secondary"
              className="ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0"
            >
              {lowStockItems.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="expiring"
            className="flex items-center justify-center gap-2 rounded-lg"
          >
            <Clock className="w-4 h-4" />
            {UI_TEXT.INVENTORY.ALERT_TAB_EXPIRING}
            <Badge
              variant="secondary"
              className="ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0"
            >
              {expiringItems.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="low-stock" className="m-0">
          {lowStockItems.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {UI_TEXT.INVENTORY.TABLE.EMPTY_ALERT}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 bg-slate-50 hover:bg-slate-50">
                  <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
                    {UI_TEXT.INVENTORY.TABLE.COL_ITEM}
                  </TableHead>
                  <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
                    {UI_TEXT.INVENTORY.TABLE.COL_CATEGORY}
                  </TableHead>
                  <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
                    {UI_TEXT.INVENTORY.TABLE.COL_CURRENT_STOCK}
                  </TableHead>
                  <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
                    {UI_TEXT.INVENTORY.TABLE.COL_THRESHOLD}
                  </TableHead>
                  <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
                    {UI_TEXT.INVENTORY.TABLE.COL_STATUS}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.map((item, index) => (
                  <TableRow
                    key={getAlertRowKey(item, index)}
                    className="border-slate-100 hover:bg-slate-50/50"
                  >
                    <TableCell className="text-center font-medium">{item.name}</TableCell>
                    <TableCell className="text-center">{item.category}</TableCell>
                    <TableCell className="text-center font-semibold text-destructive">
                      {item.currentStock} {item.unit}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.lowStockThreshold} {item.unit}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="destructive" className="min-w-24 justify-center">
                        {item.currentStock === 0
                          ? UI_TEXT.INVENTORY.STOCK.STATUS_OUT
                          : UI_TEXT.INVENTORY.STOCK.STATUS_LOW}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="expiring" className="m-0">
          {expiringItems.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {UI_TEXT.INVENTORY.TABLE.EMPTY_EXPIRING}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 bg-slate-50 hover:bg-slate-50">
                  <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
                    {UI_TEXT.INVENTORY.TABLE.COL_ITEM}
                  </TableHead>
                  <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
                    {UI_TEXT.INVENTORY.TABLE.COL_BATCH}
                  </TableHead>
                  <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
                    {UI_TEXT.INVENTORY.TABLE.COL_EXPIRATION}
                  </TableHead>
                  <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
                    {UI_TEXT.INVENTORY.TABLE.COL_REMAINING}
                  </TableHead>
                  <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
                    {UI_TEXT.INVENTORY.TABLE.COL_STATUS}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringItems.map((item, index) => (
                  <TableRow
                    key={getAlertRowKey(item, index)}
                    className="border-slate-100 hover:bg-slate-50/50"
                  >
                    <TableCell className="text-center font-medium">{item.name}</TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {UI_TEXT.INVENTORY.TABLE.HYPHEN}
                    </TableCell>{" "}
                    {/* Placeholder */}
                    <TableCell className="text-center">
                      {item.expirationDate
                        ? new Date(item.expirationDate).toLocaleDateString()
                        : UI_TEXT.INVENTORY.TABLE.HYPHEN}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.currentStock} {item.unit}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="min-w-24 justify-center bg-warning text-warning-foreground">
                        {UI_TEXT.INVENTORY.TABLE.EXPIRING_BADGE}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination Footer */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between rounded-b-xl border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 mr-2">
              {UI_TEXT.INVENTORY.TABLE.PAGE}
            </span>
            <div className="flex items-center justify-center min-w-12 px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-sm font-bold">{currentPage}</span>
              <span className="text-muted-foreground mx-1">{UI_TEXT.INVENTORY.TABLE.SLASH}</span>
              <span className="text-sm font-medium text-muted-foreground">{totalPages}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="h-8 shadow-sm transition-all hover:shadow-md"
            >
              {UI_TEXT.COMMON.PREVIOUS}
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="h-8 shadow-sm transition-all hover:shadow-md"
            >
              {UI_TEXT.COMMON.NEXT}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
