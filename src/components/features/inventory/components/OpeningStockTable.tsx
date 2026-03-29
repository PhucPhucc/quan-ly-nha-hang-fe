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
  TableShell,
} from "@/components/ui/table";
import { formatInventoryQuantity } from "@/lib/inventory-number";
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
  disabled = false,
}: Props) {
  return (
    <TableShell>
      <Table>
        <TableHeader>
          <TableRow variant="header">
            <TableHead>{UI_TEXT.INVENTORY.OPENING_STOCK.COL_CODE}</TableHead>
            <TableHead>{UI_TEXT.INVENTORY.OPENING_STOCK.COL_NAME}</TableHead>
            <TableHead className="w-25">
              {UI_TEXT.INVENTORY.OPENING_STOCK.COL_QTY?.toUpperCase()}
            </TableHead>
            <TableHead className="w-18">{UI_TEXT.INVENTORY.OPENING_STOCK.COL_UNIT}</TableHead>
            <TableHead className="text-right w-24">
              {UI_TEXT.INVENTORY.OPENING_STOCK.COL_COST}
            </TableHead>
            <TableHead className="text-right">
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
                  <TableRow key={item.ingredientId}>
                    <TableCell className="font-mono text-sm text-card-foreground">
                      {item.code}
                    </TableCell>
                    <TableCell
                      className="font-medium text-foreground truncate max-w-50"
                      title={item.name}
                    >
                      {item.name}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={entry.quantity || ""}
                        min={0}
                        step={0.001}
                        disabled={disabled}
                        placeholder="0"
                        className=" font-semibold rounded-md focus:ring-primary/20"
                        onChange={(e) =>
                          onInputChange(item.ingredientId, "quantity", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-card-foreground">
                      {item.baseUnit || item.unit}
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
                          className="text-center px-1 w-18 font-semibold rounded-md border focus:ring-primary/20"
                          onChange={(e) =>
                            onInputChange(item.ingredientId, "costPrice", e.target.value)
                          }
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-card-foreground/80">
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
            </>
          )}
        </TableBody>
      </Table>
    </TableShell>
  );
}
