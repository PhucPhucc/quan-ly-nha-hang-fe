import { ApiResponse } from "@/types/Api";
import { Recipe } from "@/types/Recipe";

export const recipeService = {
  // Lấy công thức theo Menu Item ID
  getByMenuItemId: async (menuItemId: string): Promise<ApiResponse<Recipe>> => {
    // TODO: Bỏ comment khi có backend
    // return apiFetch<Recipe>(`/recipes/menu-item/${menuItemId}`);

    // Mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isSuccess: true,
          data: {
            id: `recipe-${menuItemId}`,
            menuItemId: menuItemId,
            menuItemName: "Mock Item",
            ingredients: [
              {
                ingredientId: "ing-1",
                ingredientName: "Beef",
                quantity: 0.5,
                unit: "kg",
                costPerUnit: 20,
                totalCost: 10,
              },
            ],
            totalRecipeCost: 10,
            prepTimeMinutes: 15,
            instructions: "Cook well.",
            updatedAt: new Date().toISOString(),
          },
        });
      }, 500);
    });
  },

  // Cập nhật công thức
  updateRecipe: async (id: string, data: Partial<Recipe>): Promise<ApiResponse<Recipe>> => {
    // return apiFetch<Recipe>(`/recipes/${id}`, {
    //   method: "PUT",
    //   body: data,
    // });
    return new Promise((resolve) =>
      setTimeout(() => resolve({ isSuccess: true, data: { ...data, id } as Recipe }), 500)
    );
  },
};
