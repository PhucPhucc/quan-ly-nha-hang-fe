"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { inventoryService } from "@/services/inventory.service";
import { InventoryCostMethod, InventoryGroup } from "@/types/Inventory";

import { INVENTORY_PAGE_CLASS } from "./components/inventoryStyles";

const groupSchema = z.object({
  name: z.string().trim().min(1, "Tên nhóm không được để trống"),
  description: z.string().optional(),
  lowStockThreshold: z.string().optional(),
  expiryWarningDays: z.string().optional(),
  defaultCostMethod: z.string().optional(),
});

type GroupFormValues = z.infer<typeof groupSchema>;

const EMPTY_FORM: GroupFormValues = {
  name: "",
  description: "",
  lowStockThreshold: "",
  expiryWarningDays: "",
  defaultCostMethod: "",
};

function formatOptionalNumber(value?: number | null) {
  return typeof value === "number" ? value.toString() : "—";
}

function getCostMethodLabel(value?: InventoryCostMethod | null) {
  if (value === InventoryCostMethod.WeightedAverage) {
    return UI_TEXT.INVENTORY.SETTINGS.COST_METHOD_W_AVG;
  }

  return UI_TEXT.INVENTORY.GROUPS.INHERIT_COST_METHOD;
}

export function InventoryGroupsManager() {
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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: EMPTY_FORM,
  });

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

  // eslint-disable-next-line react-hooks/incompatible-library
  const defaultCostMethod = watch("defaultCostMethod");

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
      await updateMutation.mutateAsync({ id: editingGroup.inventoryGroupId, payload });
      return;
    }

    await createMutation.mutateAsync(payload);
  };

  const isBusy = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
          {(error as Error).message}
        </div>
      );
    }

    return (
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="gap-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Plus className="h-5 w-5 text-primary" />
              {editingGroup
                ? UI_TEXT.INVENTORY.GROUPS.EDIT_TITLE
                : UI_TEXT.INVENTORY.GROUPS.CREATE_TITLE}
            </CardTitle>
            <CardDescription>{UI_TEXT.INVENTORY.GROUPS.FORM_DESC}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label className="text-sm font-semibold">{UI_TEXT.INVENTORY.GROUPS.NAME}</label>
                <Input
                  {...register("name")}
                  placeholder={UI_TEXT.INVENTORY.GROUPS.NAME_PLACEHOLDER}
                />
                {errors.name?.message && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  {UI_TEXT.INVENTORY.GROUPS.DESCRIPTION}
                </label>
                <Textarea
                  {...register("description")}
                  placeholder={UI_TEXT.INVENTORY.GROUPS.DESCRIPTION_PLACEHOLDER}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    {UI_TEXT.INVENTORY.GROUPS.LOW_STOCK_THRESHOLD}
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("lowStockThreshold")}
                    placeholder={UI_TEXT.INVENTORY.GROUPS.OPTIONAL}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    {UI_TEXT.INVENTORY.GROUPS.EXPIRY_WARNING_DAYS}
                  </label>
                  <Input
                    type="number"
                    {...register("expiryWarningDays")}
                    placeholder={UI_TEXT.INVENTORY.GROUPS.OPTIONAL}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  {UI_TEXT.INVENTORY.GROUPS.DEFAULT_COST_METHOD}
                </label>
                <select
                  value={defaultCostMethod || ""}
                  onChange={(event) =>
                    setValue("defaultCostMethod", event.target.value, { shouldDirty: true })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">{UI_TEXT.INVENTORY.GROUPS.INHERIT_COST_METHOD}</option>
                  <option value={InventoryCostMethod.WeightedAverage}>
                    {UI_TEXT.INVENTORY.SETTINGS.COST_METHOD_W_AVG}
                  </option>
                </select>
                <p className="text-xs text-muted-foreground">
                  {UI_TEXT.INVENTORY.GROUPS.DEFAULT_COST_METHOD_DESC}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={isBusy}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {editingGroup
                    ? UI_TEXT.INVENTORY.GROUPS.UPDATE_BTN
                    : UI_TEXT.INVENTORY.GROUPS.CREATE_BTN}
                </Button>
                {editingGroup && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setEditingGroup(null)}
                    disabled={isBusy}
                  >
                    {UI_TEXT.INVENTORY.GROUPS.CANCEL_EDIT}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="gap-2">
            <CardTitle>{UI_TEXT.INVENTORY.GROUPS.LIST_TITLE}</CardTitle>
            <CardDescription>{UI_TEXT.INVENTORY.GROUPS.LIST_DESC}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {groups.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                {UI_TEXT.INVENTORY.GROUPS.EMPTY_TITLE}
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">{UI_TEXT.INVENTORY.GROUPS.NAME}</th>
                        <th className="px-4 py-3">{UI_TEXT.INVENTORY.GROUPS.RULES}</th>
                        <th className="px-4 py-3">{UI_TEXT.INVENTORY.GROUPS.INGREDIENTS}</th>
                        <th className="px-4 py-3 text-right">{UI_TEXT.INVENTORY.GROUPS.ACTIONS}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groups.map((group) => (
                        <tr key={group.inventoryGroupId} className="border-t">
                          <td className="px-4 py-4 align-top">
                            <div className="space-y-1">
                              <div className="font-semibold text-foreground">{group.name}</div>
                              {group.description && (
                                <div className="max-w-md text-xs text-muted-foreground">
                                  {group.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">
                                {UI_TEXT.INVENTORY.GROUPS.LOW_STOCK_THRESHOLD}
                                {UI_TEXT.COMMON.COLON}{" "}
                                {formatOptionalNumber(group.lowStockThreshold)}
                              </Badge>
                              <Badge variant="outline">
                                {UI_TEXT.INVENTORY.GROUPS.EXPIRY_WARNING_DAYS}
                                {UI_TEXT.COMMON.COLON}{" "}
                                {formatOptionalNumber(group.expiryWarningDays)}
                              </Badge>
                              <Badge variant="outline">
                                {getCostMethodLabel(group.defaultCostMethod)}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <Badge variant="secondary">{group.ingredientCount}</Badge>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setEditingGroup(group)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className={cn("h-8 w-8", group.ingredientCount > 0 && "opacity-50")}
                                disabled={group.ingredientCount > 0}
                                onClick={() => setDeletingGroup(group)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className={cn(INVENTORY_PAGE_CLASS, "gap-4 pb-8")}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{UI_TEXT.INVENTORY.GROUPS.TITLE}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{UI_TEXT.INVENTORY.GROUPS.DESC}</p>
        </div>
      </div>

      {renderContent()}

      <Dialog open={!!deletingGroup} onOpenChange={(open) => !open && setDeletingGroup(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{UI_TEXT.INVENTORY.GROUPS.DELETE_TITLE}</DialogTitle>
            <DialogDescription>
              {UI_TEXT.INVENTORY.GROUPS.DELETE_DESC}
              {deletingGroup ? ` ${deletingGroup.name}` : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingGroup(null)}>
              {UI_TEXT.COMMON.CANCEL}
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingGroup && deleteMutation.mutate(deletingGroup.inventoryGroupId)}
              disabled={!deletingGroup || deleteMutation.isPending}
            >
              {deleteMutation.isPending
                ? UI_TEXT.INVENTORY.GROUPS.DELETING
                : UI_TEXT.INVENTORY.GROUPS.DELETE_BTN}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
