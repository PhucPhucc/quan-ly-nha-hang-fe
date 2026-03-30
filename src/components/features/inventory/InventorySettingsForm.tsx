"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, CircleAlert, Info, Save } from "lucide-react";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";
import { type InventorySettingsInput, inventorySettingsSchema } from "@/lib/zod-schemas/inventory";
import { InventoryCostMethod } from "@/types/Inventory";

import { DEFAULT_INVENTORY_SETTINGS } from "./inventorySettings.constants";

const { SETTINGS } = UI_TEXT.INVENTORY;

type InventorySettingsMeta = {
  lastOpeningStockImportedAt?: string | null;
  nextOpeningStockImportAllowedAt?: string | null;
  openingStockImportCooldownHours?: number;
};

type Props = {
  initialValues?: InventorySettingsInput;
  saving?: boolean;
  metadata?: InventorySettingsMeta;
  onSubmit: (data: InventorySettingsInput) => Promise<void> | void;
};

import { formatDateTimeWithBranding } from "@/lib/branding-formatting";

function formatDateTime(value?: string | null) {
  if (!value) {
    return SETTINGS.NO_IMPORT_YET;
  }

  return formatDateTimeWithBranding(value, undefined, true);
}

function formatCooldownValue(value?: number) {
  if (!value) {
    return SETTINGS.IMPORT_COOLDOWN_NONE;
  }

  return `${value} ${SETTINGS.HOURS_SUFFIX}`;
}

export function InventorySettingsForm({
  initialValues = DEFAULT_INVENTORY_SETTINGS,
  saving = false,
  metadata,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<InventorySettingsInput>({
    resolver: zodResolver(inventorySettingsSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const autoDeductValue = useWatch({
    control,
    name: "autoDeductOnCompleted",
  });
  const costMethodValue = useWatch({
    control,
    name: "costMethod",
  });

  const costMethodLabel =
    costMethodValue === InventoryCostMethod.WeightedAverage
      ? SETTINGS.COST_METHOD_W_AVG
      : costMethodValue;

  return (
    <div className="w-full p-4 pb-10 md:p-6 md:pb-12">
      <Card className="mx-auto w-full max-w-5xl shadow-soft border-border">
        <CardHeader className="gap-3 pb-4">
          <div className="flex items-center gap-2">
            <CardTitle>{SETTINGS.GENERAL_INFO}</CardTitle>
          </div>
          <CardDescription>{SETTINGS.DESC}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 px-6 pb-8 sm:px-8">
          <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-slate-500">{SETTINGS.IMPORT_COOLDOWN_VALUE}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatCooldownValue(
                  metadata?.openingStockImportCooldownHours ??
                    initialValues.openingStockImportCooldownHours
                )}
              </p>
              <p className="mt-1 text-xs text-slate-500">{SETTINGS.IMPORT_COOLDOWN_NOTE}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">{SETTINGS.LAST_IMPORT_TIME}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatDateTime(metadata?.lastOpeningStockImportedAt)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">{SETTINGS.NEXT_IMPORT_ALLOWED}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatDateTime(metadata?.nextOpeningStockImportAllowedAt)}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Field className="md:col-span-1">
                <FieldLabel className="flex items-center gap-2">
                  <CircleAlert className="h-4 w-4 text-primary" />
                  {SETTINGS.EXPIRY_WARNING}
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    className="max-w-sm"
                    {...register("expiryWarningDays", { valueAsNumber: true })}
                  />
                  <FieldDescription>{SETTINGS.EXPIRY_WARNING_DESC}</FieldDescription>
                  <FieldError errors={[errors.expiryWarningDays]} />
                </FieldContent>
              </Field>

              <Field className="md:col-span-1">
                <FieldLabel className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-primary" />
                  {SETTINGS.LOW_STOCK_THRESHOLD}
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    className="max-w-sm"
                    {...register("defaultLowStockThreshold", { valueAsNumber: true })}
                  />
                  <FieldDescription>{SETTINGS.LOW_STOCK_THRESHOLD_DESC}</FieldDescription>
                  <FieldError errors={[errors.defaultLowStockThreshold]} />
                </FieldContent>
              </Field>

              <Field
                orientation="horizontal"
                className="md:col-span-2 items-start justify-start gap-4"
              >
                <div className="max-w-xl space-y-0.5">
                  <FieldLabel>{SETTINGS.AUTO_DEDUCT}</FieldLabel>
                  <FieldDescription>{SETTINGS.AUTO_DEDUCT_DESC}</FieldDescription>
                </div>
                <Switch
                  className="mt-0.5"
                  checked={autoDeductValue}
                  onCheckedChange={(checked) => setValue("autoDeductOnCompleted", checked)}
                />
              </Field>

              <Field className="md:col-span-1">
                <FieldLabel className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-info" />
                  {SETTINGS.COST_METHOD}
                </FieldLabel>
                <FieldContent>
                  <input
                    type="hidden"
                    defaultValue={InventoryCostMethod.WeightedAverage}
                    {...register("costMethod")}
                  />
                  <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-muted/40 px-3 text-sm text-foreground">
                    <span className="font-semibold">{SETTINGS.COST_METHOD_W_AVG}</span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {SETTINGS.DEFAULT}
                    </span>
                  </div>
                  <FieldDescription>
                    {SETTINGS.COST_METHOD_DESC} {SETTINGS.COST_METHOD_SUPPORT}{" "}
                    <span className="font-semibold">{costMethodLabel}</span>
                    {UI_TEXT.COMMON.DOT}
                  </FieldDescription>
                </FieldContent>
              </Field>

              <Field className="md:col-span-1">
                <FieldLabel>{SETTINGS.MAX_RECALC_DAYS}</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    className="max-w-sm"
                    {...register("maxCostRecalcDays", { valueAsNumber: true })}
                  />
                  <FieldDescription>{SETTINGS.MAX_RECALC_DAYS_DESC}</FieldDescription>
                  <FieldError errors={[errors.maxCostRecalcDays]} />
                </FieldContent>
              </Field>

              <Field className="md:col-span-1">
                <FieldLabel>{SETTINGS.OPENING_STOCK_IMPORT_COOLDOWN}</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    min={0}
                    className="max-w-sm"
                    {...register("openingStockImportCooldownHours", { valueAsNumber: true })}
                  />
                  <FieldDescription>{SETTINGS.OPENING_STOCK_IMPORT_COOLDOWN_DESC}</FieldDescription>
                  <FieldDescription>{SETTINGS.OPENING_STOCK_IMPORT_COOLDOWN_HELP}</FieldDescription>
                  <FieldError errors={[errors.openingStockImportCooldownHours]} />
                </FieldContent>
              </Field>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="min-w-32 bg-primary hover:bg-primary-hover"
              >
                {saving ? <Spinner className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                {UI_TEXT.BUTTON.SAVE_CHANGES}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
