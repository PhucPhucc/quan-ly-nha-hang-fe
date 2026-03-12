import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { reservationService } from "@/services/reservationService";
import { ReservationRequest } from "@/types/Reservation";
interface Area {
  areaId: string;
  name: string;
  description: string;
  type: string | number;
}
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

  const [formData, setFormData] = useState<ReservationFormState>({
    customerName: "",
    customerPhone: "",
    areaId: "",
    note: "",
    guestCount: 2,
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
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc nha!");
      return;
    }

    setIsLoading(true);
    try {
      const payload: ReservationRequest = {
        ...formData,
        reservationDate: format(date, "yyyy-MM-dd"),
        reservationTime: selectedTime,
      };

      const res = await reservationService.createReservation(payload);

      if (res.isSuccess) {
        toast.success("Đặt bàn thành công! Hẹn gặp bạn tại nhà hàng nhé.");
        // Reset các field cần thiết
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
        const res = await reservationService.getAreas();
        const areaData = res.data as Area[];

        if (res.isSuccess && areaData) {
          setAreas(areaData);
          if (areaData.length > 0) {
            updateField("areaId", areaData[0].areaId);
          }
        }
      } catch (error) {
        console.error("Lỗi lấy khu vực:", error);
      }
    };

    fetchAreas();
  }, []);
  return {
    date,
    setDate,
    selectedTime,
    setSelectedTime,
    formData,
    updateField,
    isLoading,
    handleSubmit,
    areas,
  };
}
