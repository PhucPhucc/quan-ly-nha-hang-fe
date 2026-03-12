"use client";

import { Package, Save, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { formatCurrency } from "@/lib/utils";
import { inventoryService } from "@/services/inventoryService";
import type { Ingredient, OpeningStockItem } from "@/types/Inventory";

const { OPENING_STOCK } = UI_TEXT.INVENTORY;

export function OpeningStockEntry() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  // Local state for stock entry items
  const [entryItems, setEntryItems] = useState<
    Record<string, { quantity: number; costPrice: number }>
  >({});

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await inventoryService.getIngredients(1, 100);
        if (response.isSuccess && response.data) {
          const activeIngredients = response.data.items.filter((item) => item.isActive);
          setIngredients(activeIngredients);
          const initialItems: Record<string, { quantity: number; costPrice: number }> = {};
          activeIngredients.forEach((item) => {
            initialItems[item.ingredientId] = {
              quantity: item.currentStock || 0,
              costPrice: item.costPrice || 0,
            };
          });
          setEntryItems(initialItems);
        }
      } catch (error) {
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

  const calculateTotalValue = () => {
    return Object.values(entryItems).reduce((sum, item) => sum + item.quantity * item.costPrice, 0);
  };

  const handleSave = async () => {
    const itemsToImport: OpeningStockItem[] = Object.entries(entryItems)
      .filter(([_, value]) => value.quantity > 0)
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
        toast.error(response.message || UI_TEXT.API.ERROR);
      }
    } catch (error) {
      toast.error(UI_TEXT.API.CONNECTION_ERROR);
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
    <div className="space-y-6">
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
          <div className="hidden text-right sm:block">
            <p className="text-sm text-muted-foreground">{OPENING_STOCK.TOTAL_VALUE}</p>
            <p className="font-semibold text-primary">{formatCurrency(calculateTotalValue())}</p>
          </div>
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
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[120px]">{OPENING_STOCK.COL_CODE}</TableHead>
                  <TableHead>{OPENING_STOCK.COL_NAME}</TableHead>
                  <TableHead className="w-[100px]">{OPENING_STOCK.COL_UNIT}</TableHead>
                  <TableHead className="w-[120px] text-right">
                    {OPENING_STOCK.COL_CURRENT}
                  </TableHead>
                  <TableHead className="w-[160px]">{OPENING_STOCK.COL_INITIAL}</TableHead>
                  <TableHead className="w-[180px]">{OPENING_STOCK.COL_COST}</TableHead>
                  <TableHead className="w-[150px] text-right">{OPENING_STOCK.COL_TOTAL}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIngredients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Package className="h-8 w-8 opacity-20" />
                        <p>{OPENING_STOCK.EMPTY_SEARCH}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIngredients.map((item) => (
                    <TableRow
                      key={item.ingredientId}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <Badge variant="outline" className="font-mono text-xs">
                          {item.code}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">{item.unit}</span>
                      </TableCell>
                      <TableCell className="text-right font-medium">{item.currentStock}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          className="h-9"
                          value={entryItems[item.ingredientId]?.quantity ?? ""}
                          onChange={(e) =>
                            handleInputChange(item.ingredientId, "quantity", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          className="h-9"
                          value={entryItems[item.ingredientId]?.costPrice ?? ""}
                          onChange={(e) =>
                            handleInputChange(item.ingredientId, "costPrice", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {formatCurrency(
                          (entryItems[item.ingredientId]?.quantity || 0) *
                            (entryItems[item.ingredientId]?.costPrice || 0)
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-lg border p-4 sm:hidden">
        <div>
          <p className="text-xs text-muted-foreground">{OPENING_STOCK.TOTAL_VALUE}</p>
          <p className="font-bold text-primary">{formatCurrency(calculateTotalValue())}</p>
        </div>
      </div>
    </div>
  );
}
