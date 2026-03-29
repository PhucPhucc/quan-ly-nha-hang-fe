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
  TableShell,
} from "@/components/ui/table";
import { formatInventoryQuantity, normalizeInventoryQuantity } from "@/lib/inventory-number";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { InventoryLedgerItem, InventoryTransactionType } from "@/types/Inventory";

import {
  INVENTORY_LOADING_CLASS,
  INVENTORY_SELECT_TRIGGER_CLASS,
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
      <div className="flex h-100 items-center justify-center">
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
          <SelectTrigger className={`${INVENTORY_SELECT_TRIGGER_CLASS} w-full sm:w-36`}>
            <SelectValue placeholder={UI_TEXT.INVENTORY.REPORT.SELECT_MATERIAL} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="px-3 py-2">
              {UI_TEXT.INVENTORY.REPORT.CATEGORY_ALL}
            </SelectItem>
            {ingredients.map((ingredient) => (
              <SelectItem
                key={ingredient.ingredientId}
                value={ingredient.ingredientId}
                className="px-3 py-2 "
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
          <SelectTrigger className={`${INVENTORY_SELECT_TRIGGER_CLASS} w-full sm:w-40 rounded-lg `}>
            <SelectValue placeholder={UI_TEXT.INVENTORY.TOOLBAR.STATUS_ALL} />
          </SelectTrigger>
          <SelectContent className="border shadow-2xl">
            <SelectItem value="all" className="rounded-lg px-3 py-2">
              {UI_TEXT.INVENTORY.TOOLBAR.STATUS_ALL}
            </SelectItem>
            <SelectItem value={InventoryTransactionType.StockIn.toString()} className=" px-3 py-2 ">
              {UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_IN}
            </SelectItem>
            <SelectItem
              value={InventoryTransactionType.SaleDeduction.toString()}
              className=" px-3 py-2 "
            >
              {UI_TEXT.INVENTORY.REPORT.COL_SALE}
            </SelectItem>
            <SelectItem
              value={InventoryTransactionType.InventoryCheck.toString()}
              className="rounded-lg px-3 py-2"
            >
              {UI_TEXT.INVENTORY.CHECK.TITLE}
            </SelectItem>
            <SelectItem
              value={InventoryTransactionType.OpeningStock.toString()}
              className="rounded-lg px-3 py-2"
            >
              {UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_OPENING}
            </SelectItem>
          </SelectContent>
        </Select>
      </InventoryToolbar>

      <TableShell>
        <Table>
          <TableHeader>
            <TableRow variant="header">
              <TableHead>{UI_TEXT.INVENTORY.REPORT.LEDGER_COL_TIME}</TableHead>
              {!ingredientId && <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_NAME}</TableHead>}
              <TableHead className={` text-center`}>{UI_TEXT.INVENTORY.TABLE.COL_TYPE}</TableHead>
              <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_REFERENCE}</TableHead>
              <TableHead className={` text-right`}>
                {UI_TEXT.INVENTORY.REPORT.LEDGER_COL_DELTA}
              </TableHead>
              <TableHead className="text-right">{UI_TEXT.INVENTORY.TABLE.COL_BALANCE}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ledger.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={ingredientId ? 6 : 7}
                  className="h-40 text-center text-card-foreground/10 font-bold italic tracking-tight opacity-30"
                >
                  {UI_TEXT.INVENTORY.OPENING_STOCK.EMPTY_SEARCH}
                </TableCell>
              </TableRow>
            ) : (
              ledger.map((item: InventoryLedgerItem, index) => (
                <TableRow key={`${item.referenceNo}-${index}`} className="text-card-foreground">
                  <TableCell className="tabular-nums">
                    {new Date(item.occurredAt).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  {!ingredientId && (
                    <TableCell>
                      <span className="text-sm">{item.ingredientName}</span>
                    </TableCell>
                  )}
                  <TableCell className="text-center py-3">
                    <Badge
                      variant="secondary"
                      className="px-3 py-0.5 rounded-lg text-[10px] uppercase font-bold tracking-widest bg-card-foreground/10 text-card-foreground border-none shadow-none"
                    >
                      {formatType(item.transactionType)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 font-bold text-[11px] tracking-tight text-primary/70">
                      <LucideTags className="h-3 w-3 opacity-50" />
                      {item.referenceNo ? item.referenceNo : UI_TEXT.INVENTORY.TABLE.NO_REF}
                    </div>
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold tabular-nums ${normalizeInventoryQuantity(item.quantityDelta) > 0 ? "text-emerald-500" : "text-destructive"}`}
                  >
                    {normalizeInventoryQuantity(item.quantityDelta) > 0
                      ? `+${formatInventoryQuantity(item.quantityDelta)}`
                      : formatInventoryQuantity(item.quantityDelta)}
                  </TableCell>
                  <TableCell className="text-right font-bold tabular-nums">
                    {formatInventoryQuantity(item.balanceAfter)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableShell>
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
