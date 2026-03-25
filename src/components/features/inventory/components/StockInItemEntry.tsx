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
import { formatInventoryQuantity, normalizeInventoryQuantity } from "@/lib/inventory-number";
import { UI_TEXT } from "@/lib/UI_Text";
import { Ingredient } from "@/types/Inventory";

import { ReceiptItemEntry } from "../useCreateStockIn";

interface StockInItemEntryProps {
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

export function StockInItemEntry({
  index,
  item,
  ingredients,
  updateItem,
  removeItem,
}: StockInItemEntryProps) {
  const selectedIng = ingredients.find((i) => i.ingredientId === item.ingredientId);

  return (
    <div className="group relative p-4 rounded-lg border bg-card transition-all hover:shadow-md hover:border-primary/20 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <Label className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 block">
            {UI_TEXT.INVENTORY.TABLE.COL_ITEM}
          </Label>
          <Select
            value={item.ingredientId}
            onValueChange={(val) => updateItem(index, "ingredientId", val)}
          >
            <SelectTrigger className="h-9 rounded-lg">
              <SelectValue placeholder={UI_TEXT.INVENTORY.OPENING_STOCK.SEARCH_PLACEHOLDER} />
            </SelectTrigger>
            <SelectContent>
              {ingredients.map((ing) => (
                <SelectItem key={ing.ingredientId} value={ing.ingredientId}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{ing.name}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase tracking-wider">
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
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg shrink-0 mt-6"
          onClick={() => removeItem(index)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase text-muted-foreground block">
            {UI_TEXT.INVENTORY.OPENING_STOCK.COL_INITIAL}
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
            <span className="text-xs font-semibold text-muted-foreground shrink-0 w-8">
              {selectedIng?.unit || UI_TEXT.COMMON.DASH}
            </span>
          </div>
        </div>
        <div className="space-y-1.5 text-right">
          <Label className="text-[10px] font-bold uppercase text-muted-foreground block text-right">
            {UI_TEXT.INVENTORY.OPENING_STOCK.COL_COST}
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            className="h-9 rounded-lg text-right"
            value={item.unitPrice}
            onChange={(e) =>
              updateItem(
                index,
                "unitPrice",
                normalizeInventoryQuantity(parseFloat(e.target.value) || 0, 2)
              )
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase text-muted-foreground block text-left">
            {UI_TEXT.INVENTORY.TABLE.COL_EXPIRATION}
          </Label>
          <Input
            type="date"
            className="h-9 rounded-lg"
            value={item.expirationDate || ""}
            onChange={(e) => updateItem(index, "expirationDate", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase text-muted-foreground block text-left">
            {UI_TEXT.INVENTORY.FORM.BATCH_CODE_LABEL}
          </Label>
          <Input
            type="text"
            className="h-9 rounded-lg"
            placeholder={UI_TEXT.INVENTORY.FORM.BATCH_CODE_PLACEHOLDER}
            value={item.batchCode || ""}
            onChange={(e) => updateItem(index, "batchCode", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-dashed">
        <span className="text-xs font-medium text-muted-foreground">
          {UI_TEXT.INVENTORY.OPENING_STOCK.COL_TOTAL}
        </span>
        <span className="text-sm font-bold text-primary">
          {formatInventoryQuantity(item.quantity * item.unitPrice, 2)}
          <span className="text-[10px] ml-1">{UI_TEXT.COMMON.CURRENCY}</span>
        </span>
      </div>
    </div>
  );
}
