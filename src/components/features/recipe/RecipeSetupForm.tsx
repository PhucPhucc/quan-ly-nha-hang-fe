"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { UI_TEXT } from "@/lib/UI_Text";
import { recipeService } from "@/services/recipeService";

const ingredientLineSchema = z.object({
  ingredientId: z.string().min(1, "Select ingredient"),
  ingredientName: z.string(),
  quantity: z.number().min(0.01),
  unit: z.string(),
  costPerUnit: z.number(),
  totalCost: z.number(),
});

const recipeSchema = z.object({
  prepTimeMinutes: z.number().min(0),
  instructions: z.string().optional(),
  ingredients: z.array(ingredientLineSchema).min(1, "At least one ingredient required"),
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

interface RecipeSetupFormProps {
  menuItemId: string;
}

export function RecipeSetupForm({ menuItemId }: RecipeSetupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["recipe", menuItemId],
    queryFn: () => recipeService.getByMenuItemId(menuItemId),
  });

  const recipe = data?.data;

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    values: {
      prepTimeMinutes: recipe?.prepTimeMinutes || 15,
      instructions: recipe?.instructions || "",
      ingredients: recipe?.ingredients || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const ingredientsWatch = watch("ingredients");
  const totalCost = ingredientsWatch.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);

  const onSubmit = async (data: RecipeFormValues) => {
    setIsSubmitting(true);
    try {
      await recipeService.updateRecipe(recipe?.id || "new", {
        ...data,
        menuItemId,
        totalRecipeCost: totalCost,
      });
      // display success toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
      <div className="flex flex-col mb-6 pb-6 border-b">
        <h2 className="text-2xl font-semibold mb-2">{UI_TEXT.MENU.RECIPE.SETUP_TITLE}</h2>
        <p className="text-muted-foreground">{UI_TEXT.MENU.RECIPE.SETUP_DESC}</p>
      </div>

      <form id="recipe-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="gap-6 grid lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border">
              <h3 className="font-medium">{UI_TEXT.MENU.RECIPE.INGREDIENTS_LIST}</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    ingredientId: "",
                    ingredientName: "",
                    quantity: 1,
                    unit: "kg",
                    costPerUnit: 0,
                    totalCost: 0,
                  })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                {UI_TEXT.MENU.RECIPE.ADD_INGREDIENT}
              </Button>
            </div>

            {fields.length === 0 && (
              <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
                {UI_TEXT.MENU.RECIPE.EMPTY_MAPPED}
              </div>
            )}

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-3 p-3 bg-background border rounded-lg group"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />

                  {/* Select Mock - would use real generic Select in prod */}
                  <div className="flex-1">
                    <Input
                      {...register(`ingredients.${index}.ingredientName`)}
                      placeholder="Type ingredient name (Mock)"
                      className="bg-transparent"
                    />
                  </div>

                  <div className="w-24">
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                      placeholder="Qty"
                    />
                  </div>

                  <div className="w-20 text-sm text-muted-foreground text-center">{field.unit}</div>

                  <div className="w-24 text-right font-medium">
                    {UI_TEXT.MENU.RECIPE.CURRENCY}
                    {(
                      ingredientsWatch[index]?.costPerUnit * ingredientsWatch[index]?.quantity || 0
                    ).toFixed(2)}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            {errors.ingredients?.root && (
              <div className="text-sm text-destructive">{errors.ingredients.root.message}</div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-primary/5 p-6 rounded-lg border border-primary/10">
              <h3 className="text-lg font-medium mb-1">{UI_TEXT.MENU.RECIPE.TOTAL_COST}</h3>
              <div className="text-3xl font-bold text-primary">
                {UI_TEXT.MENU.RECIPE.CURRENCY}
                {totalCost.toFixed(2)}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">{UI_TEXT.MENU.RECIPE.PREP_TIME}</label>
                <Input type="number" {...register("prepTimeMinutes", { valueAsNumber: true })} />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">{UI_TEXT.MENU.RECIPE.INSTRUCTIONS}</label>
                <textarea
                  {...register("instructions")}
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Step by step preparation instructions..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline">
            {UI_TEXT.MENU.RECIPE.DISCARD}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? UI_TEXT.MENU.RECIPE.SAVING : UI_TEXT.MENU.RECIPE.SAVE_RECIPE}
          </Button>
        </div>
      </form>
    </div>
  );
}
