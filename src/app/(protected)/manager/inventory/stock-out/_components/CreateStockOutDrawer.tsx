"use client";

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
import { formatInventoryQuantity, normalizeInventoryQuantity } from "@/lib/inventory-number";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { stockOutService } from "@/services/stock-out.service";
import { Ingredient } from "@/types/Inventory";
import { CreateStockOutRequest, StockOutReason } from "@/types/StockOut";

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
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [items, setItems] = useState<ReceiptItemEntry[]>([]);
  const [reason, setReason] = useState<StockOutReason | string>(
    UI_TEXT.INVENTORY.STOCK_OUT.REASON_PRESETS[0]
  );
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
    return () =>
      normalizeInventoryQuantity(
        items.reduce((sum, item) => sum + item.quantity * (item.unitPrice ?? 0), 0),
        2
      );
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
      if (
        ing &&
        normalizeInventoryQuantity(item.quantity) > normalizeInventoryQuantity(ing.currentStock)
      ) {
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
        reason,
        items: validItems,
      };

      const response = await stockOutService.createReceipt(request);
      if (response.isSuccess) {
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
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-[500px] w-full flex flex-col p-0 text-foreground">
          <SheetHeader className="p-6 border-b shrink-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <SheetTitle className="text-xl font-bold text-red-600">
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
                  className="bg-background rounded-lg"
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
                  className="bg-background rounded-lg"
                />
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {UI_TEXT.INVENTORY.STOCK_OUT.REASON_PRESETS.map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 rounded-full border-dashed"
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
                  className="bg-background min-h-[80px] rounded-lg resize-none"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between sticky top-0 bg-background/95 py-2 z-10">
                <h3 className="font-bold text-base flex items-center gap-2">
                  {UI_TEXT.INVENTORY.TABLE.COL_ITEM}
                  <span className="bg-red-50 text-red-600 text-[10px] px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="h-8 rounded-lg border-red-100 hover:bg-red-50 text-red-600"
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
                      className="group relative p-4 rounded-xl border bg-card transition-all hover:shadow-md hover:border-red-100 space-y-3"
                    >
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
                              <SelectValue
                                placeholder={UI_TEXT.INVENTORY.OPENING_STOCK.SEARCH_PLACEHOLDER}
                              />
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
                            <span className="text-xs font-semibold text-muted-foreground shrink-0 w-8">
                              {selectedIng?.unit || UI_TEXT.COMMON.DASH}
                            </span>
                          </div>
                          {selectedIng && (
                            <div className="text-[11px] text-muted-foreground space-y-0.5">
                              <div>
                                {UI_TEXT.INVENTORY.STOCK_OUT.CURRENT_STOCK_LABEL}{" "}
                                <span className="font-semibold text-slate-700">
                                  {formatInventoryQuantity(selectedIng.currentStock)}
                                </span>
                              </div>
                              {normalizeInventoryQuantity(item.quantity) >
                                normalizeInventoryQuantity(selectedIng.currentStock) && (
                                <div className="text-[11px] text-destructive font-semibold">
                                  {UI_TEXT.INVENTORY.STOCK_OUT.EXCEED_STOCK_WARNING}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="space-y-1.5 text-right">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground block text-right">
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

                      <div className="flex items-center justify-between pt-2 border-t border-dashed">
                        <span className="text-xs font-medium text-muted-foreground">
                          {UI_TEXT.INVENTORY.STOCK_OUT.TOTAL_PRICE_LABEL}
                        </span>
                        <span className="text-sm font-bold text-red-600">
                          {formatInventoryQuantity(item.quantity * (item.unitPrice ?? 0), 2)}
                          <span className="text-[10px] ml-1">{UI_TEXT.COMMON.CURRENCY}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-muted/10 shrink-0 space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-semibold text-muted-foreground tracking-tight">
                {UI_TEXT.INVENTORY.OPENING_STOCK.TOTAL_VALUE}
              </span>
              <div className="text-right">
                <span className="text-2xl font-black text-red-600 tracking-tighter">
                  {formatInventoryQuantity(calculateTotal(), 2)}
                </span>
                <span className="text-sm font-bold text-red-600 ml-1 uppercase">
                  {UI_TEXT.COMMON.CURRENCY}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-11 rounded-xl font-semibold border-2"
              >
                {UI_TEXT.COMMON.CANCEL}
              </Button>
              <Button
                disabled={submitting || items.length === 0 || items.every((i) => !i.ingredientId)}
                onClick={handleSubmit}
                className="flex-[1.5] h-11 rounded-xl bg-red-600 hover:bg-red-700 font-bold shadow-lg shadow-red-200"
              >
                {submitting ? UI_TEXT.COMMON.PROCESSING : UI_TEXT.COMMON.SAVE}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
