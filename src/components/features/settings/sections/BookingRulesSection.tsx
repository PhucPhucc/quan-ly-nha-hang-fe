import { CalendarClock, Users } from "lucide-react";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { UI_TEXT } from "@/lib/UI_Text";

import type { ReservationSettingsInput } from "../ReservationSettingsForm";
import { SectionHeader } from "../shared/SectionHeader";

const { SETTINGS } = UI_TEXT;

type Props = {
  register: UseFormRegister<ReservationSettingsInput>;
  errors: FieldErrors<ReservationSettingsInput>;
};

export function BookingRulesSection({ register, errors }: Props) {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Users className="h-4 w-4" />}
        title={SETTINGS.BOOKING_RULES_SECTION}
        description={SETTINGS.BOOKING_RULES_SECTION_DESC}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>{SETTINGS.FIELD_MIN_LEAD_TIME}</FieldLabel>
          <FieldContent>
            <Input
              type="number"
              min={0}
              {...register("minLeadTimeMinutes", { valueAsNumber: true })}
            />
            <FieldDescription>{SETTINGS.FIELD_MIN_LEAD_TIME_DESC}</FieldDescription>
            <FieldError errors={[errors.minLeadTimeMinutes]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>{SETTINGS.FIELD_OVERLAP_BUFFER}</FieldLabel>
          <FieldContent>
            <Input
              type="number"
              min={0}
              {...register("overlapBufferMinutes", { valueAsNumber: true })}
            />
            <FieldDescription>{SETTINGS.FIELD_OVERLAP_BUFFER_DESC}</FieldDescription>
            <FieldError errors={[errors.overlapBufferMinutes]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" />
            {SETTINGS.FIELD_GRACE_PERIOD}
          </FieldLabel>
          <FieldContent>
            <Input
              type="number"
              min={0}
              {...register("gracePeriodMinutes", { valueAsNumber: true })}
            />
            <FieldDescription>{SETTINGS.FIELD_GRACE_PERIOD_DESC}</FieldDescription>
            <FieldError errors={[errors.gracePeriodMinutes]} />
          </FieldContent>
        </Field>
      </div>
    </div>
  );
}
