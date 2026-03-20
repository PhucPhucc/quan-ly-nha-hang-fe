import { ApiResponse } from "@/types/Api";
import { Area } from "@/types/Table-Layout";

import { apiFetch } from "./api";

// Matches the standard camelCase JSON response from .NET Core
export interface ReservationDto {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  area: string;
  people: number;
  partyType: string;
  status: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface GetReservationsQuery {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  date?: string;
  areaId?: string;
  status?: string;
}

export interface CreateInternalReservationCommand {
  customerName: string;
  customerPhone: string;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:mm:ss
  guestCount: number;
  partyType: string;
  areaId?: string;
}

export const reservationService = {
  getReservations: (
    query: GetReservationsQuery
  ): Promise<ApiResponse<PagedResult<ReservationDto>>> => {
    const params = new URLSearchParams();
    if (query.pageNumber) params.append("PageNumber", query.pageNumber.toString());
    if (query.pageSize) params.append("PageSize", query.pageSize.toString());
    if (query.search) params.append("Search", query.search);
    if (query.date) params.append("Date", query.date);
    if (query.areaId && query.areaId !== "all") params.append("AreaId", query.areaId);
    if (query.status && query.status !== "all") params.append("Status", query.status);

    return apiFetch<PagedResult<ReservationDto>>(`/reservations?${params.toString()}`);
  },

  createPublicReservation: (
    data: CreateInternalReservationCommand
  ): Promise<ApiResponse<string>> => {
    console.log(123);
    return apiFetch<string>("/public/reservations", { method: "POST", body: data });
  },

  updateReservation: (
    id: string,
    data: CreateInternalReservationCommand
  ): Promise<ApiResponse<string>> => {
    return apiFetch<string>(`/reservations/${id}`, { method: "PUT", body: data });
  },

  cancelReservation: (id: string): Promise<ApiResponse<string>> => {
    return apiFetch<string>(`/reservations/${id}/cancel`, { method: "POST" });
  },

  checkInReservation: (id: string, newAreaId?: string): Promise<ApiResponse<string>> => {
    return apiFetch<string>(`/reservations/${id}/check-in`, {
      method: "POST",
      body: newAreaId ? { newAreaId } : {},
    });
  },

  getAreas: (): Promise<ApiResponse<Area[]>> => {
    return apiFetch<Area[]>("/public/reservations/areas", {
      method: "GET",
    });
  },
};
// export const reservationService = {
//   getAvailableTables: (params: AvailableTablesParams): Promise<ApiResponse<TableResponse[]>> => {
//     const query = new URLSearchParams({
//       ReservationDate: params.reservationDate,
//       ReservationTime: params.reservationTime,
//       AreaId: params.areaId,
//       GuestCount: params.guestCount.toString(),
//     }).toString();

//     return apiFetch<TableResponse[]>(`/public/reservations/available-tables?${query}`);
//   },

//   createReservation: (data: ReservationRequest): Promise<ApiResponse<string>> =>
//     apiFetch<string>("/public/reservations", {
//       method: "POST",
//       body: data,
//     }),
//   getAreas: async () => {
//     return await apiFetch<Area[]>("/public/reservations/areas", {
//       method: "GET",
//     });
//   },
// };
