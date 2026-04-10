export interface RecipeIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
  isOptional?: boolean;
  currentStock?: number;
}

export interface Recipe {
  id: string;
  menuItemId: string;
  menuItemName: string;
  ingredients: RecipeIngredient[];
  totalRecipeCost: number;
  instructions?: string;
  prepTimeMinutes?: number;
  updatedAt: string;
}
