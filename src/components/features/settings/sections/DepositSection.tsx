import { Wallet } from "lucide-react";
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

import type { ReservationSettingsInput } from "../ReservationSettingsForm";
import { SectionHeader } from "../shared/SectionHeader";

const { SETTINGS } = UI_TEXT;

type Props = {
  depositEnabled: boolean;
  register: UseFormRegister<ReservationSettingsInput>;
  setValue: UseFormSetValue<ReservationSettingsInput>;
  errors: FieldErrors<ReservationSettingsInput>;
};

export function DepositSection({ depositEnabled, register, setValue, errors }: Props) {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Wallet className="h-4 w-4" />}
        title={SETTINGS.DEPOSIT_SECTION}
        description={SETTINGS.DEPOSIT_SECTION_DESC}
      />

      <Field
        orientation="horizontal"
        className="items-start justify-between gap-4 rounded-lg border border-border bg-muted/20 p-4"
      >
        <div className="max-w-md space-y-0.5">
          <FieldLabel>{SETTINGS.FIELD_DEPOSIT_ENABLED}</FieldLabel>
          <FieldDescription>{SETTINGS.FIELD_DEPOSIT_ENABLED_DESC}</FieldDescription>
        </div>
        <Switch checked={depositEnabled} onCheckedChange={(v) => setValue("depositEnabled", v)} />
      </Field>

      {depositEnabled && (
        <Field>
          <FieldLabel>{SETTINGS.FIELD_DEPOSIT_AMOUNT}</FieldLabel>
          <FieldContent>
            <Input
              type="number"
              min={0}
              className="max-w-sm"
              {...register("depositAmountPerPerson", { valueAsNumber: true })}
            />
            <FieldDescription>{SETTINGS.FIELD_DEPOSIT_AMOUNT_DESC}</FieldDescription>
            <FieldError errors={[errors.depositAmountPerPerson]} />
          </FieldContent>
        </Field>
      )}
    </div>
  );
}
