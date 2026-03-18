"use client";

import { ArrowLeft, Trash2 } from "lucide-react";
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
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { formatCurrency } from "@/lib/utils";
import { StockOutReceipt } from "@/types/StockOut";

import {
  INVENTORY_AVATAR_CLASS,
  INVENTORY_DETAIL_CARD_CLASS,
  INVENTORY_DETAIL_CARD_HEADER_CLASS,
  INVENTORY_NOTE_BLOCK_CLASS,
  INVENTORY_TH_CLASS,
  INVENTORY_THEAD_ROW_CLASS,
  INVENTORY_TROW_CLASS,
} from "./components/inventoryStyles";

interface StockOutDetailViewProps {
  receipt: StockOutReceipt;
  onBack: () => void;
  onDelete?: () => void;
}

export const StockOutDetailView = ({ receipt, onBack, onDelete }: StockOutDetailViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2 rounded-xl hover:bg-muted" onClick={onBack}>
          <ArrowLeft className="size-4" />
          {UI_TEXT.COMMON.BACK}
        </Button>
        {onDelete && (
          <Button
            variant="destructive"
            onClick={onDelete}
            className="gap-2 rounded-xl shadow-lg shadow-destructive/10"
          >
            <Trash2 className="size-4" />
            {UI_TEXT.BUTTON.DELETE}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className={INVENTORY_DETAIL_CARD_CLASS}>
            <CardHeader className={INVENTORY_DETAIL_CARD_HEADER_CLASS}>
              <CardTitle className="text-base font-bold text-foreground/80">
                {UI_TEXT.INVENTORY.STOCK_OUT_VOUCHER}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className={INVENTORY_THEAD_ROW_CLASS}>
                    <TableHead className={`${INVENTORY_TH_CLASS} w-[120px] text-center`}>
                      {UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}
                    </TableHead>
                    <TableHead className={INVENTORY_TH_CLASS}>
                      {UI_TEXT.INVENTORY.TABLE.COL_ITEM}
                    </TableHead>
                    <TableHead className={`${INVENTORY_TH_CLASS} w-[120px] text-center`}>
                      {UI_TEXT.INVENTORY.STOCK_OUT.QTY_LABEL}
                    </TableHead>
                    <TableHead className={`${INVENTORY_TH_CLASS} w-[150px] text-right`}>
                      {UI_TEXT.INVENTORY.OPENING_STOCK.COL_COST}
                    </TableHead>
                    <TableHead className={`${INVENTORY_TH_CLASS} w-[150px] text-right pr-6`}>
                      {UI_TEXT.INVENTORY.OPENING_STOCK.COL_TOTAL}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipt.items.map((item) => (
                    <TableRow key={item.id} className={INVENTORY_TROW_CLASS}>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono text-[10px] bg-muted/30">
                          {item.ingredientCode || UI_TEXT.COMMON.DASH}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-foreground/80">{item.ingredientName}</div>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {item.quantity}{" "}
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">
                          {item.unit}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground tabular-nums">
                        {formatCurrency(item.unitPrice || 0)}
                      </TableCell>
                      <TableCell className="text-right font-black text-destructive tabular-nums pr-6">
                        {formatCurrency(item.totalAmount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                    {UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}
                  </span>
                  <span className="font-mono font-black text-foreground/90 bg-muted px-2 py-1 rounded-lg">
                    {receipt.receiptCode}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                    {UI_TEXT.INVENTORY.TABLE.COL_DATE}
                  </span>
                  <span className="text-foreground/80 font-bold">
                    {new Date(receipt.stockOutDate).toLocaleDateString(UI_TEXT.COMMON.LOCALE_VI, {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {receipt.reason && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                      {UI_TEXT.INVENTORY.STOCK_OUT.REASON_LABEL}
                    </span>
                    <span className="text-destructive font-black bg-destructive/5 px-2 py-0.5 rounded-lg border border-destructive/10">
                      {receipt.reason}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                    {UI_TEXT.INVENTORY.TABLE.COL_RECEIVER}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className={INVENTORY_AVATAR_CLASS}>
                      {(receipt.createdBy || "-").charAt(0)}
                    </div>
                    <span className="text-foreground/80 font-bold">{receipt.createdBy}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-dashed">
                <div className="bg-destructive/5 rounded-3xl p-5 text-center border border-destructive/10">
                  <p className="text-[10px] text-destructive/60 font-black uppercase tracking-widest mb-1.5">
                    {UI_TEXT.INVENTORY.OPENING_STOCK.TOTAL_VALUE}
                  </p>
                  <p className="text-3xl font-black text-destructive tracking-tighter tabular-nums">
                    {formatCurrency(receipt.totalAmount)}
                  </p>
                </div>
              </div>

              {receipt.note && (
                <div className="pt-6 border-t border-dashed">
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
