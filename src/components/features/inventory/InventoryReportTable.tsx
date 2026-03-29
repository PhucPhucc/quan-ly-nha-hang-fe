"use client";

import { useQuery } from "@tanstack/react-query";
import { History, LucideListTree, Wallet } from "lucide-react";
import Link from "next/link";
import React from "react";

import { DatePicker } from "@/components/shared/DatePicker";
import { Button } from "@/components/ui/button";
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
import { formatInventoryQuantity } from "@/lib/inventory-number";
import { UI_TEXT } from "@/lib/UI_Text";
import { formatCurrency } from "@/lib/utils";
import { inventoryService } from "@/services/inventory.service";
import { InventoryReportItem } from "@/types/Inventory";

import {
  INVENTORY_LOADING_CLASS,
  INVENTORY_TABLE_CONTAINER_CLASS,
  INVENTORY_TABLE_SURFACE_CLASS,
  INVENTORY_TH_CLASS,
  INVENTORY_THEAD_CLASS,
  INVENTORY_THEAD_ROW_CLASS,
  INVENTORY_TROW_CLASS,
} from "./components/inventoryStyles";
import { InventoryToolbar } from "./components/InventoryToolbar";
import { useInventoryReport } from "./useInventoryReport";

export function InventoryReportTable() {
  const {
    report,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    ingredientId,
    setIngredientId,
    isLoading,
  } = useInventoryReport();

  const { data: ingredientsData } = useQuery({
    queryKey: ["inventory-report-ingredients"],
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
            {UI_TEXT.COMMON.ELLIPSIS}
          </span>
        </div>
      </div>
    );
  }

  const totalInventoryValue = report.reduce((acc, i) => acc + i.closingStockValue, 0);

  return (
    <div className="space-y-6">
      <InventoryToolbar
        actions={
          <div className="flex items-center gap-4 bg-primary/5 px-6 py-2.5 rounded-[1.5rem] border border-primary/10 shadow-sm">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                {UI_TEXT.INVENTORY.REPORT.TOTAL_VALUE_LABEL}
              </span>
              <span className="text-xl font-black text-primary tabular-nums">
                {formatCurrency(totalInventoryValue)}
              </span>
            </div>
          </div>
        }
      >
        <DatePicker
          value={fromDate}
          onChange={setFromDate}
          placeholder={UI_TEXT.COMMON.FROM_DATE}
        />
        <DatePicker value={toDate} onChange={setToDate} placeholder={UI_TEXT.COMMON.TO_DATE} />

        <Select
          value={ingredientId ?? "all"}
          onValueChange={(value) => setIngredientId(value === "all" ? undefined : value)}
        >
          <SelectTrigger className="h-11 w-full rounded-lg border-none bg-muted/30 font-bold sm:w-[240px]">
            <SelectValue placeholder={UI_TEXT.INVENTORY.REPORT.SELECT_MATERIAL} />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="all">{UI_TEXT.INVENTORY.REPORT.CATEGORY_ALL}</SelectItem>
            {ingredients.map((ingredient) => (
              <SelectItem key={ingredient.ingredientId} value={ingredient.ingredientId}>
                {ingredient.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </InventoryToolbar>

      <div className={`${INVENTORY_TABLE_SURFACE_CLASS} flex flex-col overflow-hidden shadow-none`}>
        <div className={INVENTORY_TABLE_CONTAINER_CLASS}>
          <Table>
            <TableHeader className={INVENTORY_THEAD_CLASS}>
              <TableRow className={INVENTORY_THEAD_ROW_CLASS}>
                <TableHead className={`${INVENTORY_TH_CLASS} pl-8`}>
                  {UI_TEXT.INVENTORY.TABLE.COL_SKU}
                </TableHead>
                <TableHead className={INVENTORY_TH_CLASS}>
                  {UI_TEXT.INVENTORY.TABLE.COL_NAME}
                </TableHead>
                <TableHead className={`${INVENTORY_TH_CLASS} text-right`}>
                  {UI_TEXT.INVENTORY.REPORT.COL_OPENING}
                </TableHead>
                <TableHead className={`${INVENTORY_TH_CLASS} text-right text-emerald-600`}>
                  {UI_TEXT.INVENTORY.REPORT.COL_IN}
                </TableHead>
                <TableHead className={`${INVENTORY_TH_CLASS} text-right text-destructive`}>
                  {UI_TEXT.INVENTORY.REPORT.COL_OUT}
                </TableHead>
                <TableHead className={`${INVENTORY_TH_CLASS} text-right`}>
                  {UI_TEXT.INVENTORY.REPORT.COL_CLOSING}
                </TableHead>
                <TableHead className={`${INVENTORY_TH_CLASS} text-right`}>
                  {UI_TEXT.INVENTORY.REPORT.COL_AVG_COST}
                </TableHead>
                <TableHead className={`${INVENTORY_TH_CLASS} text-right pr-6`}>
                  {UI_TEXT.INVENTORY.REPORT.COL_VALUE}
                </TableHead>
                <TableHead className={`${INVENTORY_TH_CLASS} w-[60px] pr-8`} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-40 text-center text-muted-foreground/30 font-bold italic"
                  >
                    {UI_TEXT.INVENTORY.OPENING_STOCK.EMPTY_SEARCH}
                  </TableCell>
                </TableRow>
              ) : (
                report.map((item: InventoryReportItem) => (
                  <TableRow key={item.ingredientId} className={INVENTORY_TROW_CLASS}>
                    <TableCell className="pl-8 font-mono text-[11px] font-bold text-muted-foreground/50 uppercase">
                      {item.ingredientCode}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black text-foreground/80 tracking-tight">
                          {item.ingredientName}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground/40 tracking-wider">
                          {item.unit}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold tabular-nums text-muted-foreground/60">
                      {formatInventoryQuantity(item.openingStock)}
                    </TableCell>
                    <TableCell className="text-right font-black tabular-nums text-emerald-500 bg-emerald-500/5">
                      {UI_TEXT.INVENTORY.TABLE.PLUS_SIGN}
                      {formatInventoryQuantity(item.totalStockIn)}
                    </TableCell>
                    <TableCell className="text-right font-black tabular-nums text-destructive bg-destructive/5">
                      {UI_TEXT.INVENTORY.TABLE.MINUS_SIGN}
                      {formatInventoryQuantity(item.totalOutbound)}
                    </TableCell>
                    <TableCell className="text-right font-black tabular-nums text-foreground/90 bg-muted/5">
                      {formatInventoryQuantity(item.closingStock)}
                    </TableCell>
                    <TableCell className="text-right text-[11px] font-medium text-muted-foreground/50 tabular-nums">
                      {formatCurrency(item.averageUnitCost)}
                    </TableCell>
                    <TableCell className="text-right font-black tabular-nums text-primary pr-6">
                      {formatCurrency(item.closingStockValue)}
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Link
                          href={`/manager/inventory/ledger?ingredientId=${item.ingredientId}&name=${item.ingredientName}`}
                        >
                          <LucideListTree className="h-4.5 w-4.5" />
                        </Link>
                      </Button>
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
