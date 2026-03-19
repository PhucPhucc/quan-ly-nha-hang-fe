"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatInventoryQuantity } from "@/lib/inventory-number";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { InventoryTransaction, InventoryTransactionType } from "@/types/Inventory";

import { InventoryPagination } from "./components/InventoryPagination";
import {
  INVENTORY_LOADING_CLASS,
  INVENTORY_TABLE_CONTAINER_CLASS,
  INVENTORY_TH_CLASS,
  INVENTORY_THEAD_CLASS,
  INVENTORY_THEAD_ROW_CLASS,
  INVENTORY_TROW_CLASS,
} from "./components/inventoryStyles";

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

export function InventoryTransactionsTable() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-transactions", page, pageSize],
    queryFn: () => inventoryService.getInventoryTransactions(page, pageSize),
    placeholderData: keepPreviousData,
  });

  const transactions = data?.data?.items ?? [];
  const totalCount = data?.data?.totalCount ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className={INVENTORY_LOADING_CLASS}>
          <History className="h-6 w-6 animate-spin text-primary/40 mr-3" />
          <span className="font-bold text-lg tracking-tight text-foreground/30">
            {UI_TEXT.COMMON.LOADING}
            {UI_TEXT.COMMON.ELLIPSIS}
          </span>
        </div>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground/50 font-bold italic tracking-tight">
        {UI_TEXT.INVENTORY.TABLE.EMPTY_ALERT}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className={INVENTORY_TABLE_CONTAINER_CLASS}>
        <Table>
          <TableHeader className={INVENTORY_THEAD_CLASS}>
            <TableRow className={INVENTORY_THEAD_ROW_CLASS}>
              <TableHead className={`${INVENTORY_TH_CLASS} pl-6`}>
                {UI_TEXT.INVENTORY.TABLE.COL_SKU}
              </TableHead>
              <TableHead className={INVENTORY_TH_CLASS}>
                {UI_TEXT.INVENTORY.TABLE.COL_NAME}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_TYPE}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-right`}>
                {UI_TEXT.INVENTORY.TABLE.COL_QTY}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-right`}>
                {UI_TEXT.INVENTORY.OPENING_STOCK.COL_COST}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-right`}>
                {UI_TEXT.INVENTORY.TABLE.COL_BALANCE}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                {UI_TEXT.INVENTORY.TABLE.COL_REFERENCE}
              </TableHead>
              <TableHead className={`${INVENTORY_TH_CLASS} text-center pr-6`}>
                {UI_TEXT.INVENTORY.TABLE.COL_DATE}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((item: InventoryTransaction) => (
              <TableRow key={item.inventoryTransactionId} className={INVENTORY_TROW_CLASS}>
                <TableCell className="pl-6 font-mono text-xs font-bold text-muted-foreground/60 uppercase">
                  {item.ingredientCode}
                </TableCell>
                <TableCell className="font-bold text-foreground/80 tracking-tight">
                  {item.ingredientName}
                </TableCell>
                <TableCell className="text-center py-3">
                  <Badge
                    variant="secondary"
                    className="px-3 py-0.5 rounded-lg text-[10px] uppercase font-black tracking-widest bg-muted/50 text-muted-foreground/80 border-none shadow-none"
                  >
                    {formatType(item.transactionType)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-black tabular-nums text-foreground/90">
                  {formatInventoryQuantity(item.quantity)}
                </TableCell>
                <TableCell className="text-right font-medium text-muted-foreground tabular-nums">
                  {item.unitCost
                    ? item.unitCost.toLocaleString(UI_TEXT.COMMON.LOCALE_VI)
                    : UI_TEXT.COMMON.DASH}
                </TableCell>
                <TableCell className="text-right font-black tabular-nums text-primary/80 bg-primary/5">
                  {formatInventoryQuantity(item.balanceAfter)}
                </TableCell>
                <TableCell className="text-center font-bold text-[10px] text-muted-foreground/40 italic">
                  {item.reference || UI_TEXT.COMMON.DASH}
                </TableCell>
                <TableCell className="text-center pr-6 font-medium text-muted-foreground/70 text-[11px] tabular-nums">
                  {new Date(item.occurredAt).toLocaleString(UI_TEXT.COMMON.LOCALE_VI, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="shrink-0 border-t border-border/50 bg-muted/5">
        <InventoryPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={totalCount}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
