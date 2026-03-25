"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { RESERVATION_RULES } from "@/constants/reservation";
import { UI_TEXT } from "@/lib/UI_Text";
import { reservationService } from "@/services/reservationService";
import { tableService } from "@/services/tableService";
import { Area, AreaStatus, AreaType } from "@/types/Table-Layout";

const OPEN_TIME_MINUTES = 10 * 60 + 30; // 10:30
const CLOSE_TIME_MINUTES = 22 * 60; // 22:00
const BREAK_START_MINUTES = 13 * 60; // 13:00
const BREAK_END_MINUTES = 17 * 60; // 17:00
const MIN_LEAD_TIME_MINUTES = 45;
const LAST_BOOKING_MINUTES = CLOSE_TIME_MINUTES;
const VIP_GUEST_THRESHOLD = RESERVATION_RULES.VIP_MIN_GUEST_COUNT;

const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let mins = OPEN_TIME_MINUTES; mins <= CLOSE_TIME_MINUTES; mins += 15) {
    if (mins >= BREAK_START_MINUTES && mins < BREAK_END_MINUTES) continue;
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    slots.push(`${hours.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
  }
  return slots;
};

export const TIME_SLOTS = generateTimeSlots();

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
        const res = await tableService.getAreas();
        if (res.isSuccess) setAreas(res.data.filter((a) => a.status === AreaStatus.Active));
      } catch (err) {
        console.error(err);
      }
    };
    if (open) fetchAreas();
  }, [open]);

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
    if (leadMinutes < MIN_LEAD_TIME_MINUTES) {
      toast.error(UI_TEXT.RESERVATION.VALIDATION_MIN_LEAD_TIME);
      return;
    }

    const minutesOfDay = reservationDateTime.getHours() * 60 + reservationDateTime.getMinutes();
    if (minutesOfDay < OPEN_TIME_MINUTES || minutesOfDay > LAST_BOOKING_MINUTES) {
      toast.error(UI_TEXT.RESERVATION.VALIDATION_WITHIN_OPERATING_HOURS);
      return;
    }

    if (minutesOfDay >= BREAK_START_MINUTES && minutesOfDay < BREAK_END_MINUTES) {
      toast.error(UI_TEXT.RESERVATION.VALIDATION_BREAK_TIME);
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
        // Reset form to initial state
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
    requiresVipArea,
    handleChange,
    handleSubmit,
  };
}
