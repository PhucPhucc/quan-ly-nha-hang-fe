"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RotateCcw, Search } from "lucide-react";
import { useState } from "react";

import { InventoryPagination } from "@/components/features/inventory/components/InventoryPagination";
import {
  INVENTORY_ICON_BUTTON_CLASS,
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
              className={INVENTORY_ICON_BUTTON_CLASS}
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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
          <SelectTrigger
            className={`${INVENTORY_SELECT_TRIGGER_CLASS} min-h-[40px] w-full sm:w-44`}
          >
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
          <SelectTrigger
            className={`${INVENTORY_SELECT_TRIGGER_CLASS} min-h-[40px] w-full sm:w-44`}
          >
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
          <div className="max-h-[460px] space-y-2 overflow-auto p-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <Table containerClassName="max-h-[460px] overflow-auto">
            <TableHeader className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50 shadow-sm">
              <TableRow className="border-slate-200 bg-slate-50 hover:bg-slate-50">
                <TableHead className="bg-slate-50 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                  {UI_TEXT.INVENTORY.TABLE.COL_SKU}
                </TableHead>
                <TableHead className="bg-slate-50 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                  {UI_TEXT.INVENTORY.TABLE.COL_NAME}
                </TableHead>
                <TableHead className="bg-slate-50 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                  {UI_TEXT.INVENTORY.TABLE.COL_TYPE}
                </TableHead>
                <TableHead className="bg-slate-50 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                  {UI_TEXT.INVENTORY.TABLE.COL_QTY}
                </TableHead>
                <TableHead className="bg-slate-50 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                  {UI_TEXT.INVENTORY.OPENING_STOCK.COL_COST}
                </TableHead>
                <TableHead className="bg-slate-50 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                  {UI_TEXT.INVENTORY.TABLE.COL_BALANCE}
                </TableHead>
                <TableHead className="w-[120px] bg-slate-50 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                  {UI_TEXT.INVENTORY.TABLE.COL_REFERENCE}
                </TableHead>
                <TableHead className="bg-slate-50 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-800">
                  {UI_TEXT.INVENTORY.TABLE.COL_DATE}
                </TableHead>
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
                    <TableRow
                      key={item.inventoryTransactionId}
                      className="h-[52px] hover:bg-slate-50/80"
                    >
                      <TableCell className="font-mono text-sm text-slate-600">
                        {item.ingredientCode}
                      </TableCell>
                      <TableCell className="border-l border-slate-50/50 font-medium text-slate-900">
                        {item.ingredientName}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center rounded-full border border-slate-200/50 bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600">
                          {formatType(item.transactionType)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-slate-900">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right text-slate-600">
                        {item.unitCost ?? UI_TEXT.COMMON.DASH}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary/90">
                        {item.balanceAfter}
                      </TableCell>
                      <TableCell className="w-[120px] text-center text-xs text-slate-500">
                        <div
                          className="mx-auto max-w-[110px] truncate"
                          title={item.reference || ""}
                        >
                          {item.reference || UI_TEXT.COMMON.DASH}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-[10px] text-slate-500">
                        {new Date(item.occurredAt).toLocaleString("vi-VN")}
                      </TableCell>
                    </TableRow>
                  ))}
                  {missingRows > 0 &&
                    Array.from({ length: missingRows }).map((_, index) => (
                      <TableRow key={`placeholder-${index}`} className="h-[52px]">
                        <TableCell colSpan={8} className="p-0" />
                      </TableRow>
                    ))}
                </>
              )}
            </TableBody>
          </Table>
        )}

        <div className="shrink-0 border-t border-slate-200 bg-white">
          <InventoryPagination
            currentPage={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      </div>
    </div>
  );
}
