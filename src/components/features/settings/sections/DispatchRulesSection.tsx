import { Shuffle } from "lucide-react";
import React from "react";
import { UseFormSetValue } from "react-hook-form";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";

import { SectionHeader } from "../shared/SectionHeader";
import type { WarehouseSettingsInput } from "../WarehouseSettingsForm";

const { SETTINGS } = UI_TEXT;

type Props = {
  autoDeduct: boolean;
  setValue: UseFormSetValue<WarehouseSettingsInput>;
  register: UseFormRegister<WarehouseSettingsInput>;
  errors: FieldErrors<WarehouseSettingsInput>;
};

export function DispatchRulesSection({ autoDeduct, setValue, register, errors }: Props) {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Shuffle className="h-4 w-4" />}
        title={SETTINGS.DISPATCH_SECTION}
        description={SETTINGS.DISPATCH_SECTION_DESC}
      />

      <Field>
        <FieldLabel>{UI_TEXT.INVENTORY.SETTINGS.COST_METHOD}</FieldLabel>
        <FieldContent>
          <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-muted/40 px-3 text-sm text-foreground">
            <span className="font-semibold text-primary">
              {UI_TEXT.INVENTORY.SETTINGS.COST_METHOD_W_AVG}
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              {UI_TEXT.INVENTORY.SETTINGS.DEFAULT}
            </span>
          </div>
          <FieldDescription>
            {UI_TEXT.INVENTORY.SETTINGS.COST_METHOD_DESC}{" "}
            {UI_TEXT.INVENTORY.SETTINGS.COST_METHOD_SUPPORT}
          </FieldDescription>
        </FieldContent>
      </Field>

      <Field
        orientation="horizontal"
        className="items-start justify-between gap-4 rounded-lg border border-border bg-muted/20 p-4"
      >
        <div className="max-w-md space-y-0.5">
          <FieldLabel>{SETTINGS.FIELD_AUTO_DEDUCT}</FieldLabel>
          <FieldDescription>{SETTINGS.FIELD_AUTO_DEDUCT_DESC}</FieldDescription>
        </div>
        <Switch
          checked={autoDeduct}
          onCheckedChange={(v) => setValue("autoDeductOnCompleted", v)}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>{UI_TEXT.INVENTORY.SETTINGS.MAX_RECALC_DAYS}</FieldLabel>
          <FieldContent>
            <Input
              type="number"
              min={1}
              max={365}
              {...register("maxCostRecalcDays", { valueAsNumber: true })}
            />
            <FieldDescription>{UI_TEXT.INVENTORY.SETTINGS.MAX_RECALC_DAYS_DESC}</FieldDescription>
            <FieldError errors={[errors.maxCostRecalcDays]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{UI_TEXT.INVENTORY.SETTINGS.OPENING_STOCK_IMPORT_COOLDOWN}</FieldLabel>
          <FieldContent>
            <Input
              type="number"
              min={0}
              {...register("openingStockImportCooldownHours", { valueAsNumber: true })}
            />
            <FieldDescription>
              {UI_TEXT.INVENTORY.SETTINGS.OPENING_STOCK_IMPORT_COOLDOWN_DESC}
            </FieldDescription>
            <FieldDescription>
              {UI_TEXT.INVENTORY.SETTINGS.OPENING_STOCK_IMPORT_COOLDOWN_HELP}
            </FieldDescription>
            <FieldError errors={[errors.openingStockImportCooldownHours]} />
          </FieldContent>
        </Field>
      </div>
    </div>
  );
}
