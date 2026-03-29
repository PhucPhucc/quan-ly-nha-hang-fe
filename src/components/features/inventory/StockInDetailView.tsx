"use client";

import { ArrowLeft, Printer, Trash2 } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableShell,
} from "@/components/ui/table";
import { formatInventoryQuantity } from "@/lib/inventory-number";
import { UI_TEXT } from "@/lib/UI_Text";
import { formatCurrency } from "@/lib/utils";
import { StockInReceipt } from "@/types/StockIn";

import {
  INVENTORY_AVATAR_CLASS,
  INVENTORY_DETAIL_CARD_CLASS,
  INVENTORY_DETAIL_CARD_HEADER_CLASS,
  INVENTORY_NOTE_BLOCK_CLASS,
  INVENTORY_TROW_CLASS,
} from "./components/inventoryStyles";

interface StockInDetailViewProps {
  receipt: StockInReceipt;
  onBack: () => void;
  onPrint?: () => void;
  onDelete?: () => void;
}

export const StockInDetailView = ({
  receipt,
  onBack,
  onPrint,
  onDelete,
}: StockInDetailViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="gap-2 rounded-md bg-foreground/10 hover:bg-foreground/20 border-border"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
          {UI_TEXT.COMMON.BACK}
        </Button>
        <div className="flex items-center gap-3">
          {onPrint && (
            <Button variant="outline" onClick={onPrint} className="gap-2 rounded-lg border-border">
              <Printer className="size-4" />
              {UI_TEXT.BUTTON.DETAIL}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              onClick={onDelete}
              className="gap-2 rounded-lg shadow-lg shadow-destructive/10"
            >
              <Trash2 className="size-4" />
              {UI_TEXT.BUTTON.DELETE}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="bg-background border-none shadow-none gap-0">
            <CardHeader className="bg-background px-0 py-1">
              <CardTitle className="text-xl font-bold text-foreground/80">
                {UI_TEXT.INVENTORY.STOCK_IN_VOUCHER}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TableShell>
                <Table>
                  <TableHeader>
                    <TableRow variant="header">
                      <TableHead>{UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}</TableHead>
                      <TableHead>{UI_TEXT.INVENTORY.TABLE.COL_ITEM}</TableHead>
                      <TableHead className="text-right">
                        {UI_TEXT.INVENTORY.OPENING_STOCK.COL_INITIAL}
                      </TableHead>
                      <TableHead className="text-right">
                        {UI_TEXT.INVENTORY.OPENING_STOCK.COL_COST}
                      </TableHead>
                      <TableHead className="text-right">
                        {UI_TEXT.INVENTORY.OPENING_STOCK.COL_TOTAL}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receipt.items.map((item) => (
                      <TableRow key={item.id} className={INVENTORY_TROW_CLASS}>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-[10px] bg-muted/30">
                            {item.ingredientCode || UI_TEXT.COMMON.DASH}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-foreground/80">{item.ingredientName}</div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatInventoryQuantity(item.quantity)}{" "}
                          <span className="text-[10px] text-muted-foreground uppercase font-bold">
                            {item.baseUnit}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground tabular-nums">
                          {formatCurrency(item.unitPrice || 0)}
                        </TableCell>
                        <TableCell className="text-right font-black text-primary tabular-nums pr-6">
                          {formatCurrency(item.totalAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableShell>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className={INVENTORY_DETAIL_CARD_CLASS}>
            <CardHeader className={INVENTORY_DETAIL_CARD_HEADER_CLASS}>
              <CardTitle className="text-base font-bold text-foreground/80">
                {UI_TEXT.INVENTORY.SETTINGS.GENERAL_INFO}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                    {UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}
                  </span>
                  <span className="font-mono font-bold text-foreground/90 bg-muted px-2 py-1 rounded-lg text-xs">
                    {receipt.receiptCode}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                    {UI_TEXT.INVENTORY.TABLE.COL_DATE}
                  </span>
                  <span className="text-foreground/80 font-bold">
                    {new Date(receipt.receivedDate).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                    {UI_TEXT.INVENTORY.TABLE.COL_RECEIVER}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className={INVENTORY_AVATAR_CLASS}>
                      {(receipt.createdBy || UI_TEXT.COMMON.DASH).charAt(0)}
                    </div>
                    <span className="text-foreground/80 font-bold">{receipt.createdBy}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-dashed">
                <div className="bg-primary/5 rounded-3xl p-5 text-center border border-primary/10">
                  <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest mb-1.5">
                    {UI_TEXT.INVENTORY.OPENING_STOCK.TOTAL_VALUE}
                  </p>
                  <p className="text-3xl font-black text-primary tracking-tighter tabular-nums">
                    {formatCurrency(receipt.totalAmount)}
                  </p>
                </div>
              </div>

              {receipt.note && (
                <div className="pt-4 border-t border-dashed">
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2.5">
                    {UI_TEXT.INVENTORY.FORM.DESCRIPTION}
                  </p>
                  <div className={INVENTORY_NOTE_BLOCK_CLASS}>
                    <p className="text-sm text-foreground/70 leading-relaxed italic">
                      {UI_TEXT.COMMON.QUOTE}
                      {receipt.note}
                      {UI_TEXT.COMMON.QUOTE}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
