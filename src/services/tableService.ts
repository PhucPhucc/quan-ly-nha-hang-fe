import { ApiResponse } from "@/types/Api";
import { Area, Table } from "@/types/Table-Layout";

import { apiFetch } from "./api";

// === REQUEST TYPES ===

export interface CreateTableRequest {
  tableCode: string;
  capacity: number;
  areaId: string;
}

export interface UpdateTableRequest {
  capacity: number;
}

export interface CreateAreaRequest {
  name: string;
  codePrefix: string;
}

export interface UpdateAreaRequest {
  name: string;
}

// === SERVICE ===

export const tableService = {
  // --- AREA ---
  getAreas: (): Promise<ApiResponse<Area[]>> => apiFetch<Area[]>("/areas"),

  createArea: (data: CreateAreaRequest): Promise<ApiResponse<Area>> =>
    apiFetch<Area>("/areas", { method: "POST", body: data }),

  updateArea: (id: string, data: UpdateAreaRequest): Promise<ApiResponse<Area>> =>
    apiFetch<Area>(`/areas/${id}`, { method: "PUT", body: data }),

  deactivateArea: (id: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/areas/${id}/deactivate`, { method: "PATCH" }),

  // --- TABLE ---
  getTablesByArea: (areaId: string): Promise<ApiResponse<Table[]>> =>
    apiFetch<Table[]>(`/tables?areaId=${areaId}`),

  createTable: (data: CreateTableRequest): Promise<ApiResponse<Table>> =>
    apiFetch<Table>("/tables", { method: "POST", body: data }),

  updateTable: (id: string, data: UpdateTableRequest): Promise<ApiResponse<Table>> =>
    apiFetch<Table>(`/tables/${id}`, { method: "PUT", body: data }),

  deactivateTable: (id: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/tables/${id}/deactivate`, { method: "PATCH" }),
};
