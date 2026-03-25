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
import { DEFAULT_RESERVATION_SETTINGS } from "@/lib/reservation-settings";
import { UI_TEXT } from "@/lib/UI_Text";
import { reservationService } from "@/services/reservationService";

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
  breakStart: z.string().min(1, "Giờ bắt đầu nghỉ không được để trống"),
  breakEnd: z.string().min(1, "Giờ kết thúc nghỉ không được để trống"),
  overlapBufferMinutes: z.number().int().min(0),
  minLeadTimeMinutes: z.number().int().min(0),
  gracePeriodMinutes: z.number().int().min(0),
  depositEnabled: z.boolean(),
  depositAmountPerPerson: z.number().int().min(0),
  notifyNewBooking: z.boolean(),
  notifyUpcoming: z.boolean(),
  notifyUpcomingMinutes: z.number().int().min(0).optional(),
});

export type ReservationSettingsInput = z.infer<typeof schema>;

const DEFAULT_VALUES: ReservationSettingsInput = {
  openTime: DEFAULT_RESERVATION_SETTINGS.openTime,
  closeTime: DEFAULT_RESERVATION_SETTINGS.closeTime,
  breakEnabled: DEFAULT_RESERVATION_SETTINGS.breakEnabled,
  breakStart: DEFAULT_RESERVATION_SETTINGS.breakStart,
  breakEnd: DEFAULT_RESERVATION_SETTINGS.breakEnd,
  overlapBufferMinutes: DEFAULT_RESERVATION_SETTINGS.overlapBufferMinutes,
  minLeadTimeMinutes: DEFAULT_RESERVATION_SETTINGS.minLeadTimeMinutes,
  gracePeriodMinutes: 15,
  depositEnabled: false,
  depositAmountPerPerson: 0,
  notifyNewBooking: true,
  notifyUpcoming: true,
  notifyUpcomingMinutes: 0,
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
    reset,
    formState: { errors },
  } = useForm<ReservationSettingsInput>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  React.useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

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
              depositEnabled={Boolean(depositEnabled)}
              register={register}
              setValue={setValue}
              errors={errors}
            />

            <div className="border-t border-border" />
            <BookingNotifySection
              notifyNewBooking={Boolean(notifyNewBooking)}
              notifyUpcoming={Boolean(notifyUpcoming)}
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
  const [initialValues, setInitialValues] =
    React.useState<ReservationSettingsInput>(DEFAULT_VALUES);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      setLoading(true);
      try {
        const response = await reservationService.getReservationSettings();
        if (response.isSuccess && response.data && isMounted) {
          setInitialValues((current) => ({
            ...current,
            openTime: response.data.openTime ?? current.openTime,
            closeTime: response.data.closeTime ?? current.closeTime,
            breakEnabled: response.data.breakEnabled ?? current.breakEnabled,
            breakStart: response.data.breakStart ?? current.breakStart,
            breakEnd: response.data.breakEnd ?? current.breakEnd,
            overlapBufferMinutes:
              response.data.overlapBufferMinutes ?? current.overlapBufferMinutes,
            minLeadTimeMinutes: response.data.minLeadTimeMinutes ?? current.minLeadTimeMinutes,
            gracePeriodMinutes: response.data.gracePeriodMinutes ?? current.gracePeriodMinutes,
            depositEnabled: response.data.depositEnabled ?? current.depositEnabled,
            depositAmountPerPerson:
              response.data.depositAmountPerPerson ?? current.depositAmountPerPerson,
            notifyNewBooking: response.data.notifyNewBooking ?? current.notifyNewBooking,
            notifyUpcoming: response.data.notifyUpcoming ?? current.notifyUpcoming,
          }));
        }
      } catch {
        toast.error(UI_TEXT.API.NETWORK_ERROR);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (data: ReservationSettingsInput) => {
    setSaving(true);
    try {
      const response = await reservationService.updateReservationSettings(data);

      if (response.isSuccess && response.data) {
        setInitialValues((current) => ({
          ...current,
          openTime: response.data.openTime ?? data.openTime,
          closeTime: response.data.closeTime ?? data.closeTime,
          breakEnabled: response.data.breakEnabled ?? data.breakEnabled,
          breakStart: response.data.breakStart ?? data.breakStart,
          breakEnd: response.data.breakEnd ?? data.breakEnd,
          overlapBufferMinutes: response.data.overlapBufferMinutes ?? data.overlapBufferMinutes,
          minLeadTimeMinutes: response.data.minLeadTimeMinutes ?? data.minLeadTimeMinutes,
          gracePeriodMinutes: response.data.gracePeriodMinutes ?? data.gracePeriodMinutes,
          depositEnabled: response.data.depositEnabled ?? data.depositEnabled,
          depositAmountPerPerson:
            response.data.depositAmountPerPerson ?? data.depositAmountPerPerson,
          notifyNewBooking: response.data.notifyNewBooking ?? data.notifyNewBooking,
          notifyUpcoming: response.data.notifyUpcoming ?? data.notifyUpcoming,
        }));
      }

      toast.success(SETTINGS.SUCCESS_RESERVATION);
    } catch {
      toast.error(UI_TEXT.API.NETWORK_ERROR);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <ReservationSettingsForm
      initialValues={initialValues}
      saving={saving}
      onSubmit={handleSubmit}
    />
  );
}
