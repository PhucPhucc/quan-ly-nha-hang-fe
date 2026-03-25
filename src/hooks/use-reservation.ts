import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  DEFAULT_RESERVATION_SETTINGS,
  parseTimeToMinutes,
  type ReservationSettingsLike,
} from "@/lib/reservation-settings";
import { reservationService } from "@/services/reservationService";
import { ReservationRequest } from "@/types/Reservation";
import { Area } from "@/types/Table-Layout";
// interface Area {
//   areaId: string;
//   name: string;
//   description: string;
//   type: string;
// }
interface ReservationFormState {
  customerName: string;
  customerPhone: string;
  areaId: string;
  note: string;
  guestCount: number;
  partyType: string;
}

export function useReservation(initialDate: Date | undefined) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reservationSettings, setReservationSettings] = useState<ReservationSettingsLike>(
    DEFAULT_RESERVATION_SETTINGS
  );

  const [formData, setFormData] = useState<ReservationFormState>({
    customerName: "",
    customerPhone: "",
    areaId: "",
    note: "",
    guestCount: 1,
    partyType: "General",
  });

  const updateField = <K extends keyof ReservationFormState>(
    field: K,
    value: ReservationFormState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (): Promise<void> => {
    if (
      !date ||
      !selectedTime ||
      !formData.customerName ||
      !formData.customerPhone ||
      !formData.areaId
    ) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    setIsLoading(true);
    try {
      const payload: ReservationRequest = {
        ...formData,
        reservationDate: format(date, "yyyy-MM-dd"),
        reservationTime: selectedTime,
      };

      const reservationDateTime = new Date(`${payload.reservationDate}T${payload.reservationTime}`);
      if (Number.isNaN(reservationDateTime.getTime())) {
        toast.error("Vui lòng chọn ngày và giờ đặt bàn hợp lệ!");
        return;
      }

      const leadMinutes = (reservationDateTime.getTime() - Date.now()) / (1000 * 60);
      if (leadMinutes < reservationSettings.minLeadTimeMinutes) {
        toast.error(
          `Vui lòng đặt chỗ trước ít nhất ${reservationSettings.minLeadTimeMinutes} phút.`
        );
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

      const res = await reservationService.createReservation(payload);

      if (res.isSuccess) {
        toast.success("Đặt bàn thành công! Hẹn gặp bạn tại nhà hàng nhé.");
        setFormData((prev) => ({
          ...prev,
          customerName: "",
          customerPhone: "",
          note: "",
        }));
        setSelectedTime("");
      } else {
        toast.error(res.error || "Đặt bàn thất bại, bạn kiểm tra lại nhé.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Có lỗi kết nối";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const [areas, setAreas] = useState<Area[]>([]);
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const [areasRes, settingsRes] = await Promise.all([
          reservationService.getAreas(),
          reservationService.getPublicReservationSettings(),
        ]);

        const areaData = areasRes.data;

        if (areaData) {
          setAreas(areaData);
          if (areaData.length > 0) {
            updateField("areaId", areaData[0].areaId);
          }
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
            gracePeriodMinutes: settingsRes.data.gracePeriodMinutes ?? current.gracePeriodMinutes,
            depositEnabled: settingsRes.data.depositEnabled ?? current.depositEnabled,
            depositAmountPerPerson:
              settingsRes.data.depositAmountPerPerson ?? current.depositAmountPerPerson,
            notifyNewBooking: settingsRes.data.notifyNewBooking ?? current.notifyNewBooking,
            notifyUpcoming: settingsRes.data.notifyUpcoming ?? current.notifyUpcoming,
          }));
        }
      } catch (error) {
        console.error("Lỗi lấy khu vực:", error);
        setReservationSettings(DEFAULT_RESERVATION_SETTINGS);
      }
    };

    fetchAreas();
  }, []);
  return {
    date,
    setDate,
    selectedTime,
    setSelectedTime,
    reservationSettings,
    formData,
    updateField,
    isLoading,
    handleSubmit,
    areas,
  };
}
