"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { InventorySettings } from "@/types/Inventory";

import { DispatchRulesSection } from "./sections/DispatchRulesSection";
import { StockAlertsSection } from "./sections/StockAlertsSection";

const { SETTINGS } = UI_TEXT;

// ── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  lowStockThreshold: z.number().min(0, UI_TEXT.FORM.MIN_VALUE(0)),
  expiryWarningDays: z
    .number()
    .int({ message: UI_TEXT.FORM.INT_ONLY })
    .min(1, UI_TEXT.FORM.MIN_VALUE(1)),
  costMethod: z.string(),
  autoDeductOnCompleted: z.boolean(),
  maxCostRecalcDays: z
    .number()
    .min(1, UI_TEXT.FORM.MIN_VALUE(1))
    .max(365, UI_TEXT.FORM.MAX_VALUE(365)),
  openingStockImportCooldownHours: z.number().min(0, UI_TEXT.FORM.MIN_VALUE(0)),
});

export type WarehouseSettingsInput = z.infer<typeof schema>;

const DEFAULT_VALUES: WarehouseSettingsInput = {
  lowStockThreshold: 10,
  expiryWarningDays: 7,
  costMethod: "WeightedAverage",
  autoDeductOnCompleted: true,
  maxCostRecalcDays: 31,
  openingStockImportCooldownHours: 0,
};

// ── Form ─────────────────────────────────────────────────────────────────────
type FormProps = {
  initialValues?: WarehouseSettingsInput;
  saving?: boolean;
  onSubmit: (data: WarehouseSettingsInput) => Promise<void> | void;
};

export function WarehouseSettingsForm({
  initialValues = DEFAULT_VALUES,
  saving = false,
  onSubmit,
}: FormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<WarehouseSettingsInput>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const autoDeduct = useWatch({ control, name: "autoDeductOnCompleted" });

  return (
    <div className="w-full p-4 pb-10 md:p-6 md:pb-12">
      <Card className="mx-auto w-full max-w-3xl border-border shadow-soft pt-5">
        <CardHeader className="gap-1 pb-4">
          <CardTitle className="text-lg">{SETTINGS.WAREHOUSE_TITLE}</CardTitle>
          <CardDescription>{SETTINGS.WAREHOUSE_DESC}</CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8 sm:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <StockAlertsSection register={register} errors={errors} />

            <div className="border-t border-border" />

            <DispatchRulesSection
              autoDeduct={autoDeduct}
              setValue={setValue}
              register={register}
              errors={errors}
            />

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="min-w-36 bg-primary hover:bg-primary-hover"
              >
                {saving ? <Spinner className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                {saving ? SETTINGS.BTN_SAVING : SETTINGS.BTN_SAVE}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Container ─────────────────────────────────────────────────────────────────
export function WarehouseSettingsContainer() {
  const [saving, setSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [initialValues, setInitialValues] = React.useState<WarehouseSettingsInput>(DEFAULT_VALUES);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await inventoryService.getInventorySettings();
        if (res.isSuccess && res.data) {
          setInitialValues({
            lowStockThreshold: res.data.defaultLowStockThreshold,
            expiryWarningDays: res.data.expiryWarningDays,
            costMethod: res.data.costMethod,
            autoDeductOnCompleted: res.data.autoDeductOnCompleted,
            maxCostRecalcDays: res.data.maxCostRecalcDays,
            openingStockImportCooldownHours: res.data.openingStockImportCooldownHours,
          });
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (data: WarehouseSettingsInput) => {
    setSaving(true);
    try {
      const payload: InventorySettings = {
        expiryWarningDays: data.expiryWarningDays,
        defaultLowStockThreshold: data.lowStockThreshold,
        autoDeductOnCompleted: data.autoDeductOnCompleted,
        costMethod: data.costMethod,
        maxCostRecalcDays: data.maxCostRecalcDays,
        openingStockImportCooldownHours: data.openingStockImportCooldownHours,
      };
      await inventoryService.updateInventorySettings(payload);
      toast.success(SETTINGS.SUCCESS_WAREHOUSE);
    } catch {
      toast.error(UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <WarehouseSettingsForm initialValues={initialValues} saving={saving} onSubmit={handleSubmit} />
  );
}
