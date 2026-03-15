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
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { formatCurrency } from "@/lib/utils";
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
        <Button variant="ghost" className="gap-2 rounded-2xl hover:bg-slate-100" onClick={onBack}>
          <ArrowLeft className="size-4" />
          {UI_TEXT.COMMON.BACK}
        </Button>
        <div className="flex items-center gap-2">
          {onPrint && (
            <Button
              variant="outline"
              onClick={onPrint}
              className="gap-2 rounded-2xl border-slate-200"
            >
              <Printer className="size-4" />
              {UI_TEXT.BUTTON.DETAIL}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              onClick={onDelete}
              className="gap-2 rounded-2xl bg-destructive hover:bg-destructive/90 text-white"
            >
              <Trash2 className="size-4" />
              {UI_TEXT.BUTTON.DELETE}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-3xl border-slate-100 shadow-sm shadow-slate-100/60 p-0 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
              <CardTitle className="text-base font-semibold text-slate-700">
                {UI_TEXT.INVENTORY.STOCK_IN_VOUCHER}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/30">
                  <TableRow className="border-slate-100">
                    <TableHead className="w-[120px] text-center font-semibold text-[11px] uppercase tracking-wider text-slate-500">
                      {UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}
                    </TableHead>
                    <TableHead className="font-semibold text-[11px] uppercase tracking-wider text-slate-500">
                      {UI_TEXT.INVENTORY.TABLE.COL_ITEM}
                    </TableHead>
                    <TableHead className="w-[120px] text-center font-semibold text-[11px] uppercase tracking-wider text-slate-500">
                      {UI_TEXT.INVENTORY.OPENING_STOCK.COL_INITIAL}
                    </TableHead>
                    <TableHead className="w-[150px] text-right font-semibold text-[11px] uppercase tracking-wider text-slate-500">
                      {UI_TEXT.INVENTORY.OPENING_STOCK.COL_COST}
                    </TableHead>
                    <TableHead className="w-[150px] text-right font-semibold text-[11px] uppercase tracking-wider text-slate-500">
                      {UI_TEXT.INVENTORY.OPENING_STOCK.COL_TOTAL}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipt.items.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-slate-50 hover:bg-slate-50/30 transition-colors"
                    >
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono text-[10px] bg-slate-50/50">
                          {item.ingredientCode || UI_TEXT.COMMON.DASH}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-700">{item.ingredientName}</div>
                      </TableCell>
                      <TableCell className="text-center text-slate-600">
                        {item.quantity}{" "}
                        <span className="text-[10px] text-slate-400">{item.unit}</span>
                      </TableCell>
                      <TableCell className="text-right text-slate-600">
                        {formatCurrency(item.unitPrice || 0)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">
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
          <Card className="rounded-3xl border-slate-100 shadow-sm shadow-slate-100/60 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
              <CardTitle className="text-base font-semibold text-slate-700">
                {UI_TEXT.INVENTORY.SETTINGS.GENERAL_INFO}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}</span>
                  <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs">
                    {receipt.receiptCode}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{UI_TEXT.INVENTORY.TABLE.COL_DATE}</span>
                  <span className="text-slate-700 font-medium">
                    {new Date(receipt.receivedDate).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{UI_TEXT.INVENTORY.TABLE.COL_RECEIVER}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary uppercase">
                      {(receipt.createdBy || "-").charAt(0)}
                    </div>
                    <span className="text-slate-700 font-medium">{receipt.createdBy}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="bg-primary/5 rounded-2xl p-4 text-center">
                  <p className="text-xs text-primary/60 font-medium uppercase tracking-wider mb-1">
                    {UI_TEXT.INVENTORY.OPENING_STOCK.TOTAL_VALUE}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(receipt.totalAmount)}
                  </p>
                </div>
              </div>

              {receipt.note && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">
                    {UI_TEXT.INVENTORY.FORM.DESCRIPTION}
                  </p>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-sm text-slate-600 leading-relaxed italic">
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
