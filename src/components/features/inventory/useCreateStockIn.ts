"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { normalizeInventoryQuantity } from "@/lib/inventory-number";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { stockInService } from "@/services/stock-in.service";
import { Ingredient } from "@/types/Inventory";
import { CreateStockInRequest } from "@/types/StockIn";

import { invalidateInventoryQueries } from "./inventoryQueryInvalidation";

export interface ReceiptItemEntry {
  ingredientId: string;
  quantity: number;
  unitPrice: number;
  baseUnit: string;
  batchCode?: string | null;
  expirationDate?: Date | null;
}

export function useCreateStockIn(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void
) {
  const queryClient = useQueryClient();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [items, setItems] = useState<ReceiptItemEntry[]>([]);
  const [note, setNote] = useState("");
  const [receivedDate, setReceivedDate] = useState<Date | undefined>(new Date());
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
      setReceivedDate(new Date());
      setItems([{ ingredientId: "", quantity: 1, unitPrice: 0, baseUnit: "", batchCode: "" }]);
    }
  }, [open]);

  const addItem = () => {
    setItems([
      ...items,
      { ingredientId: "", quantity: 1, unitPrice: 0, baseUnit: "", batchCode: "" },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(
      newItems.length > 0
        ? newItems
        : [{ ingredientId: "", quantity: 1, unitPrice: 0, baseUnit: "", batchCode: "" }]
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
        receivedDate:
          receivedDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
        note,
        items: validItems.map((i) => ({
          ...i,
          batchCode: i.batchCode || undefined,
          expirationDate: i.expirationDate
            ? i.expirationDate.toISOString().split("T")[0]
            : undefined,
        })),
      };
      const response = await stockInService.createReceipt(request);
      if (response.isSuccess) {
        await invalidateInventoryQueries(queryClient);
        toast.success(
          `${UI_TEXT.INVENTORY.LOTS.SUCCESS_CREATE_RECEIPT} ${response.data.receiptCode}`
        );
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

  return {
    ingredients,
    items,
    note,
    setNote,
    receivedDate,
    setReceivedDate,
    submitting,
    addItem,
    removeItem,
    updateItem,
    calculateTotal,
    handleSubmit,
  };
}
