"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { InventoryPagination } from "@/components/features/inventory/components/InventoryPagination";
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
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { InventoryTransaction, InventoryTransactionType } from "@/types/Inventory";

function formatType(type: unknown) {
  // Normalize both numeric and string enum values
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

  // Fallback if BE returns string name instead of numeric
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

  const filters = useMemo(() => {
    const result: string[] = [];
    if (typeFilter && typeFilter !== "all") {
      result.push(`transactionType:${typeFilter}`);
    }
    return result;
  }, [typeFilter]);

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
    <div className="flex flex-col gap-6 p-6">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={UI_TEXT.INVENTORY.TOOLBAR.SEARCH_PLACEHOLDER}
              className="h-11 rounded-2xl border-border bg-background pl-10 focus-visible:ring-primary/20"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 min-w-[220px]">
              <span className="text-sm font-medium text-slate-600">
                {UI_TEXT.INVENTORY.TABLE.COL_TYPE}
              </span>
              <Select
                value={typeFilter}
                onValueChange={(v) => {
                  setTypeFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-11 rounded-2xl border-border bg-background">
                  <SelectValue placeholder={UI_TEXT.COMMON.ALL} />
                </SelectTrigger>
                <SelectContent>
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
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 min-w-[200px]">
                <span className="text-sm font-medium text-muted-foreground">
                  {UI_TEXT.INVENTORY.TABLE.COL_SORT}
                </span>
                <Select
                  value={sort}
                  onValueChange={(v) => {
                    setSort(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-11 rounded-2xl border-border bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-occurredAt">
                      {UI_TEXT.INVENTORY.TABLE.SORT_NEWEST}
                    </SelectItem>
                    <SelectItem value="occurredAt">
                      {UI_TEXT.INVENTORY.TABLE.SORT_OLDEST}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                className="h-10 w-10 shrink-0 rounded-full border border-border text-muted-foreground"
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
            </div>

            {isFetching && (
              <span className="text-xs text-muted-foreground">{UI_TEXT.COMMON.LOADING}</span>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-soft">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
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
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-28 text-center text-muted-foreground">
                    {UI_TEXT.INVENTORY.TABLE.EMPTY_ALERT}
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {transactions.map((item: InventoryTransaction) => (
                    <TableRow key={item.inventoryTransactionId} className="hover:bg-muted/60">
                      <TableCell className="font-mono text-sm text-foreground/80">
                        {item.ingredientCode}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {item.ingredientName}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/80">
                          {formatType(item.transactionType)}
                        </span>
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
                  {missingRows > 0 &&
                    Array.from({ length: missingRows }).map((_, index) => (
                      <TableRow key={`placeholder-${index}`} className="h-11">
                        <TableCell colSpan={8} className="p-0" />
                      </TableRow>
                    ))}
                </>
              )}
            </TableBody>
          </Table>
        )}

        <InventoryPagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>
    </div>
  );
}
