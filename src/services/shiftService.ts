import { ApiResponse, PaginationResult } from "@/types/Api";
import {
  CreateShiftRequest,
  Shift,
  UpdateShiftRequest,
  UpdateShiftStatusRequest,
} from "@/types/Shift";

import { apiFetch } from "./api";

export const shiftService = {
  getShifts: async (params?: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    orderBy?: string;
    filters?: string[];
  }): Promise<ApiResponse<PaginationResult<Shift>>> => {
    const queryParams = new URLSearchParams();
    if (params?.pageNumber) queryParams.append("PageNumber", params.pageNumber.toString());
    if (params?.pageSize) queryParams.append("PageSize", params.pageSize.toString());
    if (params?.search) queryParams.append("Search", params.search);
    if (params?.orderBy) queryParams.append("OrderBy", params.orderBy);
    if (params?.filters) {
      params.filters.forEach((f) => queryParams.append("Filters", f));
    }

    const queryString = queryParams.toString();
    const url = `/shifts${queryString ? `?${queryString}` : ""}`;
    return apiFetch<PaginationResult<Shift>>(url);
  },

  getShiftById: async (id: string): Promise<ApiResponse<Shift>> => {
    return apiFetch<Shift>(`/shifts/${id}`);
  },

  createShift: async (data: CreateShiftRequest): Promise<ApiResponse<Shift>> => {
    return apiFetch<Shift>("/shifts", {
      method: "POST",
      body: data,
    });
  },

  updateShift: async (id: string, data: UpdateShiftRequest): Promise<ApiResponse<Shift>> => {
    return apiFetch<Shift>(`/shifts/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  updateShiftStatus: async (id: string, isActive: boolean): Promise<ApiResponse<boolean>> => {
    const data: UpdateShiftStatusRequest = { isActive };
    return apiFetch<boolean>(`/shifts/${id}/status`, {
      method: "PATCH",
      body: data,
    });
  },

  deleteShift: async (id: string): Promise<ApiResponse<void>> => {
    return apiFetch<void>(`/shifts/${id}`, {
      method: "DELETE",
    });
  },
};
