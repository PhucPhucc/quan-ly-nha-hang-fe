import { apiFetch } from "@/services/api";
import { ApiResponse } from "@/types/Api";
import { Recipe, RecipeIngredient } from "@/types/Recipe";

interface GetRecipeItemBackend {
  ingredientId: string;
  ingredientName: string;
  baseUnit: string;
  quantityPerServing: number;
  costPrice: number;
  totalCost: number;
}

interface GetRecipeBackendResponse {
  menuItemId: string;
  instructions?: string;
  prepTimeMinutes: number;
  totalCost: number;
  items: GetRecipeItemBackend[];
}

export const recipeService = {
  // Lấy công thức theo Menu Item ID
  getByMenuItemId: async (menuItemId: string): Promise<ApiResponse<Recipe>> => {
    const response = await apiFetch<GetRecipeBackendResponse>(`/inventory/recipes/${menuItemId}`);

    if (!response.isSuccess || !response.data) {
      return {
        ...response,
        data: {
          id: `recipe-${menuItemId}`,
          menuItemId: menuItemId,
          menuItemName: "",
          ingredients: [],
          totalRecipeCost: 0,
          updatedAt: new Date().toISOString(),
        } as Recipe,
      };
    }

    const data = response.data;
    const ingredients: RecipeIngredient[] = (data.items || []).map((item) => ({
      ingredientId: item.ingredientId,
      ingredientName: item.ingredientName,
      quantity: item.quantityPerServing,
      unit: item.baseUnit,
      costPerUnit: item.costPrice,
      totalCost: item.totalCost,
      isOptional: false,
    }));

    const recipe: Recipe = {
      id: `recipe-${menuItemId}`,
      menuItemId: menuItemId,
      menuItemName: "",
      ingredients: ingredients,
      totalRecipeCost: data.totalCost || 0,
      instructions: data.instructions,
      prepTimeMinutes: data.prepTimeMinutes,
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
    ingredients: { ingredientId: string; quantityPerServing: number; baseUnit: string }[],
    instructions?: string,
    prepTimeMinutes?: number
  ): Promise<ApiResponse<void>> => {
    const payload = ingredients.map((item) => ({
      ingredientId: item.ingredientId,
      quantityPerServing: item.quantityPerServing,
      baseUnit: item.baseUnit,
    }));

    return apiFetch<void>(`/inventory/recipes/${menuItemId}`, {
      method: "PUT",
      body: {
        items: payload,
        instructions,
        prepTimeMinutes,
      },
    });
  },
};
