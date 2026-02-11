import { ApiResponse, PaginationResult } from "@/types/Api";
import { OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

import { apiFetch } from "./api";

// Requests
export interface CreateOrderRequest {
  tableId?: string;
  orderType: OrderType;
  note?: string;
  items: {
    menuItemId: string;
    quantity: number;
    note?: string;
  }[];
}

export interface UpdateOrderItemRequest {
  orderId: string;
  orderItemId: string;
  quantity: number;
  note?: string;
}

export interface AddOrderItemRequest {
  orderId: string;
  menuItemId: string;
  quantity: number;
  note?: string;
}

export interface SubmitOrderToKitchenRequest {
  orderId: string;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: OrderStatus;
  fromDate?: string;
  toDate?: string;
}

export const orderService = {
  createOrder: (data: CreateOrderRequest): Promise<ApiResponse<Order>> =>
    apiFetch<Order>("/v1/orders", {
      method: "POST",
      body: data,
    }),

  getOrders: (params: PaginationParams): Promise<ApiResponse<PaginationResult<Order>>> => {
    const queryParams = new URLSearchParams();
    if (params.pageNumber) queryParams.append("pageNumber", params.pageNumber.toString());
    if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status); // Enum value
    if (params.fromDate) queryParams.append("fromDate", params.fromDate);
    if (params.toDate) queryParams.append("toDate", params.toDate);

    return apiFetch<PaginationResult<Order>>(`/v1/orders?${queryParams.toString()}`);
  },

  submitToKitchen: (data: SubmitOrderToKitchenRequest): Promise<ApiResponse<string>> =>
    apiFetch<string>("/v1/orders/submit-to-kitchen", {
      method: "POST",
      body: data,
    }),

  updateOrderItem: (id: string, data: UpdateOrderItemRequest): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/v1/orders/${id}/items`, {
      method: "PATCH",
      body: data,
    }),

  addOrderItem: (id: string, data: AddOrderItemRequest): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/v1/orders/${id}/items`, {
      method: "POST",
      body: data,
    }),

  cancelOrder: (id: string, reason: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/v1/orders/${id}/cancel`, {
      method: "PATCH",
      body: { orderId: id, reason },
    }),

  cancelOrderItem: (id: string, itemId: string, reason: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/v1/orders/${id}/items/${itemId}/cancel`, {
      method: "PATCH",
      body: { orderId: id, orderItemId: itemId, reason },
    }),

  completeOrder: (id: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/v1/orders/${id}/complete`, {
      method: "PATCH",
      body: { orderId: id },
    }),
};
