"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
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
import { stockInService } from "@/services/stock-in.service";
import { Ingredient } from "@/types/Inventory";
import { CreateStockInRequest } from "@/types/StockIn";

import { invalidateInventoryQueries } from "./inventoryQueryInvalidation";

interface CreateStockInDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ReceiptItemEntry {
  ingredientId: string;
  quantity: number;
  unitPrice: number;
  baseUnit: string;
  batchCode?: string | null;
  expirationDate?: string | null;
}

export const CreateStockInDrawer = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateStockInDrawerProps) => {
  const queryClient = useQueryClient();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [items, setItems] = useState<ReceiptItemEntry[]>([]);
  const [note, setNote] = useState("");
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
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
      setNote("");
      setReceivedDate(new Date().toISOString().split("T")[0]);
      setItems([{ ingredientId: "", quantity: 1, unitPrice: 0, baseUnit: "" }]);
    }
  }, [open]);

  const addItem = () => {
    setItems([...items, { ingredientId: "", quantity: 1, unitPrice: 0, baseUnit: "" }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(
      newItems.length > 0
        ? newItems
        : [{ ingredientId: "", quantity: 1, unitPrice: 0, baseUnit: "" }]
    );
  };

  const updateItem = <K extends keyof ReceiptItemEntry>(
    index: number,
    field: K,
    value: ReceiptItemEntry[K]
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    // Auto-fill price if ingredient is selected and price is not set
    if (field === "ingredientId") {
      const ingredient = ingredients.find((ing) => ing.ingredientId === value);
      if (ingredient) {
        if (newItems[index].unitPrice === 0) {
          newItems[index].unitPrice = ingredient.costPrice;
        }
        newItems[index].baseUnit = ingredient.unit;
      }
    }
    setItems(newItems);
  };

  const calculateTotal = () => {
    return normalizeInventoryQuantity(
      items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
      2
    );
  };

  const handleSubmit = async () => {
    const validItems = items.filter((i) => i.ingredientId !== "" && i.quantity > 0);
    if (validItems.length === 0) return;

    setSubmitting(true);
    try {
      const request: CreateStockInRequest = {
        receivedDate,
        note,
        items: validItems,
      };
      const response = await stockInService.createReceipt(request);
      if (response.isSuccess) {
        await invalidateInventoryQueries(queryClient);
        toast.success(`Đã tạo phiếu nhập ${response.data.receiptCode}`);
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to create receipt", error);
      toast.error(error instanceof Error ? error.message : UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px] w-full flex flex-col p-0 text-foreground">
        <SheetHeader className="p-6 border-b shrink-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <SheetTitle className="text-xl font-bold">
            {UI_TEXT.INVENTORY.STOCK_IN_VOUCHER}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* General Info - Stacked Vertically */}
          <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.TABLE.COL_DATE}
              </Label>
              <Input
                type="date"
                className="bg-background rounded-lg"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {UI_TEXT.INVENTORY.FORM.DESCRIPTION}
              </Label>
              <Textarea
                placeholder={UI_TEXT.INVENTORY.FORM.PLACEHOLDER_DESCRIPTION}
                className="bg-background min-h-[80px] rounded-lg resize-none"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between sticky top-0 bg-background/95 py-2 z-10">
              <h3 className="font-bold text-base flex items-center gap-2">
                {UI_TEXT.INVENTORY.OPENING_STOCK.COL_NAME}
                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={addItem}
                className="h-8 rounded-lg border-primary/20 hover:bg-primary/5 text-primary"
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
                    className="group relative p-4 rounded-xl border bg-card transition-all hover:shadow-md hover:border-primary/20 space-y-3"
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
              <span className="text-2xl font-black text-primary tracking-tighter">
                {formatInventoryQuantity(calculateTotal(), 2)}
              </span>
              <span className="text-sm font-bold text-primary ml-1 uppercase">
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
              className="flex-[1.5] h-11 rounded-xl bg-primary hover:bg-primary-hover font-bold shadow-lg shadow-primary/20"
            >
              {submitting ? UI_TEXT.COMMON.PROCESSING : UI_TEXT.COMMON.SAVE}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
