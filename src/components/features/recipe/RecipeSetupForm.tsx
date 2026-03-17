"use client";

import { AlertCircle, Plus, Save } from "lucide-react";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UI_TEXT } from "@/lib/UI_Text";
import { Ingredient } from "@/types/Inventory";
import { Recipe } from "@/types/Recipe";

import { AddIngredientModal } from "./AddIngredientModal";
import { useRecipeForm } from "./hooks/useRecipeForm";
import { RecipeCostSummary } from "./RecipeCostSummary";
import { RecipeIngredientsTable } from "./RecipeIngredientsTable";

interface RecipeSetupFormProps {
  menuItemId: string;
  initialData: Recipe | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const RecipeSetupForm: React.FC<RecipeSetupFormProps> = ({
  menuItemId,
  initialData,
  onSuccess,
  onCancel,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    isDirty,
    handleAddIngredient,
  } = useRecipeForm({
    menuItemId,
    initialData,
    onSuccess,
  });

  const handleModalAdd = (ingredient: Ingredient, quantity: number) => {
    handleAddIngredient(ingredient, quantity);
    setIsModalOpen(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
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

      <div className="sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-neutral-100 p-4 -mx-6 flex items-center justify-end gap-3 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <Button variant="ghost" type="button" onClick={onCancel} className="h-11 px-8">
          {UI_TEXT.MENU.RECIPE.DISCARD}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
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
