"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, CircleAlert, Info, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { inventoryService } from "@/services/inventoryService";

const { SETTINGS } = UI_TEXT.INVENTORY;

export function InventorySettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InventorySettingsInput>({
    resolver: zodResolver(inventorySettingsSchema),
    defaultValues: {
      expiryWarningDays: 7,
      defaultLowStockThreshold: 0,
      autoDeductOnCompleted: true,
      costMethod: "Bình quân gia quyền",
      maxCostRecalcDays: 31,
    },
  });

  const autoDeductValue = watch("autoDeductOnCompleted");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await inventoryService.getInventorySettings();
        if (response.isSuccess && response.data) {
          reset(response.data);
        }
      } catch (error) {
        toast.error(SETTINGS.ERROR_FETCH);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: InventorySettingsInput) => {
    setSaving(true);
    try {
      const response = await inventoryService.updateInventorySettings(data);
      if (response.isSuccess) {
        toast.success(SETTINGS.SUCCESS_UPDATE);
      } else {
        toast.error(response.message || UI_TEXT.API.ERROR);
      }
    } catch (error) {
      toast.error(UI_TEXT.API.CONNECTION_ERROR);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <Card className="max-w-3xl shadow-soft border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{SETTINGS.GENERAL_INFO}</CardTitle>
        </div>
        <CardDescription>{SETTINGS.DESC}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-8">
            <Field>
              <FieldLabel className="flex items-center gap-2">
                <CircleAlert className="h-4 w-4 text-primary" />
                {SETTINGS.EXPIRY_WARNING}
              </FieldLabel>
              <FieldContent>
                <Input type="number" {...register("expiryWarningDays", { valueAsNumber: true })} />
                <FieldDescription>{SETTINGS.EXPIRY_WARNING_DESC}</FieldDescription>
                <FieldError errors={[errors.expiryWarningDays]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="flex items-center gap-2">
                <Box className="h-4 w-4 text-primary" />
                {SETTINGS.LOW_STOCK_THRESHOLD}
              </FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  {...register("defaultLowStockThreshold", { valueAsNumber: true })}
                />
                <FieldDescription>{SETTINGS.LOW_STOCK_THRESHOLD_DESC}</FieldDescription>
                <FieldError errors={[errors.defaultLowStockThreshold]} />
              </FieldContent>
            </Field>

            <Field orientation="horizontal" className="justify-between">
              <div className="space-y-0.5">
                <FieldLabel>{SETTINGS.AUTO_DEDUCT}</FieldLabel>
                <FieldDescription>{SETTINGS.AUTO_DEDUCT_DESC}</FieldDescription>
              </div>
              <Switch
                checked={autoDeductValue}
                onCheckedChange={(checked) => setValue("autoDeductOnCompleted", checked)}
              />
            </Field>

            <Field>
              <FieldLabel className="flex items-center gap-2">
                <Info className="h-4 w-4 text-info" />
                {SETTINGS.COST_METHOD}
              </FieldLabel>
              <FieldContent>
                <div className="flex items-center h-10">
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 text-sm bg-secondary text-secondary-foreground"
                  >
                    {watch("costMethod") || "Bình quân gia quyền"}
                  </Badge>
                </div>
                <FieldDescription>{SETTINGS.COST_METHOD_DESC}</FieldDescription>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>{SETTINGS.MAX_RECALC_DAYS}</FieldLabel>
              <FieldContent>
                <Input type="number" {...register("maxCostRecalcDays", { valueAsNumber: true })} />
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
  );
}
