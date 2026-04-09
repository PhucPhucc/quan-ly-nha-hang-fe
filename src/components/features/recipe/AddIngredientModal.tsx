"use client";

import { Plus, Search } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { Ingredient } from "@/types/Inventory";

import { AddIngredientTable } from "./AddIngredientTable";

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (ingredient: Ingredient, batchQuantity: number) => void;
  excludeIds?: string[];
}

export const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  excludeIds = [],
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const fetchIngredients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await inventoryService.getIngredients(1, 50, search);
      if (response.isSuccess && response.data) {
        setIngredients(response.data.items);
      }
    } catch (error) {
      console.error("Failed to fetch ingredients", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (isOpen) {
      fetchIngredients();
    }
  }, [isOpen, fetchIngredients]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    fetchIngredients();
  };

  const handleQuantityChange = (id: string, value: string) => {
    const val = parseFloat(value);
    setQuantities((prev) => ({
      ...prev,
      [id]: isNaN(val) ? 0 : val,
    }));
  };

  const handleConfirmAdd = () => {
    ingredients.forEach((ing) => {
      const quantity = quantities[ing.ingredientId] || 0;
      if (quantity > 0 && ing.currentStock > 0) {
        onAdd(ing, quantity);
      }
    });

    if (
      ingredients.some((ing) => (quantities[ing.ingredientId] || 0) > 0 && ing.currentStock <= 0)
    ) {
      toast.error(UI_TEXT.MENU.RECIPE.OUT_OF_STOCK_CANNOT_ADD);
    }

    setQuantities({}); // Reset quantities after adding
    onClose();
  };

  const hasSelectedIngredients = Object.values(quantities).some((q) => q > 0);

  const filteredIngredients = ingredients.filter((ing) => !excludeIds.includes(ing.ingredientId));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 rounded-xl overflow-hidden glassmorphism">
        <DialogHeader className="p-6 pb-0 mb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            {UI_TEXT.MENU.RECIPE.ADD_INGREDIENT}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={UI_TEXT.MENU.RECIPE.SEARCH_INGREDIENT_PLACEHOLDER}
              className="pl-9 h-11 border-neutral-200 focus:ring-primary/20 transition-all"
              value={search}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px] h-11 border-neutral-200">
              <SelectValue placeholder={UI_TEXT.MENU.RECIPE.CATEGORY_PLACEHOLDER} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{UI_TEXT.MENU.RECIPE.CATEGORY_ALL}</SelectItem>
              <SelectItem value="meat">{UI_TEXT.MENU.RECIPE.CATEGORY_MEAT}</SelectItem>
              <SelectItem value="veggie">{UI_TEXT.MENU.RECIPE.CATEGORY_VEGGIE}</SelectItem>
              <SelectItem value="spice">{UI_TEXT.MENU.RECIPE.CATEGORY_SPICE}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSearch} className="h-11 px-6 shadow-md shadow-primary/10">
            {UI_TEXT.MENU.RECIPE.SEARCH_BUTTON}
          </Button>
        </div>

        <div className="px-6 flex-1 overflow-hidden flex flex-col">
          <AddIngredientTable
            loading={loading}
            ingredients={filteredIngredients}
            quantities={quantities}
            onQuantityChange={handleQuantityChange}
            onAdd={onAdd}
          />
        </div>

        <DialogFooter className="p-6 bg-neutral-50 border-t mt-4 gap-2">
          <Button variant="outline" onClick={onClose} className="h-11 px-8 rounded-lg">
            {UI_TEXT.COMMON.CLOSE}
          </Button>
          <Button
            onClick={handleConfirmAdd}
            disabled={!hasSelectedIngredients}
            className="h-11 px-8 rounded-lg shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white"
          >
            {UI_TEXT.MENU.RECIPE.CONFIRM_ADD_BUTTON}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
