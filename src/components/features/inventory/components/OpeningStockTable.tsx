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
import { formatInventoryQuantity } from "@/lib/inventory-number";
import { UI_TEXT } from "@/lib/UI_Text";
import { Ingredient } from "@/types/Inventory";

import {
  INVENTORY_TABLE_CONTAINER_CLASS,
  INVENTORY_TH_CLASS,
  INVENTORY_THEAD_CLASS,
  INVENTORY_THEAD_ROW_CLASS,
  INVENTORY_TROW_CLASS,
} from "./inventoryStyles";

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
    <Table containerClassName={INVENTORY_TABLE_CONTAINER_CLASS}>
      <TableHeader className={INVENTORY_THEAD_CLASS}>
        <TableRow className={INVENTORY_THEAD_ROW_CLASS}>
          <TableHead className={`${INVENTORY_TH_CLASS} w-[120px] text-center`}>
            {UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}
          </TableHead>
          <TableHead className={`${INVENTORY_TH_CLASS} text-left pl-4`}>
            {UI_TEXT.INVENTORY.OPENING_STOCK.COL_NAME}
          </TableHead>
          <TableHead className={`${INVENTORY_TH_CLASS} w-[100px] text-center`}>
            {UI_TEXT.INVENTORY.OPENING_STOCK.COL_UNIT}
          </TableHead>
          <TableHead className={`${INVENTORY_TH_CLASS} w-[140px] text-right pr-4`}>
            {UI_TEXT.INVENTORY.OPENING_STOCK.COL_QTY?.toUpperCase()}
          </TableHead>
          <TableHead className={`${INVENTORY_TH_CLASS} w-[160px] text-right pr-4`}>
            {UI_TEXT.INVENTORY.OPENING_STOCK.COL_COST}
          </TableHead>
          <TableHead className={`${INVENTORY_TH_CLASS} w-[180px] text-right pr-4`}>
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
                <TableRow key={item.ingredientId} className={INVENTORY_TROW_CLASS}>
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
                      step={0.001}
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
                        step={0.01}
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
                    {formatInventoryQuantity(rowTotal, 2)}
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
