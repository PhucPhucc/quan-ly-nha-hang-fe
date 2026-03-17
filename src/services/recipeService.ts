import { apiFetch } from "@/services/api";
import { ApiResponse } from "@/types/Api";
import { Recipe, RecipeIngredient } from "@/types/Recipe";

interface GetRecipeItemResponse {
  ingredientId: string;
  ingredientName: string;
  baseUnit: string;
  quantityPerServing: number;
}

export const recipeService = {
  // Lấy công thức theo Menu Item ID
  getByMenuItemId: async (menuItemId: string): Promise<ApiResponse<Recipe>> => {
    const response = await apiFetch<GetRecipeItemResponse[]>(`/recipes/${menuItemId}`);

    // Map backend array response to Recipe object
    const ingredients: RecipeIngredient[] = (response.data || []).map((item) => ({
      ingredientId: item.ingredientId,
      ingredientName: item.ingredientName,
      quantity: item.quantityPerServing,
      unit: item.baseUnit,
      costPerUnit: 0, // Costs might need a separate fetch or BE update
      totalCost: 0,
      isOptional: false,
    }));

    const recipe: Recipe = {
      id: `recipe-${menuItemId}`,
      menuItemId: menuItemId,
      menuItemName: "", // Will be filled by UI or separate fetch
      ingredients: ingredients,
      totalRecipeCost: 0,
      prepTimeMinutes: 0,
      updatedAt: new Date().toISOString(),
    };

    return {
      ...response,
      data: recipe,
    };
  },

  // Cập nhật công thức (Upsert)
  upsertRecipe: async (
    menuItemId: string,
    ingredients: { ingredientId: string; quantityPerServing: number }[]
  ): Promise<ApiResponse<void>> => {
    return apiFetch<void>(`/recipes/${menuItemId}`, {
      method: "POST",
      body: { items: ingredients },
    });
  },
};
