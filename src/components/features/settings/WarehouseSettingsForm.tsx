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

import { DispatchRulesSection } from "./sections/DispatchRulesSection";
import { StockAlertsSection } from "./sections/StockAlertsSection";

const { SETTINGS } = UI_TEXT;

// ── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  lowStockEnabled: z.boolean(),
  lowStockThreshold: z.number().min(0),
  expiryWarningDays: z.number().int().min(1),
  costMethod: z.enum(["FIFO", "LIFO", "AVG"]),
  autoDeductOnCompleted: z.boolean(),
});

export type WarehouseSettingsInput = z.infer<typeof schema>;

const DEFAULT_VALUES: WarehouseSettingsInput = {
  lowStockEnabled: true,
  lowStockThreshold: 10,
  expiryWarningDays: 7,
  costMethod: "AVG",
  autoDeductOnCompleted: true,
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

  const lowStockEnabled = useWatch({ control, name: "lowStockEnabled" });
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
            <StockAlertsSection
              lowStockEnabled={lowStockEnabled}
              register={register}
              setValue={setValue}
              errors={errors}
            />

            <div className="border-t border-border" />

            <DispatchRulesSection
              autoDeduct={autoDeduct}
              initialCostMethod={initialValues.costMethod}
              setValue={setValue}
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (_data: WarehouseSettingsInput) => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 800)); // TODO: inventoryService.updateSettings
      toast.success(SETTINGS.SUCCESS_WAREHOUSE);
    } catch {
      toast.error(UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setSaving(false);
    }
  };

  return <WarehouseSettingsForm saving={saving} onSubmit={handleSubmit} />;
}
