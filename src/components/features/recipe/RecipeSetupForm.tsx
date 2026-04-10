"use client";

import { AlertCircle, Loader2, Plus, Save } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { recipeService } from "@/services/recipeService";
import { Ingredient } from "@/types/Inventory";
import { Recipe } from "@/types/Recipe";

import { AddIngredientModal } from "./AddIngredientModal";
import { useRecipeForm } from "./hooks/useRecipeForm";
import { RecipeCostSummary } from "./RecipeCostSummary";
import { RecipeIngredientsTable } from "./RecipeIngredientsTable";

interface RecipeSetupFormProps {
  menuItemId: string;
  initialData?: Recipe | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  onCostUpdate?: (newCost: number) => void;
}

export const RecipeSetupForm: React.FC<RecipeSetupFormProps> = ({
  menuItemId,
  initialData: propInitialData,
  onSuccess,
  onCancel,
  onCostUpdate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipeData, setRecipeData] = useState<Recipe | null>(propInitialData || null);
  const [isLoading, setIsLoading] = useState(!propInitialData);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (propInitialData) {
        setRecipeData(propInitialData);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [recipeRes, ingredientsRes] = await Promise.all([
          recipeService.getByMenuItemId(menuItemId),
          inventoryService.getIngredients(1, 100),
        ]);

        if (recipeRes.isSuccess) {
          const stockMap: Record<string, number> = {};
          if (ingredientsRes.isSuccess && ingredientsRes.data?.items) {
            ingredientsRes.data.items.forEach((ing: Ingredient) => {
              stockMap[ing.ingredientId] = ing.currentStock;
            });
          }

          if (recipeRes.data) {
            recipeRes.data.ingredients = recipeRes.data.ingredients.map((ing) => ({
              ...ing,
              currentStock: stockMap[ing.ingredientId] ?? 0,
            }));
          }
          setRecipeData(recipeRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [menuItemId, propInitialData]);

  const {
    register,
    handleSubmit,
    fields,
    remove,
    setValue,
    watchedIngredients,
    totalCost,
    errors,
    isSubmitting,
    handleAddIngredient,
  } = useRecipeForm({
    menuItemId,
    initialData: recipeData,
    onSuccess,
    onCostUpdate,
  });

  const handleModalAdd = (ingredient: Ingredient, quantity: number) => {
    handleAddIngredient(ingredient, quantity);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-neutral-500 font-medium">{UI_TEXT.COMMON.LOADING}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl shadow-neutral-200/50 overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 flex flex-row items-center justify-between pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    {UI_TEXT.MENU.RECIPE.INGREDIENTS_LIST}
                    <Badge
                      variant="secondary"
                      className="font-normal bg-primary/10 text-primary border-none"
                    >
                      {UI_TEXT.MENU.INGREDIENTS_COUNT(fields.length)}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{UI_TEXT.MENU.HELPER_INGREDIENTS}</p>
                </div>
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {UI_TEXT.MENU.RECIPE.ADD_INGREDIENT}
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {fields.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-neutral-900">
                        {UI_TEXT.MENU.RECIPE.EMPTY_MAPPED}
                      </h3>
                    </div>
                    <Button variant="outline" type="button" onClick={() => setIsModalOpen(true)}>
                      {UI_TEXT.MENU.ADD_NOW}
                    </Button>
                  </div>
                ) : (
                  <RecipeIngredientsTable
                    fields={fields}
                    register={register}
                    remove={remove}
                    setValue={setValue}
                    watchedIngredients={watchedIngredients}
                    errors={errors}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <RecipeCostSummary totalCost={totalCost} register={register} />
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4 px-6 flex items-center justify-end gap-3 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <Button
          variant="ghost"
          type="button"
          onClick={onCancel}
          className="h-11 px-8 text-neutral-600 hover:bg-neutral-100"
        >
          {UI_TEXT.MENU.RECIPE.DISCARD}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 px-10 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {UI_TEXT.MENU.RECIPE.SAVING}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {UI_TEXT.MENU.RECIPE.SAVE_RECIPE}
            </div>
          )}
        </Button>
      </div>

      <AddIngredientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleModalAdd}
        excludeIds={watchedIngredients.map((i) => i.ingredientId)}
      />
    </form>
  );
};
