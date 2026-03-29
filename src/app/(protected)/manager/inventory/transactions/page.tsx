"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RotateCcw, Search } from "lucide-react";
import { useState } from "react";

import { InventoryPagination } from "@/components/features/inventory/components/InventoryPagination";
import {
  INVENTORY_INPUT_CLASS,
  INVENTORY_SELECT_TRIGGER_CLASS,
  INVENTORY_TABLE_SURFACE_CLASS,
} from "@/components/features/inventory/components/inventoryStyles";
import { InventoryToolbar } from "@/components/features/inventory/components/InventoryToolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { InventoryTransaction, InventoryTransactionType } from "@/types/Inventory";

function formatType(type: unknown) {
  const numeric = typeof type === "string" ? Number(type) : (type as number | undefined);

  if (numeric === InventoryTransactionType.OpeningStock) {
    return UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_OPENING;
  }
  if (numeric === InventoryTransactionType.StockIn) {
    return UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_IN;
  }
  if (numeric === InventoryTransactionType.StockInReverse) {
    return UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_IN_REVERSE;
  }

  if (typeof type === "string") {
    const lowered = type.toLowerCase();
    if (lowered.includes("opening")) return UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_OPENING;
    if (lowered.includes("stockin")) return UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_IN;
    if (lowered.includes("reverse")) return UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_IN_REVERSE;
  }

  return UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_OTHER;
}

export default function InventoryTransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("-occurredAt");
  const pageSize = 10;

  const filters = typeFilter && typeFilter !== "all" ? [`transactionType:${typeFilter}`] : [];

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["inventory-transactions", page, search, typeFilter, sort],
    queryFn: () =>
      inventoryService.getInventoryTransactions(page, pageSize, {
        search,
        filters,
        orderBy: sort,
      }),
    placeholderData: keepPreviousData,
  });

  const transactions = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;
  const missingRows = Math.max(0, pageSize - transactions.length);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-4 pt-6">
      <InventoryToolbar
        actions={
          <>
            {isFetching ? (
              <span className="text-xs text-slate-400">{UI_TEXT.COMMON.LOADING}</span>
            ) : null}
            <Button
              variant="ghost"
              type="button"
              className="p-2 rounded-full hover:bg-card-foreground/10"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setSort("-occurredAt");
                setPage(1);
              }}
              title={UI_TEXT.COMMON.RESET}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </>
        }
      >
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder={UI_TEXT.INVENTORY.TOOLBAR.SEARCH_PLACEHOLDER}
            className={`${INVENTORY_INPUT_CLASS} pl-9`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Select
          value={typeFilter}
          onValueChange={(v) => {
            setTypeFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className={`${INVENTORY_SELECT_TRIGGER_CLASS} w-full sm:w-44`}>
            <SelectValue placeholder={UI_TEXT.COMMON.ALL} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">{UI_TEXT.COMMON.ALL}</SelectItem>
            <SelectItem value={String(InventoryTransactionType.OpeningStock)}>
              {UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_OPENING}
            </SelectItem>
            <SelectItem value={String(InventoryTransactionType.StockIn)}>
              {UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_IN}
            </SelectItem>
            <SelectItem value={String(InventoryTransactionType.StockInReverse)}>
              {UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_IN_REVERSE}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(v) => {
            setSort(v);
            setPage(1);
          }}
        >
          <SelectTrigger className={`${INVENTORY_SELECT_TRIGGER_CLASS} w-full sm:w-44`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="-occurredAt">{UI_TEXT.INVENTORY.TABLE.SORT_NEWEST}</SelectItem>
            <SelectItem value="occurredAt">{UI_TEXT.INVENTORY.TABLE.SORT_OLDEST}</SelectItem>
          </SelectContent>
        </Select>
      </InventoryToolbar>

      <div className={`${INVENTORY_TABLE_SURFACE_CLASS} mt-1`}>
        {isLoading ? (
          <div className="max-h-115 space-y-2 overflow-auto p-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <TableShell>
            <Table>
              <TableHeader>
                <TableRow variant="header">
                  <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_SKU}</TableHead>
                  <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_NAME}</TableHead>
                  <TableHead className="text-center">{UI_TEXT.INVENTORY.TABLE.COL_TYPE}</TableHead>
                  <TableHead className="text-center">{UI_TEXT.INVENTORY.TABLE.COL_QTY}</TableHead>
                  <TableHead className="text-center">
                    {UI_TEXT.INVENTORY.OPENING_STOCK.COL_COST}
                  </TableHead>
                  <TableHead className="text-center w-32 ">
                    {UI_TEXT.INVENTORY.TABLE.COL_BALANCE}
                  </TableHead>
                  <TableHead className="w-42 text-center">
                    {UI_TEXT.INVENTORY.TABLE.COL_REFERENCE}
                  </TableHead>
                  <TableHead className="text-right">{UI_TEXT.INVENTORY.TABLE.COL_DATE}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-28 text-center text-slate-500">
                      {UI_TEXT.INVENTORY.TABLE.EMPTY_ALERT}
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {transactions.map((item: InventoryTransaction) => (
                      <TableRow key={item.inventoryTransactionId} className="text-card-foreground">
                        <TableCell className="font-mono text-xs ">{item.ingredientCode}</TableCell>
                        <TableCell>{item.ingredientName}</TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center rounded-lg border border-border/80 bg-card-foreground/10 px-2.5 py-0.5 text-[10px] font-medium">
                            {formatType(item.transactionType)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-semibold">{item.quantity}</TableCell>
                        <TableCell className="text-center ">
                          {item.unitCost ?? UI_TEXT.COMMON.DASH}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-primary/90">
                          {item.balanceAfter}
                        </TableCell>
                        <TableCell className="text-center text-xs">
                          <div className="mx-auto truncate" title={item.reference || ""}>
                            {item.reference || UI_TEXT.COMMON.DASH}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {new Date(item.occurredAt).toLocaleString("vi-VN")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableShell>
        )}

        <div className="shrink-0 border-t border-slate-200 bg-white">
          <InventoryPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            totalItems={transactions.length}
            pageSize={pageSize}
          />
        </div>
      </div>
    </div>
  );
}
