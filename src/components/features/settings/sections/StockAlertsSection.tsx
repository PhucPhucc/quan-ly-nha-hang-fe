import { AlertTriangle, Box } from "lucide-react";
import React from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";

import { SectionHeader } from "../shared/SectionHeader";
import type { WarehouseSettingsInput } from "../WarehouseSettingsForm";

const { SETTINGS } = UI_TEXT;

type Props = {
  lowStockEnabled: boolean;
  register: UseFormRegister<WarehouseSettingsInput>;
  setValue: UseFormSetValue<WarehouseSettingsInput>;
  errors: FieldErrors<WarehouseSettingsInput>;
};

export function StockAlertsSection({ lowStockEnabled, register, setValue, errors }: Props) {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<AlertTriangle className="h-4 w-4" />}
        title={SETTINGS.STOCK_SECTION}
        description={SETTINGS.STOCK_SECTION_DESC}
      />

      <Field
        orientation="horizontal"
        className="items-start justify-between gap-4 rounded-lg border border-border bg-muted/20 p-4"
      >
        <div className="max-w-md space-y-0.5">
          <FieldLabel>{SETTINGS.FIELD_LOW_STOCK_ENABLED}</FieldLabel>
          <FieldDescription>{SETTINGS.FIELD_LOW_STOCK_ENABLED_DESC}</FieldDescription>
        </div>
        <Switch checked={lowStockEnabled} onCheckedChange={(v) => setValue("lowStockEnabled", v)} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel className="flex items-center gap-2">
            <Box className="h-4 w-4 text-primary" />
            {SETTINGS.FIELD_LOW_STOCK_THRESHOLD}
          </FieldLabel>
          <FieldContent>
            <Input
              type="number"
              min={0}
              disabled={!lowStockEnabled}
              className="max-w-sm"
              {...register("lowStockThreshold", { valueAsNumber: true })}
            />
            <FieldDescription>{SETTINGS.FIELD_LOW_STOCK_THRESHOLD_DESC}</FieldDescription>
            <FieldError errors={[errors.lowStockThreshold]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            {SETTINGS.FIELD_EXPIRY_WARNING}
          </FieldLabel>
          <FieldContent>
            <Input
              type="number"
              min={1}
              className="max-w-sm"
              {...register("expiryWarningDays", { valueAsNumber: true })}
            />
            <FieldDescription>{SETTINGS.FIELD_EXPIRY_WARNING_DESC}</FieldDescription>
            <FieldError errors={[errors.expiryWarningDays]} />
          </FieldContent>
        </Field>
      </div>
    </div>
  );
}
