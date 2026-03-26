import { Clock } from "lucide-react";
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
  breakEnabled: boolean;
  register: UseFormRegister<ReservationSettingsInput>;
  setValue: UseFormSetValue<ReservationSettingsInput>;
  errors: FieldErrors<ReservationSettingsInput>;
};

export function BookingHoursSection({ breakEnabled, register, setValue, errors }: Props) {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Clock className="h-4 w-4" />}
        title={SETTINGS.BOOKING_HOURS_SECTION}
        description={SETTINGS.BOOKING_HOURS_SECTION_DESC}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>{SETTINGS.FIELD_OPEN_TIME}</FieldLabel>
          <FieldContent>
            <Input type="text" inputMode="numeric" placeholder="08:30" {...register("openTime")} />
            <FieldDescription>{SETTINGS.FIELD_OPEN_TIME_DESC}</FieldDescription>
            <FieldError errors={[errors.openTime]} />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>{SETTINGS.FIELD_CLOSE_TIME}</FieldLabel>
          <FieldContent>
            <Input type="text" inputMode="numeric" placeholder="23:00" {...register("closeTime")} />
            <FieldDescription>{SETTINGS.FIELD_CLOSE_TIME_DESC}</FieldDescription>
            <FieldError errors={[errors.closeTime]} />
          </FieldContent>
        </Field>
      </div>

      <Field
        orientation="horizontal"
        className="items-start justify-between gap-4 rounded-lg border border-border bg-muted/20 p-4"
      >
        <div className="max-w-md space-y-0.5">
          <FieldLabel>{SETTINGS.FIELD_BREAK_ENABLED}</FieldLabel>
          <FieldDescription>{SETTINGS.FIELD_BREAK_ENABLED_DESC}</FieldDescription>
        </div>
        <Switch checked={breakEnabled} onCheckedChange={(v) => setValue("breakEnabled", v)} />
      </Field>

      {breakEnabled && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>{SETTINGS.FIELD_BREAK_START}</FieldLabel>
            <FieldContent>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="14:00"
                {...register("breakStart")}
              />
              <FieldDescription>{SETTINGS.FIELD_BREAK_START_DESC}</FieldDescription>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>{SETTINGS.FIELD_BREAK_END}</FieldLabel>
            <FieldContent>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="17:00"
                {...register("breakEnd")}
              />
              <FieldDescription>{SETTINGS.FIELD_BREAK_END_DESC}</FieldDescription>
            </FieldContent>
          </Field>
        </div>
      )}
    </div>
  );
}
