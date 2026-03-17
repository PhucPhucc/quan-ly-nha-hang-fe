import { format } from "date-fns";
import { useMemo } from "react";
export function useReservationSlots(date: Date | undefined) {
  return useMemo(() => {
    const slots: string[] = [];
    const now = new Date();
    if (!date) return slots;

    const isToday = format(date, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
    const minBookingTime = new Date(now.getTime() + 45 * 60 * 1000);

    for (let hour = 9; hour <= 20; hour++) {
      [0, 30].forEach((minute) => {
        const slotTime = new Date();
        slotTime.setHours(hour, minute, 0, 0);
        if (!isToday || slotTime > minBookingTime) {
          slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
        }
      });
    }
    return slots;
  }, [date]);
}
