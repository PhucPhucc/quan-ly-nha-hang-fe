"use client";

import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import React, { useState } from "react";

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
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";

export function StockHistoryTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["stockHistory", currentPage, pageSize],
    queryFn: () => inventoryService.getStockHistory(currentPage, pageSize),
  });

  const history = data?.data?.items || [];
  const totalPages = data?.data?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>
          {UI_TEXT.INVENTORY.TABLE.ERROR_PREFIX} {(error as Error).message}
        </p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20">
        <History className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">{UI_TEXT.INVENTORY.TABLE.EMPTY_HISTORY}</h3>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-200 bg-slate-50 hover:bg-slate-50">
            <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
              {UI_TEXT.INVENTORY.TABLE.COL_DATE}
            </TableHead>
            <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
              {UI_TEXT.INVENTORY.TABLE.COL_ITEM}
            </TableHead>
            <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
              {UI_TEXT.INVENTORY.TABLE.COL_BATCH}
            </TableHead>
            <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
              {UI_TEXT.INVENTORY.TABLE.COL_SUPPLIER}
            </TableHead>
            <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
              {UI_TEXT.INVENTORY.TABLE.COL_QTY}
            </TableHead>
            <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
              {UI_TEXT.INVENTORY.TABLE.COL_PRICE}
            </TableHead>
            <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
              {UI_TEXT.INVENTORY.TABLE.COL_TOTAL_COST}
            </TableHead>
            <TableHead className="text-center font-semibold uppercase text-[11px] tracking-wider text-slate-700">
              {UI_TEXT.INVENTORY.TABLE.COL_RECEIVER}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((record) => (
            <TableRow key={record.id} className="border-slate-100 hover:bg-slate-50/50">
              <TableCell className="text-center">
                {new Date(record.receivedDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-center font-medium">{record.ingredientName}</TableCell>
              <TableCell className="text-center font-mono text-xs text-muted-foreground">
                {record.batchNumber}
              </TableCell>
              <TableCell className="text-center">{record.supplierName}</TableCell>
              <TableCell className="text-center">{record.quantityAdded}</TableCell>
              <TableCell className="text-center">
                {UI_TEXT.INVENTORY.TABLE.CURRENCY}
                {record.costPerUnit.toFixed(2)}
              </TableCell>
              <TableCell className="text-center font-medium">
                {UI_TEXT.INVENTORY.TABLE.CURRENCY}
                {record.totalCost.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">{record.receivedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
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
