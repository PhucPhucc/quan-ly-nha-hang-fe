"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { AlertThresholdStatus, Ingredient, InventoryUnit } from "@/types/Inventory";

import { IngredientFormValues, ingredientSchema } from "./ingredientSchema";
import { invalidateInventoryQueries } from "./inventoryQueryInvalidation";

interface UseIngredientFormProps {
  ingredient?: Ingredient;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

export function useIngredientForm({
  ingredient,
  open,
  setOpen,
  onSuccess,
}: UseIngredientFormProps) {
  const isEditing = !!ingredient;
  const [hasCustomCode, setHasCustomCode] = useState(false);
  const generateCodeRequestIdRef = React.useRef(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ["inventory-settings"],
    queryFn: async () => {
      const response = await inventoryService.getInventorySettings();
      return response.data;
    },
  });

  const { data: inventoryGroups = [] } = useQuery({
    queryKey: ["inventory-groups"],
    queryFn: async () => {
      const response = await inventoryService.getInventoryGroups();
      return response.data ?? [];
    },
  });

  const defaultLowStockThreshold = settings?.defaultLowStockThreshold ?? 10;
  const resolvedUseDefaultLowStockThreshold =
    ingredient?.useDefaultLowStockThreshold ??
    (ingredient ? ingredient.lowStockThreshold === defaultLowStockThreshold : true);
  const resolvedIngredientLowStockThreshold = resolvedUseDefaultLowStockThreshold
    ? defaultLowStockThreshold
    : (ingredient?.lowStockThreshold ?? defaultLowStockThreshold);

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: "",
      code: "",
      currentStock: 0,
      unit: InventoryUnit.KG,
      useDefaultLowStockThreshold: true,
      lowStockThreshold: defaultLowStockThreshold,
      inventoryGroupId: "",
      costPrice: 0,
      description: "",
      isActive: true,
    },
  });

  const {
    reset,
    watch,
    setValue,
    formState: { isDirty },
    handleSubmit,
  } = form;

  const watchedName = watch("name");
  const useDefaultLowStockThreshold = watch("useDefaultLowStockThreshold");

  // Reset form when ingredient changes or panel opens
  React.useEffect(() => {
    if (open) {
      if (ingredient) {
        reset({
          name: ingredient.name,
          code: ingredient.code,
          unit: ingredient.unit,
          currentStock: ingredient.currentStock,
          useDefaultLowStockThreshold: resolvedUseDefaultLowStockThreshold,
          lowStockThreshold: resolvedIngredientLowStockThreshold,
          inventoryGroupId: ingredient.inventoryGroupId ?? "",
          costPrice: ingredient.costPrice,
          description: ingredient.description || "",
          isActive: ingredient.isActive,
        });
      } else {
        reset({
          name: "",
          code: "",
          currentStock: 0,
          unit: InventoryUnit.KG,
          useDefaultLowStockThreshold: true,
          lowStockThreshold: defaultLowStockThreshold,
          inventoryGroupId: "",
          costPrice: 0,
          description: "",
          isActive: true,
        });
      }
      setError(null);
      setHasCustomCode(false);
    }
  }, [
    defaultLowStockThreshold,
    open,
    ingredient,
    reset,
    resolvedUseDefaultLowStockThreshold,
    resolvedIngredientLowStockThreshold,
  ]);

  React.useEffect(() => {
    if (!open || isDirty) return;
    if (useDefaultLowStockThreshold || !isEditing) {
      setValue("lowStockThreshold", defaultLowStockThreshold, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [defaultLowStockThreshold, isDirty, isEditing, open, setValue, useDefaultLowStockThreshold]);

  React.useEffect(() => {
    if (!open || !useDefaultLowStockThreshold) return;
    setValue("lowStockThreshold", defaultLowStockThreshold, {
      shouldDirty: false,
      shouldValidate: true,
    });
  }, [defaultLowStockThreshold, isEditing, open, setValue, useDefaultLowStockThreshold]);

  React.useEffect(() => {
    if (isEditing || hasCustomCode) return;

    const normalizedName = (watchedName || "").trim();
    if (!normalizedName) {
      generateCodeRequestIdRef.current += 1;
      setValue("code", "", { shouldValidate: true });
      return;
    }

    const currentRequestId = generateCodeRequestIdRef.current + 1;
    generateCodeRequestIdRef.current = currentRequestId;

    const timeoutId = window.setTimeout(async () => {
      const response = await inventoryService.generateIngredientCode(normalizedName);
      if (generateCodeRequestIdRef.current !== currentRequestId) return;
      setValue("code", response.data, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [watchedName, isEditing, hasCustomCode, setValue]);

  const onSubmit = async (data: IngredientFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: Partial<Ingredient> = {
        name: data.name,
        code: data.code,
        baseUnit: data.unit,
        lowStockThreshold: data.lowStockThreshold,
        inventoryGroupId: data.inventoryGroupId || null,
        description: data.description,
        isActive: data.isActive,
        ingredientId: ingredient?.ingredientId,
        status: isEditing ? ingredient.status : AlertThresholdStatus.NORMAL,
        useDefaultLowStockThreshold: data.useDefaultLowStockThreshold,
      };

      let res;
      if (isEditing && ingredient) {
        res = await inventoryService.updateIngredient(ingredient.ingredientId, payload);
      } else {
        res = await inventoryService.addIngredient(payload);
      }

      if (res.isSuccess) {
        toast.success(
          isEditing ? UI_TEXT.INVENTORY.FORM.SUCCESS_EDIT : UI_TEXT.INVENTORY.FORM.SUCCESS_ADD
        );
        await invalidateInventoryQueries(queryClient);
        setOpen(false);
        reset();
        if (onSuccess) onSuccess();
      } else {
        setError(res.message || UI_TEXT.INVENTORY.FORM.ERROR_ADD);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : UI_TEXT.INVENTORY.FORM.ERROR_CONN;
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    error,
    setError,
    defaultLowStockThreshold,
    inventoryGroups,
    setHasCustomCode,
    isEditing,
    onSubmit: handleSubmit(onSubmit),
  };
}
