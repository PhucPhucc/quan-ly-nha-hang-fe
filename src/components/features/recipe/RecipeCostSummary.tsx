import { AlertCircle, BookOpen, Clock } from "lucide-react";
import React from "react";
import { UseFormRegister } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";
import { RecipeIngredient } from "@/types/Recipe";

interface RecipeFormValues {
  ingredients: RecipeIngredient[];
  instructions?: string;
  prepTimeMinutes?: number;
}

interface RecipeCostSummaryProps {
  totalCost: number;
  register: UseFormRegister<RecipeFormValues>;
}

export const RecipeCostSummary: React.FC<RecipeCostSummaryProps> = ({ totalCost, register }) => {
  return (
    <div className="space-y-6">
      <Card className="border-none py-4 gap-0 shadow-xl shadow-neutral-200/50 bg-card backdrop-blur-sm border-t-4 border-t-primary">
        <CardHeader className="">
          <CardTitle className="text-lg font-bold uppercase tracking-wider text-card-foreground">
            {UI_TEXT.MENU.RECIPE.TOTAL_COST}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-4xl font-black text-primary flex items-baseline gap-2">
            {totalCost.toLocaleString()}
            <span className="text-sm font-medium text-muted-foreground">
              {UI_TEXT.MENU.UNIT_VND}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{UI_TEXT.MENU.RECIPE.TOTAL_COST_DESC}</p>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-neutral-700">
                <Clock className="w-4 h-4 text-primary" />
                {UI_TEXT.MENU.RECIPE.PREP_TIME}
              </Label>
              <Input
                type="number"
                placeholder={UI_TEXT.MENU.RECIPE.PREP_TIME_PLACEHOLDER}
                className="h-10 focus:ring-primary/20"
                {...register("prepTimeMinutes", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-neutral-700">
                <BookOpen className="w-4 h-4 text-primary" />
                {UI_TEXT.MENU.RECIPE.INSTRUCTIONS}
              </Label>
              <Textarea
                placeholder={UI_TEXT.MENU.RECIPE.INSTRUCTIONS_PLACEHOLDER}
                className="min-h-[150px] focus:ring-primary/20 bg-neutral-50/50 resize-none"
                {...register("instructions")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg shadow-neutral-100 bg-neutral-50/50">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            {UI_TEXT.MENU.HELPER_KDS_DEDUCTION}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
