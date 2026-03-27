import { ApiResponse, PaginationResult } from "@/types/Api";
import { BillingHistoryRecord, PreCheckBill } from "@/types/Billing";
import { OrderType } from "@/types/enums";

import { apiFetch } from "./api";

export interface BillingHistoryParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  orderType?: OrderType;
  paymentMethod?: string;
  fromDate?: string;
  toDate?: string;
  filters?: {
    [key: string]: string;
  };
}

export interface SplitBillItemRequest {
  orderItemId: string;
  quantityToSplit: number;
}

export interface SplitBillRequest {
  itemsToSplit: SplitBillItemRequest[];
}

export interface SplitBillItemResponse {
  orderItemId: string;
  orderId: string;
  menuItemId: string;
  itemNameSnapshot: string;
  quantity: number;
  unitPriceSnapshot: number;
}

export interface SplitBillResponse {
  sourceOrderId: string;
  sourceOrderCode: string;
  sourceOrderTotalAmount: number;
  sourceOrderItems: SplitBillItemResponse[];
  destinationOrderId: string;
  destinationOrderCode: string;
  destinationOrderTotalAmount: number;
  destinationOrderItems: SplitBillItemResponse[];
  destinationTableId?: string | null;
}

export const billingService = {
  getBillingHistory: (
    params: BillingHistoryParams
  ): Promise<ApiResponse<PaginationResult<BillingHistoryRecord>>> => {
    const queryParams = new URLSearchParams();

    if (params.pageNumber) queryParams.append("pageNumber", params.pageNumber.toString());
    if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.orderType) queryParams.append("orderType", params.orderType.toString());
    if (params.paymentMethod) queryParams.append("paymentMethod", params.paymentMethod);
    if (params.fromDate) queryParams.append("fromDate", params.fromDate);
    if (params.toDate) queryParams.append("toDate", params.toDate);
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append("filters", `${key}:${value}`);
        }
      });
    }

    return apiFetch<PaginationResult<BillingHistoryRecord>>(
      `/billing/history?${queryParams.toString()}`
    );
  },

  getPreCheckBill: (orderId: string): Promise<ApiResponse<PreCheckBill>> =>
    apiFetch<PreCheckBill>(`/billing/orders/${orderId}/pre-check-bill`, {
      cache: "no-store",
    }),

  splitBill: (orderId: string, data: SplitBillRequest): Promise<ApiResponse<SplitBillResponse>> =>
    apiFetch<SplitBillResponse>(`/billing/orders/${orderId}/split-bill`, {
      method: "POST",
      body: data,
    }),
};
