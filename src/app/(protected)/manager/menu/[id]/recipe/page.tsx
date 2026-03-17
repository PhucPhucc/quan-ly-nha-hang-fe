import { ChefHat } from "lucide-react";
import React from "react";

import { RecipeSetupForm } from "@/components/features/recipe/RecipeSetupForm";
import { UI_TEXT } from "@/lib/UI_Text";

export default function RecipeSetupPage({ params }: { params: { id: string } }) {
  // In a real app we would fetch the raw menu item here
  // and pass its name down, but RecipeSetupForm fetches Recipe logic

  return (
    <div className="flex h-full flex-col gap-6 p-4 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          <ChefHat className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {UI_TEXT.MENU.RECIPE.TITLE}
          </h1>
          <p className="text-muted-foreground">{UI_TEXT.MENU.RECIPE.DESCRIPTION}</p>
        </div>
      </div>

      <RecipeSetupForm menuItemId={params.id} />
    </div>
  );
}
