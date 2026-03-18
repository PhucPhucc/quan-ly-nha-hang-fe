import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import {
  FieldErrors,
  Resolver,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { UI_TEXT } from "@/lib/UI_Text";
import { recipeService } from "@/services/recipeService";
import { Ingredient } from "@/types/Inventory";
import { Recipe, RecipeIngredient } from "@/types/Recipe";

const recipeSchema = z.object({
  ingredients: z.array(
    z.object({
      ingredientId: z.string(),
      ingredientName: z.string(),
      quantity: z.coerce.number().min(0.001, UI_TEXT.MENU.RECIPE.QUANTITY_MIN_ERROR),
      unit: z.string(),
      costPerUnit: z.coerce.number(),
      totalCost: z.coerce.number(),
      isOptional: z.boolean().optional(),
    })
  ),
  instructions: z.string().optional(),
  prepTimeMinutes: z.coerce.number().min(0).optional(),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;

interface UseRecipeFormProps {
  menuItemId: string;
  initialData: Recipe | null;
  onSuccess?: () => void;
}

export const useRecipeForm = ({ menuItemId, initialData, onSuccess }: UseRecipeFormProps) => {
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema) as Resolver<RecipeFormValues>,
    defaultValues: {
      ingredients: (initialData?.ingredients || []) as RecipeIngredient[],
      instructions: initialData?.instructions || "",
      prepTimeMinutes: initialData?.prepTimeMinutes || 0,
    },
  });

  const {
    register,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = form;

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        ingredients: initialData.ingredients as RecipeIngredient[],
        instructions: initialData.instructions || "",
        prepTimeMinutes: initialData.prepTimeMinutes || 0,
      });
    }
  }, [initialData, reset]);

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
    return (watchedIngredients || []).reduce((acc, curr) => {
      return acc + (curr?.totalCost || 0);
    }, 0);
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

  const onSubmit: SubmitHandler<RecipeFormValues> = async (data) => {
    const toastId = toast.loading(UI_TEXT.MENU.RECIPE.SAVING);
    try {
      const payload = data.ingredients.map((item) => ({
        ingredientId: item.ingredientId,
        quantityPerServing: item.quantity,
        baseUnit: item.unit,
      }));

      const response = await recipeService.upsertRecipe(
        menuItemId,
        payload,
        data.instructions,
        data.prepTimeMinutes
      );
      if (response.isSuccess) {
        toast.success(UI_TEXT.MENU.RECIPE.SAVE_SUCCESS, { id: toastId });
        onSuccess?.();
      } else {
        toast.error(response.message || UI_TEXT.MENU.RECIPE.SAVE_ERROR, { id: toastId });
      }
    } catch (error) {
      console.error("Failed to save recipe", error);
      toast.error(error instanceof Error ? error.message : UI_TEXT.MENU.RECIPE.SAVE_ERROR, {
        id: toastId,
      });
    }
  };

  const onInvalid = (errs: FieldErrors<RecipeFormValues>) => {
    console.error("Recipe form validation failed detailed report:", errs);

    const errorMessages: string[] = [];

    if (errs.ingredients) {
      if (Array.isArray(errs.ingredients)) {
        errs.ingredients.forEach((itemError, index) => {
          if (!itemError) return;
          const name = watchedIngredients[index]?.ingredientName || `Nguyên liệu ${index + 1}`;

          if (itemError.quantity) {
            errorMessages.push(
              `${name}: ${itemError.quantity.message || "Định lượng không hợp lệ"}`
            );
          }
          if (itemError.ingredientId) {
            errorMessages.push(`${name}: Mã nguyên liệu không hợp lệ`);
          }
          if (itemError.unit) {
            errorMessages.push(`${name}: Đơn vị không hợp lệ`);
          }
        });
      } else if (errs.ingredients.message) {
        errorMessages.push(errs.ingredients.message);
      }
    }

    if (errs.prepTimeMinutes) {
      errorMessages.push(
        `${UI_TEXT.MENU.RECIPE.PREP_TIME}: ${errs.prepTimeMinutes.message || "Không hợp lệ"}`
      );
    }

    if (errs.instructions) {
      errorMessages.push(
        `${UI_TEXT.MENU.RECIPE.INSTRUCTIONS}: ${errs.instructions.message || "Không hợp lệ"}`
      );
    }

    const finalMessage =
      errorMessages.length > 0 ? errorMessages[0] : UI_TEXT.COMMON.VALIDATION_ERROR;

    toast.error(finalMessage);
  };

  return {
    register,
    handleSubmit: form.handleSubmit(onSubmit, onInvalid),
    fields,
    remove,
    setValue,
    reset,
    watchedIngredients,
    totalCost,
    errors,
    isSubmitting,
    isDirty,
    handleAddIngredient,
  };
};
