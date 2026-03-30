"use client";

import { useQuery } from "@tanstack/react-query";
import { History, List, Wallet } from "lucide-react";
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
  TableShell,
} from "@/components/ui/table";
import { useBrandingFormatter } from "@/lib/branding-formatting";
import { formatInventoryQuantity } from "@/lib/inventory-number";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { InventoryReportItem } from "@/types/Inventory";

import { INVENTORY_LOADING_CLASS } from "./components/inventoryStyles";
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

  const { formatCurrency } = useBrandingFormatter();

  const { data: ingredientsData } = useQuery({
    queryKey: ["inventory-report-ingredients"],
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
          <SelectTrigger className="w-full rounded-lg border bg-muted/30 font-bold sm:w-40">
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

      <div>
        <div className="flex items-center gap-1 mb-1">
          <span className="font-semibold text-sm uppercase text-primary">
            {UI_TEXT.INVENTORY.REPORT.TOTAL_VALUE_LABEL}
            {UI_TEXT.COMMON.COLON}
          </span>
          <span className=" font-semibold text-primary tabular-nums">
            {formatCurrency(totalInventoryValue)}
          </span>
        </div>
        <TableShell>
          <Table>
            <TableHeader>
              <TableRow variant="header">
                <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_SKU}</TableHead>
                <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_NAME}</TableHead>
                <TableHead className="text-right">{UI_TEXT.INVENTORY.REPORT.COL_OPENING}</TableHead>
                <TableHead className={`text-right`}>{UI_TEXT.INVENTORY.REPORT.COL_IN}</TableHead>
                <TableHead className={`text-right`}>{UI_TEXT.INVENTORY.REPORT.COL_OUT}</TableHead>
                <TableHead className={`text-right`}>
                  {UI_TEXT.INVENTORY.REPORT.COL_CLOSING}
                </TableHead>
                <TableHead className={`text-right`}>
                  {UI_TEXT.INVENTORY.REPORT.COL_AVG_COST}
                </TableHead>
                <TableHead className={`text-right`}>{UI_TEXT.INVENTORY.REPORT.COL_VALUE}</TableHead>
                <TableHead className={`text-right`}>{UI_TEXT.COMMON.ACTION}</TableHead>
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
                  <TableRow key={item.ingredientId} className="text-card-foreground">
                    <TableCell className="font-mono text-xs font-bold uppercase">
                      {item.ingredientCode}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black text-foreground/80 tracking-tight">
                          {item.ingredientName}
                        </span>
                        <span className="text-xs uppercase font-bold text-card-foreground/80 tracking-wider">
                          {item.unit}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold tabular-nums text-muted-foreground/60">
                      {formatInventoryQuantity(item.openingStock)}
                    </TableCell>
                    <TableCell className="text-right font-black tabular-nums text-success">
                      {UI_TEXT.INVENTORY.TABLE.PLUS_SIGN}
                      {formatInventoryQuantity(item.totalStockIn)}
                    </TableCell>
                    <TableCell className="text-right font-black tabular-nums text-danger">
                      {UI_TEXT.INVENTORY.TABLE.MINUS_SIGN}
                      {formatInventoryQuantity(item.totalOutbound)}
                    </TableCell>
                    <TableCell className="text-right font-black tabular-nums text-foreground/90">
                      {formatInventoryQuantity(item.closingStock)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-card-foreground tabular-nums">
                      {formatCurrency(item.averageUnitCost)}
                    </TableCell>
                    <TableCell className="text-right font-black tabular-nums text-primary ">
                      {formatCurrency(item.closingStockValue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Link
                          href={`/manager/inventory/ledger?ingredientId=${item.ingredientId}&name=${item.ingredientName}`}
                        >
                          <List className="h-4.5 w-4.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableShell>
      </div>
    </div>
  );
}
