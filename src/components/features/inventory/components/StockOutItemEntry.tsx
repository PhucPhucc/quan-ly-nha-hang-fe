"use client";

import { Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBrandingFormatter } from "@/lib/branding-formatting";
import { formatInventoryQuantity, normalizeInventoryQuantity } from "@/lib/inventory-number";
import { UI_TEXT } from "@/lib/UI_Text";
import { Ingredient } from "@/types/Inventory";

import { ReceiptItemEntry } from "../useCreateStockOut";

interface StockOutItemEntryProps {
  index: number;
  item: ReceiptItemEntry;
  ingredients: Ingredient[];
  updateItem: <K extends keyof ReceiptItemEntry>(
    index: number,
    field: K,
    value: ReceiptItemEntry[K]
  ) => void;
  removeItem: (index: number) => void;
}

export function StockOutItemEntry({
  index,
  item,
  ingredients,
  updateItem,
  removeItem,
}: StockOutItemEntryProps) {
  const { formatCurrency } = useBrandingFormatter();
  const selectedIng = ingredients.find((i) => i.ingredientId === item.ingredientId);

  return (
    <div className="group relative space-y-3 rounded-lg border bg-card p-4 transition-all hover:border-destructive/20 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <Label className="mb-1.5 block text-[10px] font-bold uppercase text-muted-foreground">
            {UI_TEXT.INVENTORY.TABLE.COL_ITEM}
          </Label>
          <Select
            value={item.ingredientId}
            onValueChange={(val) => updateItem(index, "ingredientId", val)}
          >
            <SelectTrigger className="h-9 rounded-lg">
              <SelectValue placeholder={UI_TEXT.INVENTORY.OPENING_STOCK.SEARCH_PLACEHOLDER} />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              {ingredients.map((ing) => (
                <SelectItem key={ing.ingredientId} value={ing.ingredientId}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{ing.name}</span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {ing.code}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="mt-6 h-8 w-8 shrink-0 rounded-lg text-muted-foreground hover:bg-destructive/5 hover:text-destructive"
          onClick={() => removeItem(index)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="block text-[10px] font-bold uppercase text-muted-foreground">
            {UI_TEXT.INVENTORY.STOCK_OUT.QTY_LABEL}
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              step="0.001"
              className="h-9 rounded-lg"
              value={item.quantity}
              onChange={(e) =>
                updateItem(
                  index,
                  "quantity",
                  normalizeInventoryQuantity(parseFloat(e.target.value) || 0)
                )
              }
            />
            <span className="w-8 shrink-0 text-xs font-semibold text-muted-foreground">
              {selectedIng?.unit || UI_TEXT.COMMON.DASH}
            </span>
          </div>
          {selectedIng && (
            <div className="space-y-0.5 text-[11px] text-muted-foreground">
              <div>
                {UI_TEXT.INVENTORY.STOCK_OUT.CURRENT_STOCK_LABEL}{" "}
                <span className="font-semibold text-foreground/80">
                  {formatInventoryQuantity(selectedIng.currentStock)}
                </span>
              </div>
              {normalizeInventoryQuantity(item.quantity) >
                normalizeInventoryQuantity(selectedIng.currentStock) && (
                <div className="font-semibold text-destructive text-[11px]">
                  {UI_TEXT.INVENTORY.STOCK_OUT.EXCEED_STOCK_WARNING}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="space-y-1.5 text-right">
          <Label className="block text-right text-[10px] font-bold uppercase text-muted-foreground">
            {UI_TEXT.INVENTORY.STOCK_OUT.PRICE_LABEL}
          </Label>
          <Input
            type="number"
            min="0"
            className="h-9 rounded-lg text-right"
            value={item.unitPrice ?? ""}
            onChange={(e) =>
              updateItem(
                index,
                "unitPrice",
                e.target.value === ""
                  ? null
                  : normalizeInventoryQuantity(parseFloat(e.target.value) || 0, 2)
              )
            }
            placeholder={UI_TEXT.INVENTORY.STOCK_OUT.PRICE_OPTIONAL}
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-dashed pt-2">
        <span className="text-xs font-medium text-muted-foreground">
          {UI_TEXT.INVENTORY.STOCK_OUT.TOTAL_PRICE_LABEL}
        </span>
        <span className="text-sm font-bold text-destructive">
          {formatCurrency(item.quantity * (item.unitPrice ?? 0))}
        </span>
      </div>
    </div>
  );
}
