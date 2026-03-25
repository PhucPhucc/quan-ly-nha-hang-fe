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

import { BookingHoursSection } from "./sections/BookingHoursSection";
import { BookingNotifySection } from "./sections/BookingNotifySection";
import { BookingRulesSection } from "./sections/BookingRulesSection";
import { DepositSection } from "./sections/DepositSection";

const { SETTINGS } = UI_TEXT;

// ── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  openTime: z.string().min(1, "Giờ mở cửa không được để trống"),
  closeTime: z.string().min(1, "Giờ đóng cửa không được để trống"),
  breakEnabled: z.boolean(),
  breakStart: z.string().optional(),
  breakEnd: z.string().optional(),
  minGuests: z.number().int().min(1),
  maxGuests: z.number().int().min(1),
  minLeadTimeMinutes: z.number().int().min(0),
  gracePeriodMinutes: z.number().int().min(0),
  depositEnabled: z.boolean(),
  depositAmountPerPerson: z.number().min(0),
  notifyNewBooking: z.boolean(),
  notifyUpcoming: z.boolean(),
});

export type ReservationSettingsInput = z.infer<typeof schema>;

const DEFAULT_VALUES: ReservationSettingsInput = {
  openTime: "10:30",
  closeTime: "23:00",
  breakEnabled: true,
  breakStart: "14:00",
  breakEnd: "17:00",
  minGuests: 1,
  maxGuests: 20,
  minLeadTimeMinutes: 45,
  gracePeriodMinutes: 15,
  depositEnabled: false,
  depositAmountPerPerson: 0,
  notifyNewBooking: true,
  notifyUpcoming: true,
};

// ── Form ─────────────────────────────────────────────────────────────────────
type FormProps = {
  initialValues?: ReservationSettingsInput;
  saving?: boolean;
  onSubmit: (data: ReservationSettingsInput) => Promise<void> | void;
};

export function ReservationSettingsForm({
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
  } = useForm<ReservationSettingsInput>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const breakEnabled = useWatch({ control, name: "breakEnabled" });
  const depositEnabled = useWatch({ control, name: "depositEnabled" });
  const notifyNewBooking = useWatch({ control, name: "notifyNewBooking" });
  const notifyUpcoming = useWatch({ control, name: "notifyUpcoming" });

  return (
    <div className="w-full p-4 pb-10 md:p-6 md:pb-12">
      <Card className="mx-auto w-full max-w-3xl border-border shadow-soft pt-5">
        <CardHeader className="gap-1 pb-4">
          <CardTitle className="text-lg">{SETTINGS.RESERVATION_TITLE}</CardTitle>
          <CardDescription>{SETTINGS.RESERVATION_DESC}</CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8 sm:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <BookingHoursSection
              breakEnabled={breakEnabled}
              register={register}
              setValue={setValue}
              errors={errors}
            />

            <div className="border-t border-border" />
            <BookingRulesSection register={register} errors={errors} />

            <div className="border-t border-border" />
            <DepositSection
              depositEnabled={depositEnabled}
              register={register}
              setValue={setValue}
              errors={errors}
            />

            <div className="border-t border-border" />
            <BookingNotifySection
              notifyNewBooking={notifyNewBooking}
              notifyUpcoming={notifyUpcoming}
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
export function ReservationSettingsContainer() {
  const [saving, setSaving] = React.useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (_data: ReservationSettingsInput) => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 800)); // TODO: reservationService.updateSettings
      toast.success(SETTINGS.SUCCESS_RESERVATION);
    } catch {
      toast.error(UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setSaving(false);
    }
  };

  return <ReservationSettingsForm saving={saving} onSubmit={handleSubmit} />;
}
