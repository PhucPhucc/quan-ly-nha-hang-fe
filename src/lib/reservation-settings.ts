export interface ReservationSettingsLike {
  openTime: string;
  closeTime: string;
  breakEnabled: boolean;
  breakStart: string;
  breakEnd: string;
  overlapBufferMinutes: number;
  minLeadTimeMinutes: number;
  gracePeriodMinutes?: number;
  depositEnabled?: boolean;
  depositAmountPerPerson?: number;
  notifyNewBooking?: boolean;
  notifyUpcoming?: boolean;
}

export const DEFAULT_RESERVATION_SETTINGS: ReservationSettingsLike = {
  openTime: "10:30",
  closeTime: "23:00",
  breakEnabled: true,
  breakStart: "14:00",
  breakEnd: "17:00",
  overlapBufferMinutes: 120,
  minLeadTimeMinutes: 45,
  gracePeriodMinutes: 15,
  depositEnabled: false,
  depositAmountPerPerson: 0,
  notifyNewBooking: true,
  notifyUpcoming: true,
};

export const parseTimeToMinutes = (value: string): number => {
  const [hoursPart, minutesPart] = value.split(":");
  const hours = Number.parseInt(hoursPart ?? "0", 10);
  const minutes = Number.parseInt(minutesPart ?? "0", 10);
  return hours * 60 + minutes;
};

export const formatMinutesToTime = (minutes: number): string => {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

export const createReservationTimeSlots = (
  reservationSettings: ReservationSettingsLike,
  stepMinutes: number,
  selectedDate?: Date
): string[] => {
  const slots: string[] = [];
  const openTimeMinutes = parseTimeToMinutes(reservationSettings.openTime);
  const closeTimeMinutes = parseTimeToMinutes(reservationSettings.closeTime);
  const breakStartMinutes = parseTimeToMinutes(reservationSettings.breakStart);
  const breakEndMinutes = parseTimeToMinutes(reservationSettings.breakEnd);
  const now = new Date();
  const isToday = selectedDate
    ? format(selectedDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")
    : false;
  const minBookingTime = new Date(
    now.getTime() + reservationSettings.minLeadTimeMinutes * 60 * 1000
  );

  for (
    let minutesOfDay = openTimeMinutes;
    minutesOfDay <= closeTimeMinutes;
    minutesOfDay += stepMinutes
  ) {
    if (
      reservationSettings.breakEnabled &&
      minutesOfDay >= breakStartMinutes &&
      minutesOfDay < breakEndMinutes
    ) {
      continue;
    }

    const hours = Math.floor(minutesOfDay / 60);
    const mins = minutesOfDay % 60;
    const slotTime = new Date(now);
    slotTime.setHours(hours, mins, 0, 0);

    if (!isToday || slotTime > minBookingTime) {
      slots.push(`${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`);
    }
  }

  return slots;
};
import { format } from "date-fns";
