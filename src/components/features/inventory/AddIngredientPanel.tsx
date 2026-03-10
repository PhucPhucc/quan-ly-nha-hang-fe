"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Plus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventoryService";
import { AlertThresholdStatus, Ingredient, InventoryUnit } from "@/types/Inventory";

const ingredientSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  sku: z.string().min(1, "SKU không được để trống"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  unit: z.nativeEnum(InventoryUnit),
  lowStockThreshold: z.number().min(0),
  costPerUnit: z.number().min(0),
});

type IngredientFormValues = z.infer<typeof ingredientSchema>;

interface AddIngredientPanelProps {
  ingredient?: Ingredient;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
  hideTrigger?: boolean;
}

export function AddIngredientPanel({
  ingredient,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
  trigger,
  hideTrigger,
}: AddIngredientPanelProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;
  const isEditing = !!ingredient;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: ingredient
      ? {
          name: ingredient.name,
          sku: ingredient.sku,
          category: ingredient.category,
          unit: ingredient.unit,
          lowStockThreshold: ingredient.lowStockThreshold,
          costPerUnit: ingredient.costPerUnit,
        }
      : {
          unit: undefined as unknown as InventoryUnit, // Will fix proper default later
          lowStockThreshold: 10,
          costPerUnit: 0,
        },
  });

  // Reset form when ingredient changes or panel opens
  React.useEffect(() => {
    if (open) {
      if (ingredient) {
        reset({
          name: ingredient.name,
          sku: ingredient.sku,
          category: ingredient.category,
          unit: ingredient.unit,
          lowStockThreshold: ingredient.lowStockThreshold,
          costPerUnit: ingredient.costPerUnit,
        });
      } else {
        reset({
          name: "",
          sku: "",
          category: "",
          unit: undefined as unknown as InventoryUnit,
          lowStockThreshold: 10,
          costPerUnit: 0,
        });
      }
      setError(null);
    }
  }, [open, ingredient, reset]);

  const onSubmit = async (data: IngredientFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: Partial<Ingredient> = {
        ...data,
        currentStock: 0,
        status: AlertThresholdStatus.NORMAL,
      };

      let res;
      if (isEditing && ingredient) {
        res = await inventoryService.updateIngredient(ingredient.id, payload);
      } else {
        res = await inventoryService.addIngredient(payload);
      }

      if (res.isSuccess) {
        setOpen(false);
        reset();
        if (onSuccess) onSuccess();
      } else {
        setError(res.message || UI_TEXT.INVENTORY.FORM.ERROR_ADD);
      }
    } catch {
      setError(UI_TEXT.INVENTORY.FORM.ERROR_CONN);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {!hideTrigger &&
        (trigger ? (
          <SheetTrigger asChild>{trigger}</SheetTrigger>
        ) : (
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> {UI_TEXT.INVENTORY.ADD_TITLE}
            </Button>
          </SheetTrigger>
        ))}
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full right-0 p-6 overflow-hidden">
        <SheetHeader className="px-0 pt-0 text-left">
          <SheetTitle className="text-2xl">
            {isEditing ? UI_TEXT.INVENTORY.EDIT_TITLE : UI_TEXT.INVENTORY.ADD_TITLE}
          </SheetTitle>
          <SheetDescription>
            {isEditing ? UI_TEXT.INVENTORY.EDIT_DESC : UI_TEXT.INVENTORY.ADD_DESC}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 pr-2 -mr-2">
          <div className="bg-primary/10 p-3 rounded-md border border-primary/20 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              {UI_TEXT.INVENTORY.PRO_TIP}
            </p>
          </div>

          <form id="ingredient-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 text-sm rounded bg-destructive/10 text-destructive">{error}</div>
            )}

            <div className="grid gap-2">
              <label className="text-sm font-medium">{UI_TEXT.INVENTORY.FORM.NAME}</label>
              <Input {...register("name")} placeholder={UI_TEXT.INVENTORY.FORM.PLACEHOLDER_NAME} />
              {errors.name && (
                <span className="text-xs text-destructive">{errors.name.message}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">{UI_TEXT.INVENTORY.FORM.SKU}</label>
                <Input {...register("sku")} placeholder={UI_TEXT.INVENTORY.FORM.PLACEHOLDER_SKU} />
                {errors.sku && (
                  <span className="text-xs text-destructive">{errors.sku.message}</span>
                )}
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">{UI_TEXT.INVENTORY.FORM.CATEGORY}</label>
                <Input
                  {...register("category")}
                  placeholder={UI_TEXT.INVENTORY.FORM.PLACEHOLDER_CATEGORY}
                />
                {errors.category && (
                  <span className="text-xs text-destructive">{errors.category.message}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">{UI_TEXT.INVENTORY.FORM.UNIT}</label>
                <select
                  {...register("unit")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">{UI_TEXT.INVENTORY.FORM.SELECT_UNIT}</option>
                  {Object.values(InventoryUnit).map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                {errors.unit && (
                  <span className="text-xs text-destructive">{errors.unit.message}</span>
                )}
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">{UI_TEXT.INVENTORY.FORM.COST}</label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("costPerUnit", { valueAsNumber: true })}
                />
                {errors.costPerUnit && (
                  <span className="text-xs text-destructive">{errors.costPerUnit.message}</span>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                {UI_TEXT.INVENTORY.FORM.ALERT_THRESHOLD}
              </label>
              <Input type="number" {...register("lowStockThreshold", { valueAsNumber: true })} />
              {errors.lowStockThreshold && (
                <span className="text-xs text-destructive">{errors.lowStockThreshold.message}</span>
              )}
            </div>
          </form>
        </div>

        <SheetFooter className="px-0 pb-0 mt-4 shrink-0 flex flex-row gap-3 sm:space-x-0 w-full">
          <SheetClose asChild>
            <Button variant="outline" type="button" className="flex-1">
              {UI_TEXT.COMMON.CANCEL}
            </Button>
          </SheetClose>
          <Button type="submit" form="ingredient-form" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? UI_TEXT.INVENTORY.FORM.BTN_SAVING : UI_TEXT.INVENTORY.FORM.BTN_SAVE}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
