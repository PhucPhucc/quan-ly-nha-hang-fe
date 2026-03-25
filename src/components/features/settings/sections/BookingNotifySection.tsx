import { Bell } from "lucide-react";
import React from "react";
import { UseFormSetValue } from "react-hook-form";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { UI_TEXT } from "@/lib/UI_Text";

import type { ReservationSettingsInput } from "../ReservationSettingsForm";
import { SectionHeader } from "../shared/SectionHeader";

const { SETTINGS } = UI_TEXT;

const ITEMS = [
  {
    key: "notifyNewBooking" as const,
    label: SETTINGS.FIELD_NOTIFY_NEW_BOOKING,
    desc: SETTINGS.FIELD_NOTIFY_NEW_BOOKING_DESC,
  },
  {
    key: "notifyUpcoming" as const,
    label: SETTINGS.FIELD_NOTIFY_UPCOMING,
    desc: SETTINGS.FIELD_NOTIFY_UPCOMING_DESC,
  },
];

type Props = {
  notifyNewBooking: boolean;
  notifyUpcoming: boolean;
  setValue: UseFormSetValue<ReservationSettingsInput>;
};

export function BookingNotifySection({ notifyNewBooking, notifyUpcoming, setValue }: Props) {
  const values = { notifyNewBooking, notifyUpcoming };

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={<Bell className="h-4 w-4" />}
        title={SETTINGS.NOTIFICATION_SECTION}
        description={SETTINGS.NOTIFICATION_SECTION_DESC}
      />
      <div className="space-y-0 rounded-lg border border-border bg-muted/20 p-4">
        {ITEMS.map(({ key, label, desc }) => (
          <Field
            key={key}
            orientation="horizontal"
            className="items-start justify-between gap-4 py-3
              [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border/50"
          >
            <div className="max-w-md space-y-0.5">
              <FieldLabel className="text-sm font-medium">{label}</FieldLabel>
              <FieldDescription>{desc}</FieldDescription>
            </div>
            <Switch checked={values[key]} onCheckedChange={(v) => setValue(key, v)} />
          </Field>
        ))}
      </div>
    </div>
  );
}
