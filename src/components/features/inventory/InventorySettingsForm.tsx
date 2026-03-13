"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, CircleAlert, Info, Save } from "lucide-react";
import React from "react";
import { useForm, useWatch } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
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

import { DEFAULT_INVENTORY_SETTINGS } from "./inventorySettings.constants";

const { SETTINGS } = UI_TEXT.INVENTORY;

type Props = {
  initialValues?: InventorySettingsInput;
  saving?: boolean;
  onSubmit: (data: InventorySettingsInput) => Promise<void> | void;
};

export function InventorySettingsForm({
  initialValues = DEFAULT_INVENTORY_SETTINGS,
  saving = false,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<InventorySettingsInput>({
    resolver: zodResolver(inventorySettingsSchema),
    defaultValues: initialValues,
  });

  const autoDeductValue = useWatch({
    control,
    name: "autoDeductOnCompleted",
  });
  const costMethodValue = useWatch({
    control,
    name: "costMethod",
  });

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
                className="md:col-span-2 items-center justify-between"
              >
                <div className="space-y-0.5">
                  <FieldLabel>{SETTINGS.AUTO_DEDUCT}</FieldLabel>
                  <FieldDescription>{SETTINGS.AUTO_DEDUCT_DESC}</FieldDescription>
                </div>
                <Switch
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
                  <div className="flex h-10 items-center">
                    <Badge
                      variant="secondary"
                      className="px-3 py-1 text-sm bg-secondary text-secondary-foreground"
                    >
                      {costMethodValue || "Bình quân gia quyền"}
                    </Badge>
                  </div>
                  <FieldDescription>{SETTINGS.COST_METHOD_DESC}</FieldDescription>
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
