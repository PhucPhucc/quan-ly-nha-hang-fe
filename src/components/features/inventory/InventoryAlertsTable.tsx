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
import { inventoryService } from "@/services/inventoryService";

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
    <div className="rounded-md border bg-card text-card-foreground shadow-sm p-4">
      <div className="flex flex-col mb-4">
        <h2 className="text-xl font-semibold mb-1">{UI_TEXT.INVENTORY.ALERTS_TITLE}</h2>
        <p className="text-muted-foreground text-sm">{UI_TEXT.INVENTORY.ALERTS_DESC}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="low-stock" className="flex gap-2">
            <AlertTriangle className="w-4 h-4" />
            {UI_TEXT.INVENTORY.ALERT_TAB_LOW_STOCK}
            <Badge
              variant="secondary"
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
            >
              {lowStockItems.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="expiring" className="flex gap-2">
            <Clock className="w-4 h-4" />
            {UI_TEXT.INVENTORY.ALERT_TAB_EXPIRING}
            <Badge
              variant="secondary"
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
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
                <TableRow>
                  <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_ITEM}</TableHead>
                  <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_CATEGORY}</TableHead>
                  <TableHead className="text-right">
                    {UI_TEXT.INVENTORY.TABLE.COL_CURRENT_STOCK}
                  </TableHead>
                  <TableHead className="text-right">
                    {UI_TEXT.INVENTORY.TABLE.COL_THRESHOLD}
                  </TableHead>
                  <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_STATUS}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right text-destructive font-semibold">
                      {item.currentStock} {item.unit}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.lowStockThreshold} {item.unit}
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">
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
                <TableRow>
                  <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_ITEM}</TableHead>
                  <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_BATCH}</TableHead>
                  <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_EXPIRATION}</TableHead>
                  <TableHead className="text-right">
                    {UI_TEXT.INVENTORY.TABLE.COL_REMAINING}
                  </TableHead>
                  <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_STATUS}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {UI_TEXT.INVENTORY.TABLE.HYPHEN}
                    </TableCell>{" "}
                    {/* Placeholder */}
                    <TableCell>
                      {item.expirationDate
                        ? new Date(item.expirationDate).toLocaleDateString()
                        : UI_TEXT.INVENTORY.TABLE.HYPHEN}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.currentStock} {item.unit}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-warning text-warning-foreground">
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
        <div className="mt-4 px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20 shrink-0 rounded-b-md">
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
