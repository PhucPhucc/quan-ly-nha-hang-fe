"use client";

import { useQuery } from "@tanstack/react-query";
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
    placeholderData: (previousData) => previousData,
  });

  const transactions = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  if (isLoading) {
    return <TransactionSkeleton />;
  }

  if (!transactions.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-muted-foreground">
        {UI_TEXT.INVENTORY.TABLE.EMPTY_ALERT}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {UI_TEXT.INVENTORY.HISTORY_TITLE}
          </h2>
          <p className="text-sm text-muted-foreground">
            {UI_TEXT.INVENTORY.TABLE.HISTORY_DESC_FULL}
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="text-xs font-semibold uppercase text-slate-600">
                {UI_TEXT.INVENTORY.TABLE.COL_SKU}
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-600">
                {UI_TEXT.INVENTORY.TABLE.COL_NAME}
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-600 text-center">
                {UI_TEXT.INVENTORY.TABLE.COL_TYPE}
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-600 text-right">
                {UI_TEXT.INVENTORY.TABLE.COL_QTY}
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-600 text-right">
                {UI_TEXT.INVENTORY.OPENING_STOCK.COL_COST}
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-600 text-right">
                {UI_TEXT.INVENTORY.TABLE.COL_BALANCE}
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-600 text-center">
                {UI_TEXT.INVENTORY.TABLE.COL_REFERENCE}
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-600 text-center">
                {UI_TEXT.INVENTORY.TABLE.COL_DATE}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((item: InventoryTransaction) => (
              <TableRow key={item.inventoryTransactionId} className="hover:bg-slate-50/70">
                <TableCell className="font-mono text-sm text-slate-700">
                  {item.ingredientCode}
                </TableCell>
                <TableCell className="font-medium text-slate-800">{item.ingredientName}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="px-3 py-1 rounded-full text-xs">
                    {formatType(item.transactionType)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold text-slate-800">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-right text-slate-700">{item.unitCost ?? "-"}</TableCell>
                <TableCell className="text-right font-semibold text-primary">
                  {item.balanceAfter}
                </TableCell>
                <TableCell className="text-center text-slate-600">
                  {item.reference || UI_TEXT.COMMON.DASH}
                </TableCell>
                <TableCell className="text-center text-slate-600">
                  {new Date(item.occurredAt).toLocaleString("vi-VN")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <span>
          {UI_TEXT.INVENTORY.TABLE.PAGE} {page} {UI_TEXT.INVENTORY.TABLE.SLASH} {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {UI_TEXT.COMMON.PREVIOUS}
          </button>
          <button
            className="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            {UI_TEXT.COMMON.NEXT}
          </button>
        </div>
      </div>
    </div>
  );
}
