import { ApiResponse, PaginationResult } from "@/types/Api";
import { OrderStatus, OrderType } from "@/types/enums";
import { Order } from "@/types/Order";

import { apiFetch } from "./api";

// Requests
export interface CreateOrderRequest {
  tableId?: string;
  orderType: OrderType;
  note?: string;
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
  reason?: string;
  selectedOptions?: {
    optionGroupId: string;
    selectedValues: {
      optionItemId: string;
      quantity: number;
      note?: string;
    }[];
  }[];
}

export interface SubmitOrderToKitchenRequest {
  orderId: string;
  tableId: string;
  orderType: OrderType;
  note?: string;
  items: {
    menuItemId: string;
    quantity: number;
    note?: string;
    selectedOptions?: {
      optionGroupId: string;
      selectedValues: {
        optionItemId: string;
        quantity: number;
        note?: string;
      }[];
    }[];
  }[];
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: OrderStatus;
  orderType?: OrderType;
  fromDate?: string;
  toDate?: string;
}

export const orderService = {
  createOrder: (data: CreateOrderRequest): Promise<ApiResponse<Order>> =>
    apiFetch<Order>("/orders", {
      method: "POST",
      body: data,
    }),

  getOrderById: (id: string): Promise<ApiResponse<Order>> => apiFetch<Order>(`/orders/${id}`),

  getOrders: (params: PaginationParams): Promise<ApiResponse<PaginationResult<Order>>> => {
    const queryParams = new URLSearchParams();
    if (params.pageNumber) queryParams.append("pageNumber", params.pageNumber.toString());
    if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status.toString());
    if (params.orderType) queryParams.append("orderType", params.orderType.toString());
    if (params.fromDate) queryParams.append("fromDate", params.fromDate);
    if (params.toDate) queryParams.append("toDate", params.toDate);

    return apiFetch<PaginationResult<Order>>(`/orders?${queryParams.toString()}`);
  },

  submitToKitchen: (data: SubmitOrderToKitchenRequest): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/orders/${data.orderId}/submit-to-kitchen`, {
      method: "POST",
      body: data,
    }),

  updateOrderItem: (id: string, data: UpdateOrderItemRequest): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/orders/${id}/items`, {
      method: "PATCH",
      body: data,
    }),

  addOrderItem: (id: string, data: AddOrderItemRequest): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/orders/${id}/items`, {
      method: "POST",
      body: data,
    }),

  cancelOrder: (id: string, reason: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/orders/${id}/cancel`, {
      method: "PATCH",
      body: { orderId: id, reason },
    }),

  cancelOrderItem: (id: string, itemId: string, reason: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/orders/${id}/items/${itemId}/cancel`, {
      method: "PATCH",
      body: { orderId: id, orderItemId: itemId, reason },
    }),

  completeOrder: (id: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/orders/${id}/complete`, {
      method: "PATCH",
      body: { orderId: id },
    }),

  checkoutOrder: (
    orderId: string,
    paymentMethod: string,
    amountReceived?: number
  ): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/billing/orders/${orderId}/checkout`, {
      method: "POST",
      body: { orderId, paymentMethod, amountReceived },
    }),
};
