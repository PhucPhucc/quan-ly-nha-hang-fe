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
  }): Promise<ApiResponse<PaginationResult<AttendanceReportItem>>> => {
    const queryParams = new URLSearchParams();
    if (params?.pageNumber) queryParams.append("PageNumber", params.pageNumber.toString());
    if (params?.pageSize) queryParams.append("PageSize", params.pageSize.toString());
    if (params?.search) queryParams.append("Search", params.search);
    if (params?.orderBy) queryParams.append("OrderBy", params.orderBy);
    if (params?.filters) {
      params.filters.forEach((f) => queryParams.append("Filters", f));
    }

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
  }): Promise<Blob> => {
    const queryParams = new URLSearchParams();
    if (params?.pageNumber) queryParams.append("PageNumber", params.pageNumber.toString());
    if (params?.pageSize) queryParams.append("PageSize", params.pageSize.toString());
    if (params?.search) queryParams.append("Search", params.search);
    if (params?.orderBy) queryParams.append("OrderBy", params.orderBy);
    if (params?.filters) {
      params.filters.forEach((f) => queryParams.append("Filters", f));
    }

    const queryString = queryParams.toString();
    const url = `/attendances/report/export${queryString ? `?${queryString}` : ""}`;

    // Custom fetch for blob
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}${url}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to export attendance report");
    }

    return response.blob();
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
