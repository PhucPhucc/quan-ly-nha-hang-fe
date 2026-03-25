"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { InventoryGroup } from "@/types/Inventory";

export const groupSchema = z.object({
  name: z.string().trim().min(1, "Tên nhóm không được để trống"),
  description: z.string().optional(),
  lowStockThreshold: z.string().optional(),
  expiryWarningDays: z.string().optional(),
  defaultCostMethod: z.string().optional(),
});

export type GroupFormValues = z.infer<typeof groupSchema>;

export const EMPTY_FORM: GroupFormValues = {
  name: "",
  description: "",
  lowStockThreshold: "",
  expiryWarningDays: "",
  defaultCostMethod: "",
};

export function useInventoryGroups() {
  const queryClient = useQueryClient();
  const [editingGroup, setEditingGroup] = useState<InventoryGroup | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<InventoryGroup | null>(null);

  const {
    data: groups = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["inventory-groups"],
    queryFn: async () => {
      const response = await inventoryService.getInventoryGroups();
      return response.data ?? [];
    },
  });

  const formMethods = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: EMPTY_FORM,
  });

  const { reset } = formMethods;

  useEffect(() => {
    if (!editingGroup) {
      reset(EMPTY_FORM);
      return;
    }

    reset({
      name: editingGroup.name,
      description: editingGroup.description ?? "",
      lowStockThreshold:
        typeof editingGroup.lowStockThreshold === "number"
          ? String(editingGroup.lowStockThreshold)
          : "",
      expiryWarningDays:
        typeof editingGroup.expiryWarningDays === "number"
          ? String(editingGroup.expiryWarningDays)
          : "",
      defaultCostMethod: editingGroup.defaultCostMethod ?? "",
    });
  }, [editingGroup, reset]);

  const createMutation = useMutation({
    mutationFn: (payload: Parameters<typeof inventoryService.createInventoryGroup>[0]) =>
      inventoryService.createInventoryGroup(payload),
    onSuccess: async () => {
      toast.success(UI_TEXT.INVENTORY.GROUPS.SUCCESS_CREATE);
      await queryClient.invalidateQueries({ queryKey: ["inventory-groups"] });
      await queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      reset(EMPTY_FORM);
      setEditingGroup(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof inventoryService.updateInventoryGroup>[1];
    }) => inventoryService.updateInventoryGroup(id, payload),
    onSuccess: async () => {
      toast.success(UI_TEXT.INVENTORY.GROUPS.SUCCESS_UPDATE);
      await queryClient.invalidateQueries({ queryKey: ["inventory-groups"] });
      await queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      reset(EMPTY_FORM);
      setEditingGroup(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inventoryService.deleteInventoryGroup(id),
    onSuccess: async () => {
      toast.success(UI_TEXT.INVENTORY.GROUPS.SUCCESS_DELETE);
      await queryClient.invalidateQueries({ queryKey: ["inventory-groups"] });
      await queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      setDeletingGroup(null);
    },
  });

  const onSubmit = async (values: GroupFormValues) => {
    const payload = {
      name: values.name.trim(),
      description: values.description?.trim() ? values.description.trim() : null,
      lowStockThreshold:
        values.lowStockThreshold?.trim() === "" ? null : Number(values.lowStockThreshold),
      expiryWarningDays:
        values.expiryWarningDays?.trim() === "" ? null : Number(values.expiryWarningDays),
      defaultCostMethod: values.defaultCostMethod?.trim() ? values.defaultCostMethod : null,
    };

    if (editingGroup) {
      await updateMutation.mutateAsync({
        id: editingGroup.inventoryGroupId,
        payload: {
          ...payload,
          updatedAt: editingGroup.updatedAt,
        },
      });
      return;
    }

    await createMutation.mutateAsync(payload);
  };

  const isBusy = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return {
    groups,
    isLoading,
    isError,
    error,
    editingGroup,
    setEditingGroup,
    deletingGroup,
    setDeletingGroup,
    formMethods,
    onSubmit,
    isBusy,
    deleteMutation,
  };
}
