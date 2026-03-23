import { ApiResponse } from "@/types/Api";
import { Area, AreaType, Table } from "@/types/Table-Layout";

import { apiFetch } from "./api";

// === REQUEST TYPES ===

export interface CreateTableRequest {
  capacity: number;
  areaId: string;
}

export interface UpdateTableRequest {
  tableNumber: number;
  capacity: number;
  areaId: string;
}

export interface CreateAreaRequest {
  name: string;
  codePrefix: string;
  type: AreaType;
  description?: string;
}

export interface UpdateAreaRequest {
  areaId: string;
  name: string;
  codePrefix: string;
  type: AreaType;
  description?: string;
}

// === SERVICE ===

export const tableService = {
  // --- AREA ---
  getAreas: (): Promise<ApiResponse<Area[]>> => apiFetch<Area[]>("/areas"),

  createArea: (data: CreateAreaRequest): Promise<ApiResponse<Area>> =>
    apiFetch<Area>("/areas", { method: "POST", body: data }),

  updateArea: (id: string, data: UpdateAreaRequest): Promise<ApiResponse<Area>> =>
    apiFetch<Area>(`/areas/${id}`, { method: "PUT", body: data }),

  updateAreaStatus: (id: string, isActive: boolean): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/areas/${id}/status`, {
      method: "PATCH",
      body: { isActive },
    }),

  // --- TABLE ---
  getTables: (areaId?: string): Promise<ApiResponse<Table[]>> => {
    const url = areaId ? `/tables?areaId=${areaId}` : "/tables";
    return apiFetch<Table[]>(url);
  },

  createTable: (data: CreateTableRequest): Promise<ApiResponse<Table>> =>
    apiFetch<Table>("/tables", { method: "POST", body: data }),

  updateTable: (id: string, data: UpdateTableRequest): Promise<ApiResponse<Table>> =>
    apiFetch<Table>(`/tables/${id}`, { method: "PUT", body: data }),

  updateTableStatus: (id: string, isActive: boolean): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/tables/${id}/status`, {
      method: "PATCH",
      body: { isActive },
    }),
};
