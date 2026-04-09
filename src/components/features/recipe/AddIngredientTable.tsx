import { Plus } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UI_TEXT } from "@/lib/UI_Text";
import { Ingredient } from "@/types/Inventory";

interface AddIngredientTableProps {
  loading: boolean;
  ingredients: Ingredient[];
  quantities: Record<string, number>;
  onQuantityChange: (id: string, value: string) => void;
  onAdd: (ingredient: Ingredient, quantity: number) => void;
}

export const AddIngredientTable: React.FC<AddIngredientTableProps> = ({
  loading,
  ingredients,
  quantities,
  onQuantityChange,
  onAdd,
}) => {
  return (
    <div className="flex-1 overflow-y-auto border rounded-lg border-neutral-100 bg-white/50">
      <Table>
        <TableHeader className="bg-neutral-50/80 sticky top-0 z-10">
          <TableRow>
            <TableHead className="font-semibold">{UI_TEXT.MENU.RECIPE.INGREDIENT_NAME}</TableHead>
            <TableHead className="font-semibold">{UI_TEXT.MENU.RECIPE.UNIT}</TableHead>
            <TableHead className="font-semibold text-right">
              {UI_TEXT.MENU.RECIPE.STOCK_COLUMN}
            </TableHead>
            <TableHead className="font-semibold w-[120px] text-center">
              {UI_TEXT.MENU.RECIPE.QUANTITY_COLUMN}
            </TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  {UI_TEXT.COMMON.LOADING}
                </div>
              </TableCell>
            </TableRow>
          ) : ingredients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                {UI_TEXT.MENU.RECIPE.NO_INGREDIENTS_FOUND}
              </TableCell>
            </TableRow>
          ) : (
            ingredients.map((ing) => (
              <TableRow
                key={ing.ingredientId}
                className="group hover:bg-primary/5 transition-colors"
              >
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span>{ing.name}</span>
                      {ing.currentStock <= 0 && (
                        <Badge variant="destructive" className="text-[10px]">
                          {UI_TEXT.MENU.RECIPE.OUT_OF_STOCK_BADGE}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground font-normal">{ing.code}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal border-neutral-200">
                    {ing.unit}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={
                      ing.currentStock <= ing.lowStockThreshold ? "text-error font-medium" : ""
                    }
                  >
                    {ing.currentStock}
                  </span>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    className="h-9 text-center focus:ring-primary/20"
                    placeholder="0"
                    value={quantities[ing.ingredientId] || ""}
                    onChange={(e) => onQuantityChange(ing.ingredientId, e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary hover:text-primary hover:bg-primary/10 transition-all rounded-full p-2"
                    onClick={() => {
                      if (ing.currentStock <= 0) {
                        toast.error(UI_TEXT.MENU.RECIPE.OUT_OF_STOCK_CANNOT_ADD);
                        return;
                      }

                      onAdd(ing, quantities[ing.ingredientId] || 0);
                    }}
                    disabled={(quantities[ing.ingredientId] || 0) <= 0 || ing.currentStock <= 0}
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
