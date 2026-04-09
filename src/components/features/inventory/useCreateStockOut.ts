"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/error";
import { normalizeInventoryQuantity } from "@/lib/inventory-number";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { stockOutService } from "@/services/stock-out.service";
import { Ingredient } from "@/types/Inventory";
import { CreateStockOutRequest, StockOutReason } from "@/types/StockOut";

import { invalidateInventoryQueries } from "./inventoryQueryInvalidation";

export interface ReceiptItemEntry {
  ingredientId: string;
  quantity: number;
  unitPrice?: number | null;
}

export function useCreateStockOut(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [items, setItems] = useState<ReceiptItemEntry[]>([]);
  const [reason, setReason] = useState<string>(UI_TEXT.INVENTORY.STOCK_OUT.REASON_PRESETS[0]);
  const [note, setNote] = useState("");
  const [stockOutDate, setStockOutDate] = useState<Date | undefined>(new Date());
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
        toast.error(getErrorMessage(error) || UI_TEXT.API.NETWORK_ERROR);
      }
    };

    fetchIngredients();
    setReason(UI_TEXT.INVENTORY.STOCK_OUT.REASON_PRESETS[0]);
    setNote("");
    setStockOutDate(new Date());
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
        stockOutDate:
          stockOutDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
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
      toast.error(getErrorMessage(error) || UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    ingredients,
    items,
    reason,
    setReason,
    note,
    setNote,
    stockOutDate,
    setStockOutDate,
    submitting,
    addItem,
    removeItem,
    updateItem,
    calculateTotal,
    handleSubmit,
  };
}
