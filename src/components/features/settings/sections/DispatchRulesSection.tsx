import { Shuffle } from "lucide-react";
import React from "react";
import { UseFormSetValue } from "react-hook-form";

import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";

import { SectionHeader } from "../shared/SectionHeader";
import type { WarehouseSettingsInput } from "../WarehouseSettingsForm";

const { SETTINGS } = UI_TEXT;

type Props = {
  autoDeduct: boolean;
  initialCostMethod: WarehouseSettingsInput["costMethod"];
  setValue: UseFormSetValue<WarehouseSettingsInput>;
};

export function DispatchRulesSection({ autoDeduct, initialCostMethod, setValue }: Props) {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Shuffle className="h-4 w-4" />}
        title={SETTINGS.DISPATCH_SECTION}
        description={SETTINGS.DISPATCH_SECTION_DESC}
      />

      <Field>
        <FieldLabel>{SETTINGS.FIELD_COST_METHOD}</FieldLabel>
        <FieldContent>
          <Select
            defaultValue={initialCostMethod}
            onValueChange={(v) => setValue("costMethod", v as WarehouseSettingsInput["costMethod"])}
          >
            <SelectTrigger className="max-w-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FIFO">{SETTINGS.FIELD_COST_METHOD_FIFO}</SelectItem>
              <SelectItem value="LIFO">{SETTINGS.FIELD_COST_METHOD_LIFO}</SelectItem>
              <SelectItem value="AVG">{SETTINGS.FIELD_COST_METHOD_AVG}</SelectItem>
            </SelectContent>
          </Select>
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
    </div>
  );
}
