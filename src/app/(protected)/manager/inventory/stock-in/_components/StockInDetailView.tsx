"use client";

import { ArrowLeft, Printer, Trash2 } from "lucide-react";
import React from "react";

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
import { StockInReceipt } from "@/types/StockIn";

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
        <Button variant="ghost" className="gap-2" onClick={onBack}>
          <ArrowLeft className="size-4" />
          {UI_TEXT.COMMON.BACK}
        </Button>
        <div className="flex items-center gap-2">
          {onPrint && (
            <Button variant="outline" onClick={onPrint} className="gap-2">
              <Printer className="size-4" />
              {UI_TEXT.BUTTON.DETAIL}
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" onClick={onDelete} className="gap-2">
              <Trash2 className="size-4" />
              {UI_TEXT.BUTTON.DELETE}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">{UI_TEXT.BUTTON.DETAIL}</h2>
            <div className="fh-table-shell overflow-hidden rounded-lg border">
              <Table className="fh-table">
                <TableHeader className="bg-muted/50">
                  <TableRow className="fh-table-row">
                    <TableHead className="fh-table-head">
                      {UI_TEXT.INVENTORY.TABLE.COL_ITEM}
                    </TableHead>
                    <TableHead className="fh-table-head text-center">
                      {UI_TEXT.INVENTORY.OPENING_STOCK.COL_INITIAL}
                    </TableHead>
                    <TableHead className="fh-table-head text-right">
                      {UI_TEXT.INVENTORY.OPENING_STOCK.COL_COST}
                    </TableHead>
                    <TableHead className="fh-table-head text-right">
                      {UI_TEXT.INVENTORY.OPENING_STOCK.COL_TOTAL}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipt.items.map((item, index) => (
                    <TableRow key={index} className="fh-table-row">
                      <TableCell className="fh-table-cell">
                        <div className="font-medium text-foreground">{item.ingredientName}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.batchCode || UI_TEXT.COMMON.EMPTY}
                        </div>
                      </TableCell>
                      <TableCell className="fh-table-cell text-center">
                        {item.quantity}
                        {UI_TEXT.COMMON.SPACE}
                        {item.unit}
                      </TableCell>
                      <TableCell className="fh-table-cell text-right">
                        {item.unitPrice?.toLocaleString("vi-VN")}
                        {UI_TEXT.COMMON.CURRENCY}
                      </TableCell>
                      <TableCell className="fh-table-cell text-right font-bold text-primary">
                        {item.totalAmount.toLocaleString("vi-VN")}
                        {UI_TEXT.COMMON.CURRENCY}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              {UI_TEXT.INVENTORY.HISTORY_TITLE}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}
                  {UI_TEXT.COMMON.COLON}
                </span>
                <span className="font-mono font-bold">{receipt.receiptCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {UI_TEXT.INVENTORY.TABLE.COL_DATE}
                  {UI_TEXT.COMMON.COLON}
                </span>
                <span>{new Date(receipt.receivedDate).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {UI_TEXT.INVENTORY.TABLE.COL_RECEIVER}
                  {UI_TEXT.COMMON.COLON}
                </span>
                <span className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">
                    {receipt.createdBy.charAt(0).toUpperCase()}
                  </div>
                  {receipt.createdBy}
                </span>
              </div>

              <div className="flex justify-end pt-4 mb-4 border-t">
                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {UI_TEXT.INVENTORY.OPENING_STOCK.TOTAL_VALUE}
                    {UI_TEXT.COMMON.COLON}
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {receipt.totalAmount.toLocaleString("vi-VN")}
                    {UI_TEXT.COMMON.CURRENCY}
                  </p>
                </div>
              </div>

              {receipt.note && (
                <div className="p-4 bg-muted/30 rounded-lg border border-dashed">
                  <p className="text-sm font-medium mb-1">{UI_TEXT.INVENTORY.FORM.DESCRIPTION}</p>
                  <p className="text-sm text-muted-foreground">{receipt.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
