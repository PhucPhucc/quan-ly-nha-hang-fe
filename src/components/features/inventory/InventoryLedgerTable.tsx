"use client";

import { useQuery } from "@tanstack/react-query";
import { History, LucideTags } from "lucide-react";
import React from "react";

import { DatePicker } from "@/components/shared/DatePicker";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTimeWithBranding } from "@/lib/branding-formatting";
import { formatInventoryQuantity, normalizeInventoryQuantity } from "@/lib/inventory-number";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { InventoryLedgerItem, InventoryTransactionType } from "@/types/Inventory";

import {
  INVENTORY_LOADING_CLASS,
  INVENTORY_SELECT_TRIGGER_CLASS,
  INVENTORY_TABLE_CONTAINER_CLASS,
  INVENTORY_TABLE_SURFACE_CLASS,
  INVENTORY_TH_CLASS,
  INVENTORY_THEAD_CLASS,
  INVENTORY_THEAD_ROW_CLASS,
  INVENTORY_TROW_CLASS,
} from "./components/inventoryStyles";
import { InventoryToolbar } from "./components/InventoryToolbar";
import { useInventoryLedger } from "./useInventoryLedger";

export function InventoryLedgerTable() {
  const {
    ledger,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    transactionType,
    setTransactionType,
    ingredientId,
    setIngredient,
    isLoading,
  } = useInventoryLedger();

  const { data: ingredientsData } = useQuery({
    queryKey: ["inventory-ledger-ingredients"],
    queryFn: () => inventoryService.getIngredients(1, 1000),
  });

  const ingredients = ingredientsData?.data?.items ?? [];

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className={INVENTORY_LOADING_CLASS}>
          <History className="h-6 w-6 animate-spin text-primary/40 mr-3" />
          <span className="font-bold text-lg tracking-tight text-foreground/30">
            {UI_TEXT.COMMON.LOADING}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InventoryToolbar>
        <DatePicker
          value={fromDate}
          onChange={setFromDate}
          placeholder={UI_TEXT.COMMON.FROM_DATE}
        />
        <DatePicker value={toDate} onChange={setToDate} placeholder={UI_TEXT.COMMON.TO_DATE} />

        <Select
          value={ingredientId || "all"}
          onValueChange={(value) => {
            if (value === "all") {
              setIngredient("", "");
              return;
            }

            const selectedIngredient = ingredients.find(
              (ingredient) => ingredient.ingredientId === value
            );
            setIngredient(value, selectedIngredient?.name);
          }}
        >
          <SelectTrigger
            className={`${INVENTORY_SELECT_TRIGGER_CLASS} h-11 w-full sm:w-64 rounded-lg border-none bg-muted/30 font-bold`}
          >
            <SelectValue placeholder={UI_TEXT.INVENTORY.REPORT.SELECT_MATERIAL} />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border/40 shadow-2xl p-1.5">
            <SelectItem value="all" className="rounded-lg px-3 py-2 text-xs font-bold">
              {UI_TEXT.INVENTORY.REPORT.CATEGORY_ALL}
            </SelectItem>
            {ingredients.map((ingredient) => (
              <SelectItem
                key={ingredient.ingredientId}
                value={ingredient.ingredientId}
                className="rounded-lg px-3 py-2 text-xs font-bold"
              >
                {ingredient.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={transactionType?.toString() ?? "all"}
          onValueChange={(val) => setTransactionType(val === "all" ? undefined : Number(val))}
        >
          <SelectTrigger
            className={`${INVENTORY_SELECT_TRIGGER_CLASS} h-11 w-full sm:w-64 rounded-lg border-none bg-muted/30 font-bold uppercase tracking-widest text-[10px]`}
          >
            <div className="flex items-center gap-2">
              <span className="opacity-40">
                {UI_TEXT.INVENTORY.TABLE.COL_TYPE}
                {UI_TEXT.COMMON.COLON}
              </span>
              <SelectValue placeholder={UI_TEXT.INVENTORY.TOOLBAR.STATUS_ALL} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border/40 shadow-2xl p-1.5">
            <SelectItem value="all" className="rounded-lg px-3 py-2 text-xs font-bold">
              {UI_TEXT.INVENTORY.TOOLBAR.STATUS_ALL}
            </SelectItem>
            <SelectItem
              value={InventoryTransactionType.StockIn.toString()}
              className="rounded-lg px-3 py-2 text-xs font-bold"
            >
              {UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_IN}
            </SelectItem>
            <SelectItem
              value={InventoryTransactionType.SaleDeduction.toString()}
              className="rounded-lg px-3 py-2 text-xs font-bold"
            >
              {UI_TEXT.INVENTORY.REPORT.COL_SALE}
            </SelectItem>
            <SelectItem
              value={InventoryTransactionType.InventoryCheck.toString()}
              className="rounded-lg px-3 py-2 text-xs font-bold"
            >
              {UI_TEXT.INVENTORY.CHECK.TITLE}
            </SelectItem>
            <SelectItem
              value={InventoryTransactionType.OpeningStock.toString()}
              className="rounded-lg px-3 py-2 text-xs font-bold"
            >
              {UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_OPENING}
            </SelectItem>
          </SelectContent>
        </Select>
      </InventoryToolbar>

      <div className={`${INVENTORY_TABLE_SURFACE_CLASS} flex flex-col overflow-hidden`}>
        <div className={INVENTORY_TABLE_CONTAINER_CLASS}>
          <Table>
            <TableHeader className={INVENTORY_THEAD_CLASS}>
              <TableRow className={INVENTORY_THEAD_ROW_CLASS}>
                <TableHead className={`${INVENTORY_TH_CLASS} pl-8 w-[200px]`}>
                  {UI_TEXT.INVENTORY.REPORT.LEDGER_COL_TIME}
                </TableHead>
                {!ingredientId && (
                  <TableHead className={INVENTORY_TH_CLASS}>
                    {UI_TEXT.INVENTORY.TABLE.COL_NAME}
                  </TableHead>
                )}
                <TableHead className={`${INVENTORY_TH_CLASS} text-center`}>
                  {UI_TEXT.INVENTORY.TABLE.COL_TYPE}
                </TableHead>
                <TableHead className={INVENTORY_TH_CLASS}>
                  {UI_TEXT.INVENTORY.TABLE.COL_REFERENCE}
                </TableHead>
                <TableHead className={`${INVENTORY_TH_CLASS} text-right`}>
                  {UI_TEXT.INVENTORY.REPORT.LEDGER_COL_DELTA}
                </TableHead>
                <TableHead className={`${INVENTORY_TH_CLASS} text-right`}>
                  {UI_TEXT.INVENTORY.TABLE.COL_BALANCE}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledger.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={ingredientId ? 6 : 7}
                    className="h-40 text-center text-muted-foreground font-bold italic tracking-tight opacity-30"
                  >
                    {UI_TEXT.INVENTORY.OPENING_STOCK.EMPTY_SEARCH}
                  </TableCell>
                </TableRow>
              ) : (
                ledger.map((item: InventoryLedgerItem, index) => (
                  <TableRow key={`${item.referenceNo}-${index}`} className={INVENTORY_TROW_CLASS}>
                    <TableCell className="pl-8 font-mono text-[11px] font-bold text-muted-foreground/60 tabular-nums">
                      {formatDateTimeWithBranding(item.occurredAt, undefined, true)}
                    </TableCell>
                    {!ingredientId && (
                      <TableCell>
                        <span className="text-sm font-black text-foreground/80">
                          {item.ingredientName}
                        </span>
                      </TableCell>
                    )}
                    <TableCell className="text-center py-3">
                      <Badge
                        variant="secondary"
                        className="px-3 py-0.5 rounded-lg text-[10px] uppercase font-black tracking-widest bg-muted/50 text-muted-foreground/80 border-none shadow-none"
                      >
                        {formatType(item.transactionType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-black text-[11px] uppercase tracking-tight text-primary/70">
                        <LucideTags className="h-3 w-3 opacity-50" />
                        {item.referenceNo}
                      </div>
                    </TableCell>
                    <TableCell
                      className={`text-right font-black tabular-nums text-lg ${normalizeInventoryQuantity(item.quantityDelta) > 0 ? "text-emerald-500 bg-emerald-500/5" : "text-destructive bg-destructive/5"}`}
                    >
                      {normalizeInventoryQuantity(item.quantityDelta) > 0
                        ? `+${formatInventoryQuantity(item.quantityDelta)}`
                        : formatInventoryQuantity(item.quantityDelta)}
                    </TableCell>
                    <TableCell className="text-right font-black tabular-nums text-foreground/90 bg-muted/5">
                      {formatInventoryQuantity(item.balanceAfter)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="h-12 bg-muted/5 border-t border-border/30 shrink-0" />
      </div>
    </div>
  );
}

function formatType(type: InventoryTransactionType) {
  switch (type) {
    case InventoryTransactionType.OpeningStock:
      return UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_OPENING;
    case InventoryTransactionType.StockIn:
      return UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_IN;
    case InventoryTransactionType.SaleDeduction:
      return UI_TEXT.INVENTORY.REPORT.COL_SALE;
    case InventoryTransactionType.InventoryCheck:
      return UI_TEXT.INVENTORY.CHECK.TITLE;
    default:
      return "KHÁC";
  }
}
