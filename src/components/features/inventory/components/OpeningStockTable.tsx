"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { Ingredient } from "@/types/Inventory";

interface Props {
  ingredients: Ingredient[];
  entryItems: Record<string, { quantity: number; costPrice: number }>;
  onInputChange: (id: string, field: "costPrice" | "quantity", value: string) => void;
  pageSize?: number;
  disabled?: boolean;
}

export function OpeningStockTable({
  ingredients,
  entryItems,
  onInputChange,
  pageSize = 10,
  disabled = false,
}: Props) {
  const missingRows = Math.max(0, pageSize - ingredients.length);

  return (
    <Table containerClassName="max-h-[460px] overflow-auto bg-white">
      <TableHeader className="sticky top-0 z-20 bg-slate-50 shadow-sm border-b border-slate-200">
        <TableRow className="border-slate-200 bg-slate-50 hover:bg-slate-50">
          <TableHead className="w-[120px] py-3 text-center font-semibold uppercase text-[11px] tracking-wider text-slate-800 bg-slate-50">
            {UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}
          </TableHead>
          <TableHead className="py-3 text-left font-semibold uppercase text-[11px] tracking-wider text-slate-800 bg-slate-50">
            {UI_TEXT.INVENTORY.OPENING_STOCK.COL_NAME}
          </TableHead>
          <TableHead className="w-[100px] py-3 text-center font-semibold uppercase text-[11px] tracking-wider text-slate-800 bg-slate-50">
            {UI_TEXT.INVENTORY.OPENING_STOCK.COL_UNIT}
          </TableHead>
          <TableHead className="w-[140px] py-3 text-right font-semibold uppercase text-[11px] tracking-wider text-slate-800 bg-slate-50">
            {UI_TEXT.INVENTORY.OPENING_STOCK.COL_QTY}
          </TableHead>
          <TableHead className="w-[160px] py-3 text-right font-semibold uppercase text-[11px] tracking-wider text-slate-800 bg-slate-50">
            {UI_TEXT.INVENTORY.OPENING_STOCK.COL_COST}
          </TableHead>
          <TableHead className="w-[180px] py-3 text-right font-semibold uppercase text-[11px] tracking-wider text-slate-800 bg-slate-50">
            {UI_TEXT.INVENTORY.OPENING_STOCK.COL_TOTAL}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ingredients.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
              {UI_TEXT.INVENTORY.OPENING_STOCK.EMPTY_SEARCH}
            </TableCell>
          </TableRow>
        ) : (
          <>
            {ingredients.map((item) => {
              const entry = entryItems[item.ingredientId] || { quantity: 0, costPrice: 0 };
              const rowTotal = entry.quantity * entry.costPrice;

              return (
                <TableRow key={item.ingredientId} className="h-[52px] hover:bg-slate-50/80">
                  <TableCell className="text-center font-mono text-sm text-slate-500">
                    {item.code}
                  </TableCell>
                  <TableCell
                    className="font-medium text-slate-900 truncate max-w-[200px]"
                    title={item.name}
                  >
                    {item.name}
                  </TableCell>
                  <TableCell className="text-center text-slate-600 font-medium">
                    {item.baseUnit || item.unit}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={entry.quantity || ""}
                      min={0}
                      step={0.01}
                      disabled={disabled}
                      placeholder="0"
                      className="h-8 text-right font-semibold rounded-lg border-slate-100 focus:ring-primary/20"
                      onChange={(e) => onInputChange(item.ingredientId, "quantity", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="relative">
                      <Input
                        type="number"
                        value={entry.costPrice || ""}
                        min={0}
                        disabled={disabled}
                        placeholder="0"
                        className="h-8 text-right pr-6 font-semibold rounded-lg border-slate-100 focus:ring-primary/20"
                        onChange={(e) =>
                          onInputChange(item.ingredientId, "costPrice", e.target.value)
                        }
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                        {UI_TEXT.COMMON.CURRENCY}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary/90">
                    {rowTotal.toLocaleString("vi-VN")}
                    {UI_TEXT.COMMON.CURRENCY}
                  </TableCell>
                </TableRow>
              );
            })}
            {missingRows > 0 &&
              Array.from({ length: missingRows }).map((_, index) => (
                <TableRow key={`placeholder-${index}`} className="h-[52px]">
                  <TableCell colSpan={6} className="p-0" />
                </TableRow>
              ))}
          </>
        )}
      </TableBody>
    </Table>
  );
}
