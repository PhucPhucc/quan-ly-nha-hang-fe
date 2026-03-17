import { Trash2 } from "lucide-react";
import React from "react";
import { FieldArrayWithId, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

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
import { RecipeIngredient } from "@/types/Recipe";

interface RecipeFormValues {
  ingredients: RecipeIngredient[];
  instructions?: string;
  prepTimeMinutes?: number;
}

interface RecipeIngredientsTableProps {
  fields: FieldArrayWithId<RecipeFormValues, "ingredients", "id">[];
  register: UseFormRegister<RecipeFormValues>;
  remove: (index: number) => void;
  setValue: UseFormSetValue<RecipeFormValues>;
  watchedIngredients: RecipeIngredient[];
  errors: FieldErrors<RecipeFormValues>;
}

export const RecipeIngredientsTable: React.FC<RecipeIngredientsTableProps> = ({
  fields,
  register,
  remove,
  setValue,
  watchedIngredients,
  errors,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-neutral-50/30">
          <TableRow className="border-none">
            <TableHead className="w-[300px]">{UI_TEXT.MENU.RECIPE.INGREDIENT_NAME}</TableHead>
            <TableHead className="text-center">{UI_TEXT.MENU.RECIPE.QUANTITY}</TableHead>
            <TableHead className="text-right">{UI_TEXT.MENU.RECIPE.COST}</TableHead>
            <TableHead className="w-[80px] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow
              key={field.id}
              className="group hover:bg-neutral-50/50 transition-colors border-neutral-100"
            >
              <TableCell>
                <div className="font-medium text-neutral-900">{field.ingredientName}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2 max-w-[150px] mx-auto">
                  <Input
                    type="number"
                    step="0.001"
                    className="h-9 text-center focus:ring-primary/20"
                    {...register(`ingredients.${index}.quantity` as const, {
                      valueAsNumber: true,
                      onChange: (e) => {
                        const qty = parseFloat(e.target.value);
                        if (!isNaN(qty)) {
                          setValue(`ingredients.${index}.totalCost`, qty * field.costPerUnit);
                        }
                      },
                    })}
                  />
                  <span className="text-sm font-medium text-muted-foreground min-w-[30px]">
                    {field.unit}
                  </span>
                </div>
                {errors.ingredients?.[index]?.quantity && (
                  <p className="text-[10px] text-error mt-1 text-center">
                    {errors.ingredients[index]?.quantity?.message}
                  </p>
                )}
              </TableCell>
              <TableCell className="text-right font-semibold text-neutral-900">
                {(watchedIngredients[index]?.totalCost || 0).toLocaleString()}{" "}
                <span className="text-[10px] font-normal text-muted-foreground">
                  {UI_TEXT.MENU.UNIT_VND}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => remove(index)}
                  className="text-muted-foreground hover:text-error hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
