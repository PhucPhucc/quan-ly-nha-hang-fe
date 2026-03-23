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

    return apiFetch<PaginationResult<BillingHistoryRecord>>(
      `/billing/history?${queryParams.toString()}`
    );
  },

  getPreCheckBill: (orderId: string): Promise<ApiResponse<PreCheckBill>> =>
    apiFetch<PreCheckBill>(`/billing/orders/${orderId}/pre-check-bill`, {
      cache: "no-store",
    }),
};
