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

export const kdsService = {
  getKdsItems: async (station: string): Promise<ApiResponse<KdsItemResponse[]>> => {
    return apiFetch<KdsItemResponse[]>(`/Kds/items/${encodeURIComponent(station)}`);
  },

  getKdsQueue: async (station: string): Promise<ApiResponse<KdsQueueResponse[]>> => {
    return apiFetch<KdsQueueResponse[]>(`/Kds/queue/${encodeURIComponent(station)}`);
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
