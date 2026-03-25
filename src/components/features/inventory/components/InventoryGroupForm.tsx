"use client";

import { CheckCircle2, Plus } from "lucide-react";
import React from "react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UI_TEXT } from "@/lib/UI_Text";
import { cn } from "@/lib/utils";
import { InventoryCostMethod, InventoryGroup } from "@/types/Inventory";

import { GroupFormValues } from "../useInventoryGroups";
import {
  INVENTORY_INPUT_CLASS,
  INVENTORY_SELECT_TRIGGER_CLASS,
  INVENTORY_SURFACE_CLASS,
} from "./inventoryStyles";

interface InventoryGroupFormProps {
  formMethods: UseFormReturn<GroupFormValues>;
  onSubmit: (values: GroupFormValues) => Promise<void>;
  editingGroup: InventoryGroup | null;
  setEditingGroup: (group: InventoryGroup | null) => void;
  isBusy: boolean;
}

export function InventoryGroupForm({
  formMethods,
  onSubmit,
  editingGroup,
  setEditingGroup,
  isBusy,
}: InventoryGroupFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = formMethods;

  const defaultCostMethod = watch("defaultCostMethod");

  return (
    <Card className={cn(INVENTORY_SURFACE_CLASS, "h-fit")}>
      <CardHeader className="border-b border-slate-100 bg-slate-50/30 px-6 py-5">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Plus className="h-4 w-4" />
          </div>
          {editingGroup
            ? UI_TEXT.INVENTORY.GROUPS.EDIT_TITLE
            : UI_TEXT.INVENTORY.GROUPS.CREATE_TITLE}
        </CardTitle>
        <CardDescription className="text-xs">{UI_TEXT.INVENTORY.GROUPS.FORM_DESC}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {UI_TEXT.INVENTORY.GROUPS.NAME}
            </label>
            <Input
              {...register("name")}
              className={INVENTORY_INPUT_CLASS}
              placeholder={UI_TEXT.INVENTORY.GROUPS.NAME_PLACEHOLDER}
            />
            {errors.name?.message && (
              <p className="mt-1 text-xs font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {UI_TEXT.INVENTORY.GROUPS.DESCRIPTION}
            </label>
            <Textarea
              {...register("description")}
              className={cn(INVENTORY_INPUT_CLASS, "min-h-[100px] py-3")}
              placeholder={UI_TEXT.INVENTORY.GROUPS.DESCRIPTION_PLACEHOLDER}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {UI_TEXT.INVENTORY.GROUPS.LOW_STOCK_THRESHOLD}
              </label>
              <Input
                type="number"
                step="0.01"
                className={INVENTORY_INPUT_CLASS}
                {...register("lowStockThreshold")}
                placeholder={UI_TEXT.INVENTORY.GROUPS.OPTIONAL}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {UI_TEXT.INVENTORY.GROUPS.EXPIRY_WARNING_DAYS}
              </label>
              <Input
                type="number"
                className={INVENTORY_INPUT_CLASS}
                {...register("expiryWarningDays")}
                placeholder={UI_TEXT.INVENTORY.GROUPS.OPTIONAL}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {UI_TEXT.INVENTORY.GROUPS.DEFAULT_COST_METHOD}
            </label>
            <Select
              value={defaultCostMethod || "inherit"}
              onValueChange={(val) =>
                setValue(
                  "defaultCostMethod",
                  val === "inherit" ? "" : (val as InventoryCostMethod),
                  {
                    shouldDirty: true,
                  }
                )
              }
            >
              <SelectTrigger className={INVENTORY_SELECT_TRIGGER_CLASS}>
                <SelectValue placeholder={UI_TEXT.INVENTORY.GROUPS.INHERIT_COST_METHOD} />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="inherit">
                  {UI_TEXT.INVENTORY.GROUPS.INHERIT_COST_METHOD}
                </SelectItem>
                <SelectItem value={InventoryCostMethod.WeightedAverage}>
                  {UI_TEXT.INVENTORY.SETTINGS.COST_METHOD_W_AVG}
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] leading-relaxed text-slate-400">
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
  );
}
