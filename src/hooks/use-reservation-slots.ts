import { format } from "date-fns";
import { useMemo } from "react";

const OPEN_HOUR = 10;
const CLOSE_HOUR = 23;
const BREAK_START_HOUR = 14;
const BREAK_END_HOUR = 17;

export function useReservationSlots(date: Date | undefined) {
  return useMemo(() => {
    const slots: string[] = [];
    const now = new Date();
    if (!date) return slots;

    const isToday = format(date, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
    const minBookingTime = new Date(now.getTime() + 45 * 60 * 1000);

    for (let hour = OPEN_HOUR; hour <= CLOSE_HOUR; hour++) {
      const minutes = hour === OPEN_HOUR ? [30] : [0, 30];
      minutes.forEach((minute) => {
        // Skip slots in break time (14:00 - 17:00)
        if (hour >= BREAK_START_HOUR && hour < BREAK_END_HOUR) return;
        // Don't add slot past closing hour
        if (hour === CLOSE_HOUR && minute > 0) return;

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
