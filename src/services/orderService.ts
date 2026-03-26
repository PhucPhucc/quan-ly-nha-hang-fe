import { ApiResponse, PaginationResult } from "@/types/Api";
import { EmployeeRole } from "@/types/Employee";
import { OrderStatus, OrderType } from "@/types/enums";
import { Order, OrderDashboardOverview } from "@/types/Order";

import { apiFetch } from "./api";

export interface PayOsQrResponse {
  checkoutUrl?: string;
  qrCode?: string;
  accountName?: string;
  accountNumber?: string;
  bin?: string;
  amount?: number;
  description?: string;
}

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
  tableId: string | null;
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

export interface SplitOrderItemRequest {
  orderItemId: string;
  quantityToSplit: number;
}

export interface SplitOrderRequest {
  destinationOrderId?: string;
  destinationTableId?: string;
  destinationReservationId?: string;
  itemsToSplit: SplitOrderItemRequest[];
}

export interface SplitOrderResponse {
  sourceOrderId: string;
  sourceOrderCode: string;
  sourceOrderTotalAmount: number;
  destinationOrderId: string;
  destinationOrderCode: string;
  destinationOrderTotalAmount: number;
  destinationTableId?: string;
  createdNewOrder: boolean;
}

export interface OrderAuditLogResponse {
  logId: string;
  createdAt: string;
  formattedTime: string;
  orderId: string;
  orderCode: string;
  action: string;
  actionName: string;
  employeeId: string;
  actorName: string;
  actorRole: EmployeeRole;
  oldValue?: string | null;
  newValue?: string | null;
  changeReason?: string | null;
}

export interface OrderAuditLogsParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  action?: string;
}

export const orderService = {
  createOrder: (data: CreateOrderRequest): Promise<ApiResponse<Order>> =>
    apiFetch<Order>("/orders", {
      method: "POST",
      body: data,
    }),
  createTakeAwayOrder: (): Promise<ApiResponse<string>> =>
    apiFetch<string>("/orders", {
      method: "POST",
      body: {
        orderType: OrderType.Takeaway,
      },
    }),

  getOrderById: (id: string): Promise<ApiResponse<Order>> => apiFetch<Order>(`/orders/${id}`),

  getOrderAuditLogs: (
    id: string,
    params: OrderAuditLogsParams = {}
  ): Promise<ApiResponse<PaginationResult<OrderAuditLogResponse>>> => {
    const queryParams = new URLSearchParams();
    if (params.pageNumber) queryParams.append("pageNumber", params.pageNumber.toString());
    if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.action && params.action !== "all")
      queryParams.append("filters", `action:${params.action}`);

    const query = queryParams.toString();
    return apiFetch<PaginationResult<OrderAuditLogResponse>>(
      `/orders/${id}/audit-logs${query ? `?${query}` : ""}`
    );
  },

  getAllOrderAuditLogs: (
    params: OrderAuditLogsParams = {}
  ): Promise<ApiResponse<PaginationResult<OrderAuditLogResponse>>> => {
    const queryParams = new URLSearchParams();
    if (params.pageNumber) queryParams.append("pageNumber", params.pageNumber.toString());
    if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.action && params.action !== "all")
      queryParams.append("filters", `action:${params.action}`);

    const query = queryParams.toString();
    return apiFetch<PaginationResult<OrderAuditLogResponse>>(
      `/orders/audit-logs${query ? `?${query}` : ""}`
    );
  },

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

  getDashboardOverview: (): Promise<ApiResponse<OrderDashboardOverview>> =>
    apiFetch<OrderDashboardOverview>("/dashboard/orders/overview"),

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
      body: { orderId: id, reason, status: OrderStatus.Cancelled },
    }),

  cancelOrderItem: (id: string, itemId: string, reason: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/orders/${id}/items/${itemId}/cancel`, {
      method: "PATCH",
      body: { orderId: id, orderItemId: itemId, reason, status: OrderStatus.Cancelled },
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

  createPayOsQr: (orderId: string): Promise<ApiResponse<PayOsQrResponse | string>> =>
    apiFetch<PayOsQrResponse | string>(`/billing/orders/${orderId}/payos-qr`, {
      method: "POST",
    }),
  // /api/v1/tableoperations/{id}/change-table
  changeTable: (orderId: string, newTableId: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/tableoperations/${orderId}/change-table`, {
      method: "PATCH",
      body: { orderId, tableId: newTableId },
    }),

  mergeOrders: (sourceOrderId: string, targetOrderId: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/tableoperations/${sourceOrderId}/merge`, {
      method: "POST",
      body: { secondOrder: targetOrderId },
    }),

  splitOrder: (
    orderId: string,
    data: SplitOrderRequest
  ): Promise<ApiResponse<SplitOrderResponse>> =>
    apiFetch<SplitOrderResponse>(`/tableoperations/${orderId}/split`, {
      method: "POST",
      body: data,
    }),

  getOrderHistory: (
    orderId: string
  ): Promise<ApiResponse<PaginationResult<OrderAuditLogResponse>>> => {
    return apiFetch<PaginationResult<OrderAuditLogResponse>>(`/orders/${orderId}/audit-logs`);
  },
  // /api/v1/billing/orders/{orderId}/pre-check-bill/pdf
  getOrderReceiptPDF: (orderId: string) =>
    apiFetch(`/billing/orders/${orderId}/pre-check-bill/pdf`, {
      method: "GET",
    }),
};
