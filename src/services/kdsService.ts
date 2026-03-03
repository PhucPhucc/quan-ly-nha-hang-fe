import { ApiResponse } from "@/types/Api";

import { apiFetch } from "./api";

export interface KdsItemResponse {
  orderItemId: string;
  orderId: string;
  orderCode: string;
  itemNameSnapshot: string;
  stationSnapshot: string;
  quantity: number;
  itemNote?: string;
  status: string;
  rejectionReason?: string;
  createdAt: string;
  priorityScore: number;
  itemOptions?: string;
}

export interface KdsQueueResponse {
  orderItemId: string;
  orderId: string;
  orderCode: string;
  itemNameSnapshot: string;
  stationSnapshot: string;
  quantity: number;
  itemNote?: string;
  status: string;
  createdAt: string;
  itemOptions?: string;
  queuePosition: number;
}

export interface KdsAuditLogResponse {
  logId: string;
  createdAt: string;
  formattedTime: string;
  orderId: string;
  orderCode: string;
  action: string;
  actionName: string;
  employeeId: string;
  actorName: string;
  actorRole: string;
  reason?: string;
  orderItems: string;
}

export interface KdsAuditLogsParams {
  station?: string;
  action?: string;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
}

export const kdsService = {
  getKdsItems: async (station: string): Promise<ApiResponse<KdsItemResponse[]>> => {
    return apiFetch<KdsItemResponse[]>(`/Kds/items/${encodeURIComponent(station)}`);
  },

  getKdsQueue: async (station: string): Promise<ApiResponse<KdsQueueResponse[]>> => {
    return apiFetch<KdsQueueResponse[]>(`/Kds/queue/${encodeURIComponent(station)}`);
  },

  getAuditLogs: async (
    params: KdsAuditLogsParams = {}
  ): Promise<ApiResponse<KdsAuditLogResponse[]>> => {
    const queryParams = new URLSearchParams();
    if (params.station) queryParams.set("station", params.station);
    if (params.action) queryParams.set("action", params.action);
    if (params.fromDate) queryParams.set("fromDate", params.fromDate);
    if (params.toDate) queryParams.set("toDate", params.toDate);
    if (params.pageNumber) queryParams.set("pageNumber", params.pageNumber.toString());
    if (params.pageSize) queryParams.set("pageSize", params.pageSize.toString());

    const query = queryParams.toString();
    return apiFetch<KdsAuditLogResponse[]>(`/Kds/audit-logs${query ? `?${query}` : ""}`);
  },

  startCooking: async (orderItemId: string): Promise<ApiResponse<string>> => {
    return apiFetch<string>(`/Kds/start-cooking`, {
      method: "POST",
      body: JSON.stringify({ orderItemId }),
    });
  },

  markReady: async (orderItemId: string): Promise<ApiResponse<string>> => {
    return apiFetch<string>(`/Kds/mark-ready`, {
      method: "POST",
      body: JSON.stringify({ orderItemId }),
    });
  },

  rejectItem: async (orderItemId: string, reason: string): Promise<ApiResponse<string>> => {
    return apiFetch<string>(`/Kds/reject`, {
      method: "POST",
      body: JSON.stringify({ orderItemId, reason }),
    });
  },

  returnItem: async (orderItemId: string): Promise<ApiResponse<string>> => {
    return apiFetch<string>(`/Kds/return`, {
      method: "POST",
      body: JSON.stringify({ orderItemId }),
    });
  },
};
