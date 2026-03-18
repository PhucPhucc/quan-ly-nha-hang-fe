"use client";

import { LucideArrowLeft, LucideTags } from "lucide-react";
import Link from "next/link";
import React from "react";

import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { Badge } from "@/components/ui/badge";
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
import { UI_TEXT } from "@/lib/UI_Text";
import { InventoryLedgerItem, InventoryTransactionType } from "@/types/Inventory";

import { useInventoryLedger } from "./useInventoryLedger";

export function InventoryLedgerTable() {
  const { ledger, dateRange, setDateRange, transactionType, setTransactionType, ingredientName } =
    useInventoryLedger();

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="h-9 w-9 p-0 rounded-full">
            <Link href="/manager/inventory/reports">
              <LucideArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              {UI_TEXT.INVENTORY.REPORT.LEDGER_TITLE}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
              <span className="font-semibold text-primary/80">{ingredientName}</span>
              <span>{UI_TEXT.INVENTORY.REPORT.VALUE_SEPARATOR}</span>
              <span>{UI_TEXT.INVENTORY.REPORT.LEDGER_DESC}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-6 p-5 rounded-2xl bg-card border border-border shadow-soft">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">
            {UI_TEXT.INVENTORY.TOOLBAR.FILTER_STATUS}
          </span>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-1">
            {UI_TEXT.INVENTORY.TABLE.COL_TYPE}
          </span>
          <Select
            value={transactionType?.toString()}
            onValueChange={(val) => setTransactionType(val === "all" ? undefined : Number(val))}
          >
            <SelectTrigger className="w-56 h-10 rounded-xl bg-muted/30 border-none font-medium text-sm">
              <SelectValue placeholder={UI_TEXT.INVENTORY.TOOLBAR.STATUS_ALL} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border">
              <SelectItem value="all">{UI_TEXT.INVENTORY.TOOLBAR.STATUS_ALL}</SelectItem>
              <SelectItem value={InventoryTransactionType.StockIn.toString()}>
                {UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_IN}
              </SelectItem>
              <SelectItem value={InventoryTransactionType.SaleDeduction.toString()}>
                {UI_TEXT.INVENTORY.REPORT.COL_SALE}
              </SelectItem>
              <SelectItem value={InventoryTransactionType.InventoryCheck.toString()}>
                {UI_TEXT.INVENTORY.CHECK.TITLE}
              </SelectItem>
              <SelectItem value={InventoryTransactionType.OpeningStock.toString()}>
                {UI_TEXT.INVENTORY.TABLE.TRANS_TYPE_OPENING}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/70">
              <TableHead className="w-[180px] font-semibold uppercase text-[10px] tracking-wider text-muted-foreground pl-6">
                {UI_TEXT.INVENTORY.REPORT.LEDGER_COL_TIME}
              </TableHead>
              <TableHead className="text-center font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.TABLE.COL_TYPE}
              </TableHead>
              <TableHead className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.TABLE.COL_REFERENCE}
              </TableHead>
              <TableHead className="text-right font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.REPORT.LEDGER_COL_DELTA}
              </TableHead>
              <TableHead className="text-right font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.TABLE.COL_BALANCE}
              </TableHead>
              <TableHead className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground pr-6">
                {UI_TEXT.INVENTORY.REPORT.LEDGER_COL_NOTE}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ledger.map((item: InventoryLedgerItem, index) => (
              <TableRow
                key={`${item.referenceNo}-${index}`}
                className="hover:bg-primary/5 border-b border-border/30 group"
              >
                <TableCell className="text-xs text-muted-foreground pl-6 font-mono">
                  {new Date(item.occurredAt).toLocaleString("vi-VN")}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className="text-[9px] uppercase font-bold tracking-tighter px-3 py-0 scale-90"
                  >
                    {formatType(item.transactionType)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-primary">
                    <LucideTags className="h-3 w-3" />
                    {item.referenceNo}
                  </div>
                </TableCell>
                <TableCell
                  className={`text-right font-black ${item.quantityDelta > 0 ? "text-success" : "text-destructive"}`}
                >
                  {item.quantityDelta > 0 ? `+${item.quantityDelta}` : item.quantityDelta}
                </TableCell>
                <TableCell className="text-right font-black text-foreground">
                  {item.balanceAfter}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground italic pr-6 max-w-[200px] truncate">
                  {item.note || UI_TEXT.COMMON.DASH}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
