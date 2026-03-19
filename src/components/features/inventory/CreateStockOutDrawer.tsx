"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { stockOutService } from "@/services/stock-out.service";
import { Ingredient } from "@/types/Inventory";
import { CreateStockOutRequest, StockOutReason } from "@/types/StockOut";

import { INVENTORY_INPUT_CLASS } from "./components/inventoryStyles";
import { invalidateInventoryQueries } from "./inventoryQueryInvalidation";

interface CreateStockOutDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface ReceiptItemEntry {
  ingredientId: string;
  quantity: number;
  unitPrice?: number | null;
}

export const CreateStockOutDrawer = ({
  onSuccess,
  open,
  onOpenChange,
}: CreateStockOutDrawerProps) => {
  const queryClient = useQueryClient();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [items, setItems] = useState<ReceiptItemEntry[]>([]);
  const [reason, setReason] = useState<string>(UI_TEXT.INVENTORY.STOCK_OUT.REASON_PRESETS[0]);
  const [note, setNote] = useState("");
  const [stockOutDate, setStockOutDate] = useState(new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchIngredients = async () => {
      try {
        const response = await inventoryService.getIngredients(1, 100, undefined, {
          isActive: true,
        });
        if (response.isSuccess && response.data) {
          setIngredients(response.data.items.filter((item) => item.isActive));
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : UI_TEXT.API.NETWORK_ERROR);
      }
    };

    fetchIngredients();
    setReason(UI_TEXT.INVENTORY.STOCK_OUT.REASON_PRESETS[0]);
    setNote("");
    setStockOutDate(new Date().toISOString().split("T")[0]);
    setItems([{ ingredientId: "", quantity: 1, unitPrice: null }]);
  }, [open]);

  const addItem = () => {
    setItems([...items, { ingredientId: "", quantity: 1, unitPrice: null }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [{ ingredientId: "", quantity: 1, unitPrice: null }]);
  };

  const updateItem = <K extends keyof ReceiptItemEntry>(
    index: number,
    field: K,
    value: ReceiptItemEntry[K]
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "ingredientId") {
      const ing = ingredients.find((x) => x.ingredientId === value);
      if (ing && (newItems[index].unitPrice === null || newItems[index].unitPrice === undefined)) {
        newItems[index].unitPrice = ing.costPrice;
      }
    }

    setItems(newItems);
  };

  const calculateTotal = useMemo(() => {
    return () => items.reduce((sum, item) => sum + item.quantity * (item.unitPrice ?? 0), 0);
  }, [items]);

  const handleSubmit = async () => {
    const validItems = items.filter((i) => i.ingredientId !== "" && i.quantity > 0);
    if (validItems.length === 0) {
      toast.error(UI_TEXT.INVENTORY.STOCK_OUT.VALIDATION_MIN_ITEMS);
      return;
    }

    if (!reason) {
      toast.error(UI_TEXT.INVENTORY.STOCK_OUT.VALIDATION_REASON_REQ);
      return;
    }

    for (const item of validItems) {
      const ing = ingredients.find((x) => x.ingredientId === item.ingredientId);
      if (ing && item.quantity > ing.currentStock) {
        toast.error(
          `${UI_TEXT.INVENTORY.STOCK_OUT.STOCK_EXCEEDED_PREFIX} ${ing.name} ${UI_TEXT.INVENTORY.STOCK_OUT.STOCK_EXCEEDED_TOKEN} ${ing.currentStock}${UI_TEXT.INVENTORY.TABLE.PAREN_CLOSE}`
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      const request: CreateStockOutRequest = {
        stockOutDate,
        reason: reason as StockOutReason,
        items: validItems,
      };

      const response = await stockOutService.createReceipt(request);
      if (response.isSuccess) {
        await invalidateInventoryQueries(queryClient);
        toast.success(
          `${UI_TEXT.INVENTORY.STOCK_OUT.SUCCESS_CREATE_PREFIX} ${response.data.receiptCode}`
        );
        onSuccess?.();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to create stock out receipt", error);
      toast.error(error instanceof Error ? error.message : UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col p-0 text-foreground sm:max-w-[500px]">
        <SheetHeader className="shrink-0 border-b bg-background/95 p-6 backdrop-blur supports-backdrop-filter:bg-background/60">
          <SheetTitle className="text-xl font-bold text-destructive">
            {UI_TEXT.INVENTORY.STOCK_OUT_VOUCHER}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.STOCK_OUT.DATE}
              </Label>
              <Input
                type="date"
                className={INVENTORY_INPUT_CLASS}
                value={stockOutDate}
                onChange={(e) => setStockOutDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.STOCK_OUT.REASON_FIELD}
              </Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={UI_TEXT.INVENTORY.STOCK_OUT.REASON_PLACEHOLDER}
                className={INVENTORY_INPUT_CLASS}
              />
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {UI_TEXT.INVENTORY.STOCK_OUT.REASON_PRESETS.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-full border-dashed hover:bg-muted"
                    onClick={() => setReason(preset)}
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.STOCK_OUT.NOTE_LABEL}
              </Label>
              <Textarea
                placeholder={UI_TEXT.INVENTORY.STOCK_OUT.NOTE_PLACEHOLDER}
                className="min-h-[80px] resize-none rounded-xl border-slate-200 bg-slate-50 text-sm focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/15"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-background/95 py-2">
              <h3 className="flex items-center gap-2 text-base font-bold">
                {UI_TEXT.INVENTORY.TABLE.COL_ITEM}
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] text-destructive">
                  {items.length}
                </span>
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={addItem}
                className="h-8 rounded-lg border-destructive/20 text-destructive hover:bg-destructive/5"
              >
                <Plus className="mr-1.5 size-3.5" /> {UI_TEXT.BUTTON.ADD}
              </Button>
            </div>

            <div className="space-y-4 pb-4">
              {items.map((item, index) => {
                const selectedIng = ingredients.find((i) => i.ingredientId === item.ingredientId);
                return (
                  <div
                    key={index}
                    className="group relative space-y-3 rounded-xl border bg-card p-4 transition-all hover:border-destructive/20 hover:shadow-md"
                  >
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
                            <SelectValue
                              placeholder={UI_TEXT.INVENTORY.OPENING_STOCK.SEARCH_PLACEHOLDER}
                            />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
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
                            step="0.1"
                            className="h-9 rounded-lg"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(index, "quantity", parseFloat(e.target.value) || 0)
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
                                {selectedIng.currentStock}
                              </span>
                            </div>
                            {item.quantity > selectedIng.currentStock && (
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
                              e.target.value === "" ? null : parseFloat(e.target.value) || 0
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
                        {(item.quantity * (item.unitPrice ?? 0)).toLocaleString(
                          UI_TEXT.COMMON.LOCALE_VI
                        )}
                        <span className="ml-1 text-[10px]">{UI_TEXT.COMMON.CURRENCY}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="shrink-0 space-y-4 border-t bg-muted/10 p-6">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-semibold tracking-tight text-muted-foreground">
              {UI_TEXT.INVENTORY.OPENING_STOCK.TOTAL_VALUE}
            </span>
            <div className="text-right">
              <span className="text-2xl font-black tracking-tighter text-destructive">
                {calculateTotal().toLocaleString(UI_TEXT.COMMON.LOCALE_VI)}
              </span>
              <span className="ml-1 text-sm font-bold uppercase text-destructive">
                {UI_TEXT.COMMON.CURRENCY}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 flex-1 rounded-xl border-2 font-semibold"
            >
              {UI_TEXT.COMMON.CANCEL}
            </Button>
            <Button
              variant="destructive"
              disabled={submitting || items.length === 0 || items.every((i) => !i.ingredientId)}
              onClick={handleSubmit}
              className="h-11 flex-[1.5] rounded-xl font-bold shadow-lg shadow-destructive/20"
            >
              {submitting ? UI_TEXT.COMMON.PROCESSING : UI_TEXT.COMMON.SAVE}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
