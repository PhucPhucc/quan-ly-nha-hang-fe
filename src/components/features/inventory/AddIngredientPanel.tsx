"use client";

import { AlertCircle, PackagePlus } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
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
import { Ingredient } from "@/types/Inventory";

import { IngredientFormFields } from "./components/IngredientFormFields";
import { useIngredientForm } from "./useIngredientForm";

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

  const {
    form,
    isSubmitting,
    error,
    defaultLowStockThreshold,
    inventoryGroups,
    setHasCustomCode,
    isEditing,
    onSubmit,
  } = useIngredientForm({
    ingredient,
    open,
    setOpen,
    onSuccess,
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {!hideTrigger &&
        (trigger ? (
          <SheetTrigger asChild>{trigger}</SheetTrigger>
        ) : (
          <SheetTrigger asChild>
            <Button variant="destructive" className="rounded-lg">
              <PackagePlus className="mr-2 h-4 w-4" /> {UI_TEXT.INVENTORY.ADD_TITLE}
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
            <p className="text-sm text-primary leading-relaxed">{UI_TEXT.INVENTORY.PRO_TIP}</p>
          </div>

          <form id="ingredient-form" onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm rounded bg-destructive/10 text-destructive border border-destructive/30">
                {error}
              </div>
            )}

            <IngredientFormFields
              register={register}
              errors={errors}
              control={control}
              isEditing={isEditing}
              setHasCustomCode={setHasCustomCode}
              defaultLowStockThreshold={defaultLowStockThreshold}
              inventoryGroups={inventoryGroups}
            />
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
