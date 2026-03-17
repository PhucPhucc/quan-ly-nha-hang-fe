import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import { UI_TEXT } from "@/lib/UI_Text";
import { recipeService } from "@/services/recipeService";
import { Ingredient } from "@/types/Inventory";
import { Recipe, RecipeIngredient } from "@/types/Recipe";

const recipeSchema = z.object({
  ingredients: z
    .array(
      z.object({
        ingredientId: z.string(),
        ingredientName: z.string(),
        quantity: z.number().min(0.001, UI_TEXT.MENU.RECIPE.QUANTITY_MIN_ERROR),
        unit: z.string(),
        costPerUnit: z.number(),
        totalCost: z.number(),
        isOptional: z.boolean().optional(),
      })
    )
    .min(1, UI_TEXT.MENU.RECIPE.AT_LEAST_ONE_ERROR),
  instructions: z.string().optional(),
  prepTimeMinutes: z.number().min(0).optional(),
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

interface UseRecipeFormProps {
  menuItemId: string;
  initialData: Recipe | null;
  onSuccess?: () => void;
}

export const useRecipeForm = ({ menuItemId, initialData, onSuccess }: UseRecipeFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      ingredients: (initialData?.ingredients || []) as RecipeIngredient[],
      instructions: initialData?.instructions || "",
      prepTimeMinutes: initialData?.prepTimeMinutes || 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const watchedIngredients = useWatch({
    control,
    name: "ingredients",
    defaultValue: (initialData?.ingredients || []) as RecipeIngredient[],
  });

  const totalCost = useMemo(() => {
    return watchedIngredients.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);
  }, [watchedIngredients]);

  const handleAddIngredient = (ingredient: Ingredient, quantity: number) => {
    append({
      ingredientId: ingredient.ingredientId,
      ingredientName: ingredient.name,
      quantity: quantity,
      unit: ingredient.unit,
      costPerUnit: ingredient.costPrice,
      totalCost: ingredient.costPrice * quantity,
      isOptional: false,
    });
  };

  const onSubmit = async (data: RecipeFormValues) => {
    try {
      const payload = data.ingredients.map((item) => ({
        ingredientId: item.ingredientId,
        quantityPerServing: item.quantity,
      }));

      const response = await recipeService.upsertRecipe(menuItemId, payload);
      if (response.isSuccess) {
        onSuccess?.();
      }
    } catch (error) {
      console.error("Failed to save recipe", error);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    fields,
    remove,
    setValue,
    watchedIngredients,
    totalCost,
    errors,
    isSubmitting,
    isDirty,
    handleAddIngredient,
  };
};
