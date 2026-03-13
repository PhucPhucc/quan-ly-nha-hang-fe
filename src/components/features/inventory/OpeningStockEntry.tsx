"use client";

import { Save, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import type { Ingredient, OpeningStockItem } from "@/types/Inventory";

import type { OpeningStockEntryValues } from "./components/openingStockEntry.types";
import { OpeningStockSummary } from "./components/OpeningStockSummary";
import { OpeningStockTable } from "./components/OpeningStockTable";

const { OPENING_STOCK } = UI_TEXT.INVENTORY;

export function OpeningStockEntry() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [entryItems, setEntryItems] = useState<OpeningStockEntryValues>({});

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await inventoryService.getIngredients(1, 100);
        if (response.isSuccess && response.data) {
          const activeIngredients = response.data.items.filter((item) => item.isActive);
          setIngredients(activeIngredients);
          const initialItems: OpeningStockEntryValues = {};
          activeIngredients.forEach((item) => {
            initialItems[item.ingredientId] = {
              quantity: item.currentStock || 0,
              costPrice: item.costPrice || 0,
            };
          });
          setEntryItems(initialItems);
        }
      } catch {
        toast.error(OPENING_STOCK.ERROR_FETCH);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const filteredIngredients = useMemo(() => {
    return ingredients.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [ingredients, search]);

  const totalValue = useMemo(
    () => Object.values(entryItems).reduce((sum, item) => sum + item.quantity * item.costPrice, 0),
    [entryItems]
  );

  const handleInputChange = (id: string, field: "quantity" | "costPrice", value: string) => {
    const numValue = parseFloat(value) || 0;
    setEntryItems((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: numValue,
      },
    }));
  };

  const handleSave = async () => {
    const itemsToImport: OpeningStockItem[] = Object.entries(entryItems)
      .filter(([, value]) => value.quantity > 0)
      .map(([id, value]) => ({
        ingredientId: id,
        initialQuantity: value.quantity,
        costPrice: value.costPrice,
      }));

    if (itemsToImport.length === 0) {
      toast.warning(OPENING_STOCK.VALIDATION_REQUIRED);
      return;
    }

    setSaving(true);
    try {
      const response = await inventoryService.importOpeningStock({ items: itemsToImport });
      if (response.isSuccess) {
        toast.success(OPENING_STOCK.SUCCESS_IMPORT);
      } else {
        toast.error(response.message || UI_TEXT.API.NETWORK_ERROR);
      }
    } catch {
      toast.error(UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 pb-10 md:p-6 md:pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={OPENING_STOCK.SEARCH_PLACEHOLDER}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <OpeningStockSummary totalValue={totalValue} />
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary-hover"
          >
            {saving ? <Spinner className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
            {OPENING_STOCK.BTN_SAVE}
          </Button>
        </div>
      </div>

      <Card className="border-border shadow-soft overflow-hidden">
        <CardContent className="p-0">
          <OpeningStockTable
            ingredients={filteredIngredients}
            entryItems={entryItems}
            onInputChange={handleInputChange}
          />
        </CardContent>
      </Card>
      <OpeningStockSummary totalValue={totalValue} mobile />
    </div>
  );
}
