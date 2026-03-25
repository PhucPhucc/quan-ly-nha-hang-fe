import { useMemo } from "react";

import {
  createReservationTimeSlots,
  type ReservationSettingsLike,
} from "@/lib/reservation-settings";

export function useReservationSlots(
  date: Date | undefined,
  reservationSettings: ReservationSettingsLike
) {
  return useMemo(() => {
    if (!date) return [];
    return createReservationTimeSlots(reservationSettings, 30, date);
  }, [date, reservationSettings]);
}
