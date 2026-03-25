"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { RESERVATION_RULES } from "@/constants/reservation";
import {
  createReservationTimeSlots,
  DEFAULT_RESERVATION_SETTINGS,
  parseTimeToMinutes,
  type ReservationSettingsLike,
} from "@/lib/reservation-settings";
import { UI_TEXT } from "@/lib/UI_Text";
import { reservationService } from "@/services/reservationService";
import { tableService } from "@/services/tableService";
import { Area, AreaStatus, AreaType } from "@/types/Table-Layout";

const VIP_GUEST_THRESHOLD = RESERVATION_RULES.VIP_MIN_GUEST_COUNT;

const formatReservationTime = (value: string) => {
  const segments = value.split(":");
  return segments.length === 2 ? `${value}:00` : value;
};

export interface FormData {
  customerName: string;
  customerPhone: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  partyType: string;
  areaId: string;
}

export function useCreateBooking(
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onSuccess?: () => void
) {
  const [loading, setLoading] = useState(false);
  const [reservationSettings, setReservationSettings] = useState<ReservationSettingsLike>(
    DEFAULT_RESERVATION_SETTINGS
  );
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerPhone: "",
    reservationDate: "",
    reservationTime: "",
    guestCount: 2,
    partyType: "normal",
    areaId: "all",
  });
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const [areasRes, settingsRes] = await Promise.all([
          tableService.getAreas(),
          reservationService.getPublicReservationSettings(),
        ]);

        if (areasRes.isSuccess) {
          setAreas(areasRes.data.filter((a) => a.status === AreaStatus.Active));
        }

        if (settingsRes.isSuccess && settingsRes.data) {
          setReservationSettings((current) => ({
            ...current,
            openTime: settingsRes.data.openTime ?? current.openTime,
            closeTime: settingsRes.data.closeTime ?? current.closeTime,
            breakEnabled: settingsRes.data.breakEnabled ?? current.breakEnabled,
            breakStart: settingsRes.data.breakStart ?? current.breakStart,
            breakEnd: settingsRes.data.breakEnd ?? current.breakEnd,
            overlapBufferMinutes:
              settingsRes.data.overlapBufferMinutes ?? current.overlapBufferMinutes,
            minLeadTimeMinutes: settingsRes.data.minLeadTimeMinutes ?? current.minLeadTimeMinutes,
          }));
        }
      } catch (err) {
        console.error(err);
        setReservationSettings(DEFAULT_RESERVATION_SETTINGS);
      }
    };

    if (open) {
      void fetchAreas();
    }
  }, [open]);

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const timeSlots = useMemo(() => {
    const selectedDate = formData.reservationDate ? new Date(formData.reservationDate) : undefined;
    return createReservationTimeSlots(reservationSettings, 15, selectedDate);
  }, [formData.reservationDate, reservationSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedTime = formatReservationTime(formData.reservationTime);

    if (!formData.reservationDate || !normalizedTime) {
      toast.error(UI_TEXT.RESERVATION.VALIDATION_REQUIRED_DATE_TIME);
      return;
    }

    const reservationDateTime = new Date(`${formData.reservationDate}T${normalizedTime}`);

    if (Number.isNaN(reservationDateTime.getTime())) {
      toast.error(UI_TEXT.RESERVATION.VALIDATION_REQUIRED_DATE_TIME);
      return;
    }

    const leadMinutes = (reservationDateTime.getTime() - Date.now()) / (1000 * 60);
    if (leadMinutes < reservationSettings.minLeadTimeMinutes) {
      toast.error(`Vui lòng đặt chỗ trước ít nhất ${reservationSettings.minLeadTimeMinutes} phút.`);
      return;
    }

    const minutesOfDay = reservationDateTime.getHours() * 60 + reservationDateTime.getMinutes();
    const openTimeMinutes = parseTimeToMinutes(reservationSettings.openTime);
    const closeTimeMinutes = parseTimeToMinutes(reservationSettings.closeTime);
    const breakStartMinutes = parseTimeToMinutes(reservationSettings.breakStart);
    const breakEndMinutes = parseTimeToMinutes(reservationSettings.breakEnd);

    if (minutesOfDay < openTimeMinutes || minutesOfDay > closeTimeMinutes) {
      toast.error(
        `Đặt bàn phải nằm trong giờ hoạt động ${reservationSettings.openTime} - ${reservationSettings.closeTime}.`
      );
      return;
    }

    if (
      reservationSettings.breakEnabled &&
      minutesOfDay >= breakStartMinutes &&
      minutesOfDay < breakEndMinutes
    ) {
      toast.error(
        `Nhà hàng nghỉ giữa ca từ ${reservationSettings.breakStart} đến ${reservationSettings.breakEnd}. Vui lòng chọn giờ khác.`
      );
      return;
    }

    try {
      setLoading(true);
      const res = await reservationService.createReservation({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        reservationDate: formData.reservationDate,
        reservationTime: normalizedTime,
        guestCount: Number(formData.guestCount),
        partyType: formData.partyType,
        areaId: formData.areaId === "all" ? undefined : formData.areaId,
      });

      if (res.isSuccess) {
        onOpenChange(false);
        setFormData({
          customerName: "",
          customerPhone: "",
          reservationDate: "",
          reservationTime: "",
          guestCount: 2,
          partyType: "normal",
          areaId: "all",
        });
        if (onSuccess) onSuccess();
        toast.success(UI_TEXT.COMMON.UPDATE_SUCCESS);
      } else {
        console.error("[CreateReservation] API Error:", res.error || res.message);
        toast.error(res.message || res.error || UI_TEXT.RESERVATION.ERROR_CREATE_FAILED);
      }
    } catch (error: unknown) {
      console.error("[CreateReservation] Connection Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : UI_TEXT.RESERVATION.ERROR_CONNECTION;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const guestCountValue = Number(formData.guestCount) || 0;
  const requiresVipArea = guestCountValue > VIP_GUEST_THRESHOLD;

  useEffect(() => {
    if (requiresVipArea && formData.areaId !== "all") {
      const selectedArea = areas.find((a) => a.areaId === formData.areaId);
      if (selectedArea && selectedArea.type !== AreaType.VIP) {
        setFormData((prev) => ({ ...prev, areaId: "all" }));
        toast.info(UI_TEXT.RESERVATION.VALIDATION_VIP_REQUIRED);
      }
    }
  }, [requiresVipArea, formData.areaId, areas]);

  const filteredAreas = requiresVipArea ? areas.filter((a) => a.type === AreaType.VIP) : areas;

  return {
    loading,
    formData,
    areas: filteredAreas,
    timeSlots,
    requiresVipArea,
    handleChange,
    handleSubmit,
  };
}
