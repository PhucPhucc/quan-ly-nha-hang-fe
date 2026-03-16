import { ApiResponse } from "@/types/Api";
import { AvailableTablesParams, ReservationRequest, TableResponse } from "@/types/Reservation";
import { Area } from "@/types/Table-Layout";

import { apiFetch } from "./api";

export const reservationService = {
  getAvailableTables: (params: AvailableTablesParams): Promise<ApiResponse<TableResponse[]>> => {
    const query = new URLSearchParams({
      ReservationDate: params.reservationDate,
      ReservationTime: params.reservationTime,
      AreaId: params.areaId,
      GuestCount: params.guestCount.toString(),
    }).toString();

    return apiFetch<TableResponse[]>(`/public/reservations/available-tables?${query}`);
  },

  createReservation: (data: ReservationRequest): Promise<ApiResponse<string>> =>
    apiFetch<string>("/public/reservations", {
      method: "POST",
      body: data,
    }),
  getAreas: async () => {
    return await apiFetch<Area[]>("/public/reservations/areas", {
      method: "GET",
    });
  },
};
