import { ApiResponse } from "@/types/Api";
import {
  AutoAssignShiftRequest,
  CreateShiftAssignmentRequest,
  ShiftAssignment,
  ShiftAssignmentPaginationResult,
  ShiftAssignmentSummary,
  UpdateShiftAssignmentRequest,
} from "@/types/ShiftAssignment";

import { apiFetch } from "./api";

export const shiftAssignmentService = {
  getAssignments: async (params?: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    orderBy?: string;
    filters?: string[];
  }): Promise<ApiResponse<ShiftAssignmentPaginationResult>> => {
    const queryParams = new URLSearchParams();
    if (params?.pageNumber)
      queryParams.append("Pagination.PageNumber", params.pageNumber.toString());
    if (params?.pageSize) queryParams.append("Pagination.PageSize", params.pageSize.toString());
    if (params?.search) queryParams.append("Pagination.Search", params.search);
    if (params?.orderBy) queryParams.append("Pagination.OrderBy", params.orderBy);
    if (params?.filters) {
      params.filters.forEach((f) => queryParams.append("Pagination.Filters", f));
    }

    const queryString = queryParams.toString();
    const url = `/shiftassignments${queryString ? `?${queryString}` : ""}`;
    return apiFetch<ShiftAssignmentPaginationResult>(url);
  },

  getMyShifts: async (params?: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    orderBy?: string;
    filters?: string[];
  }): Promise<ApiResponse<ShiftAssignmentPaginationResult>> => {
    const queryParams = new URLSearchParams();
    if (params?.pageNumber) queryParams.append("PageNumber", params.pageNumber.toString());
    if (params?.pageSize) queryParams.append("PageSize", params.pageSize.toString());
    if (params?.search) queryParams.append("Search", params.search);
    if (params?.orderBy) queryParams.append("OrderBy", params.orderBy);
    if (params?.filters) {
      params.filters.forEach((f) => queryParams.append("Filters", f));
    }

    const queryString = queryParams.toString();
    const url = `/shiftassignments/myshifts${queryString ? `?${queryString}` : ""}`;
    return apiFetch<ShiftAssignmentPaginationResult>(url);
  },

  getAssignmentById: async (id: string): Promise<ApiResponse<ShiftAssignment>> => {
    return apiFetch<ShiftAssignment>(`/shiftassignments/${id}`);
  },

  createAssignment: async (
    data: CreateShiftAssignmentRequest
  ): Promise<ApiResponse<ShiftAssignment>> => {
    return apiFetch<ShiftAssignment>("/shiftassignments", {
      method: "POST",
      body: data,
    });
  },

  updateAssignment: async (
    id: string,
    data: UpdateShiftAssignmentRequest
  ): Promise<ApiResponse<ShiftAssignment>> => {
    return apiFetch<ShiftAssignment>(`/shiftassignments/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  deleteAssignment: async (id: string): Promise<ApiResponse<boolean>> => {
    return apiFetch<boolean>(`/shiftassignments/${id}`, {
      method: "DELETE",
    });
  },

  autoAssign: async (data: AutoAssignShiftRequest): Promise<ApiResponse<ShiftAssignment[]>> => {
    return apiFetch<ShiftAssignment[]>("/shiftassignments/auto", {
      method: "POST",
      body: data,
    });
  },

  getSummary: async (params: {
    startDate: string;
    endDate: string;
  }): Promise<ApiResponse<ShiftAssignmentSummary>> => {
    const queryParams = new URLSearchParams();
    queryParams.append("StartDate", params.startDate);
    queryParams.append("EndDate", params.endDate);
    return apiFetch<ShiftAssignmentSummary>(`/shiftassignments/summary?${queryParams.toString()}`);
  },
};
