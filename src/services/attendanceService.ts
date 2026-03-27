import { ApiResponse, PaginationResult } from "@/types/Api";
import {
  AttendanceCheckInResponse,
  AttendanceCheckOutResponse,
  AttendanceReportItem,
} from "@/types/Attendance";

import { apiFetch } from "./api";

export const attendanceService = {
  getReport: async (params?: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    orderBy?: string;
    filters?: string[];
    date?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<PaginationResult<AttendanceReportItem>>> => {
    const queryParams = new URLSearchParams();
    if (params?.pageNumber) queryParams.append("PageNumber", params.pageNumber.toString());
    if (params?.pageSize) queryParams.append("PageSize", params.pageSize.toString());
    if (params?.search) queryParams.append("Search", params.search);
    if (params?.orderBy) queryParams.append("OrderBy", params.orderBy);
    if (params?.filters) {
      params.filters.forEach((f) => queryParams.append("Filters", f));
    }
    if (params?.date) queryParams.append("date", params.date);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const queryString = queryParams.toString();
    const url = `/attendances/report${queryString ? `?${queryString}` : ""}`;
    return apiFetch<PaginationResult<AttendanceReportItem>>(url);
  },

  exportReport: async (params?: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    orderBy?: string;
    filters?: string[];
    date?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> => {
    const queryParams = new URLSearchParams();
    if (params?.pageNumber) queryParams.append("PageNumber", params.pageNumber.toString());
    if (params?.pageSize) queryParams.append("PageSize", params.pageSize.toString());
    if (params?.search) queryParams.append("Search", params.search);
    if (params?.orderBy) queryParams.append("OrderBy", params.orderBy);
    if (params?.filters) {
      params.filters.forEach((f) => queryParams.append("Filters", f));
    }
    if (params?.date) queryParams.append("date", params.date);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const queryString = queryParams.toString();
    const url = `/attendances/report/export${queryString ? `?${queryString}` : ""}`;

    const response = await apiFetch<Blob>(url, {
      responseType: "blob",
    });

    if (!response.isSuccess || !response.data) {
      throw new Error("Failed to export attendance report");
    }

    return response.data;
  },

  checkIn: async (): Promise<ApiResponse<AttendanceCheckInResponse>> => {
    return apiFetch<AttendanceCheckInResponse>("/attendances/checkin", {
      method: "POST",
    });
  },

  checkOut: async (): Promise<ApiResponse<AttendanceCheckOutResponse>> => {
    return apiFetch<AttendanceCheckOutResponse>("/attendances/checkout", {
      method: "PUT",
    });
  },
};
