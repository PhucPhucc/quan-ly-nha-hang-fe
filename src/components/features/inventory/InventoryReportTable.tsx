"use client";

import { LucideFilter, LucideListTree } from "lucide-react";
import Link from "next/link";
import React from "react";

import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { InventoryReportItem } from "@/types/Inventory";

import { useInventoryReport } from "./useInventoryReport";

export function InventoryReportTable() {
  const { report, dateRange, setDateRange } = useInventoryReport();

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border-none shadow-soft bg-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <LucideFilter className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {UI_TEXT.INVENTORY.TOOLBAR.FILTER_STATUS}
            </span>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {UI_TEXT.INVENTORY.REPORT.TOTAL_VALUE_LABEL}
            </span>
            <span className="text-xl font-black text-primary">
              {report.reduce((acc, i) => acc + i.closingStockValue, 0).toLocaleString()}{" "}
              {UI_TEXT.INVENTORY.TABLE.CURRENCY}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border-none bg-card shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[80px] font-semibold uppercase text-[10px] tracking-wider text-muted-foreground pl-6">
                {UI_TEXT.INVENTORY.TABLE.COL_SKU}
              </TableHead>
              <TableHead className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.TABLE.COL_NAME}
              </TableHead>
              <TableHead className="text-right font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.REPORT.COL_OPENING}
              </TableHead>
              <TableHead className="text-right font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.REPORT.COL_IN}
              </TableHead>
              <TableHead className="text-right font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.REPORT.COL_OUT}
              </TableHead>
              <TableHead className="text-right font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.REPORT.COL_SALE}
              </TableHead>
              <TableHead className="text-right font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.REPORT.COL_CLOSING}
              </TableHead>
              <TableHead className="text-right font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.REPORT.COL_AVG_COST}
              </TableHead>
              <TableHead className="text-right font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.REPORT.COL_VALUE}
              </TableHead>
              <TableHead className="text-right pr-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.map((item: InventoryReportItem) => (
              <TableRow
                key={item.ingredientId}
                className="hover:bg-primary/5 transition-colors border-b border-border/50 group"
              >
                <TableCell className="font-mono text-xs font-bold pl-6 text-muted-foreground">
                  {item.ingredientCode}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.ingredientName}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase">{item.unit}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{item.openingStock}</TableCell>
                <TableCell className="text-right font-bold text-success">
                  {UI_TEXT.INVENTORY.TABLE.PLUS_SIGN}
                  {item.totalStockIn}
                </TableCell>
                <TableCell className="text-right font-bold text-destructive">
                  {UI_TEXT.INVENTORY.TABLE.MINUS_SIGN}
                  {item.totalStockOut}
                </TableCell>
                <TableCell className="text-right font-bold text-orange-500">
                  {UI_TEXT.INVENTORY.TABLE.MINUS_SIGN}
                  {item.totalSaleDeduction}
                </TableCell>
                <TableCell className="text-right font-black text-foreground">
                  {item.closingStock}
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {item.averageUnitCost.toLocaleString()} {UI_TEXT.INVENTORY.TABLE.CURRENCY}
                </TableCell>
                <TableCell className="text-right font-black text-primary">
                  {item.closingStockValue.toLocaleString()} {UI_TEXT.INVENTORY.TABLE.CURRENCY}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0 rounded-full hover:bg-primary hover:text-white transition-all transform hover:rotate-12"
                  >
                    <Link
                      href={`/manager/inventory/reports/ledger?ingredientId=${item.ingredientId}&name=${item.ingredientName}`}
                    >
                      <LucideListTree className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
