"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import { InventoryTransaction, InventoryTransactionType } from "@/types/Inventory";

import { InventoryPagination } from "./components/InventoryPagination";

function formatType(type: InventoryTransactionType) {
  switch (type) {
    case InventoryTransactionType.OpeningStock:
      return UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_OPENING;
    case InventoryTransactionType.StockIn:
      return UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_IN;
    case InventoryTransactionType.StockInReverse:
      return UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_IN_REVERSE;
    default:
      return UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_OTHER;
  }
}

function TransactionSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function InventoryTransactionsTable() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-transactions", page, pageSize],
    queryFn: () => inventoryService.getInventoryTransactions(page, pageSize),
    placeholderData: keepPreviousData,
  });

  const transactions = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  if (isLoading) {
    return <TransactionSkeleton />;
  }

  if (!transactions.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
        {UI_TEXT.INVENTORY.TABLE.EMPTY_ALERT}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-card-foreground">
            {UI_TEXT.INVENTORY.HISTORY_TITLE}
          </h2>
          <p className="text-sm text-muted-foreground">
            {UI_TEXT.INVENTORY.TABLE.HISTORY_DESC_FULL}
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                {UI_TEXT.INVENTORY.TABLE.COL_SKU}
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                {UI_TEXT.INVENTORY.TABLE.COL_NAME}
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-center">
                {UI_TEXT.INVENTORY.TABLE.COL_TYPE}
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-right">
                {UI_TEXT.INVENTORY.TABLE.COL_QTY}
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-right">
                {UI_TEXT.INVENTORY.OPENING_STOCK.COL_COST}
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-right">
                {UI_TEXT.INVENTORY.TABLE.COL_BALANCE}
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-center">
                {UI_TEXT.INVENTORY.TABLE.COL_REFERENCE}
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-center">
                {UI_TEXT.INVENTORY.TABLE.COL_DATE}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((item: InventoryTransaction) => (
              <TableRow key={item.inventoryTransactionId} className="hover:bg-muted/60">
                <TableCell className="font-mono text-sm text-foreground/80">
                  {item.ingredientCode}
                </TableCell>
                <TableCell className="font-medium text-foreground">{item.ingredientName}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="px-3 py-1 rounded-full text-xs">
                    {formatType(item.transactionType)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold text-foreground">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-right text-foreground/80">
                  {item.unitCost ?? UI_TEXT.COMMON.DASH}
                </TableCell>
                <TableCell className="text-right font-semibold text-primary">
                  {item.balanceAfter}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {item.reference || UI_TEXT.COMMON.DASH}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {new Date(item.occurredAt).toLocaleString("vi-VN")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <InventoryPagination
        currentPage={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
    </div>
  );
}
