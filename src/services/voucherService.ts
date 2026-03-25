import { ApiResponse } from "@/types/Api";
import {
  ApplyVoucherPayload,
  ApplyVoucherResult,
  CreateVoucherPayload,
  GetVouchersQuery,
  UnapplyVoucherPayload,
  UnapplyVoucherResult,
  UpdateVoucherPayload,
  Voucher,
  VoucherPaginatedResult,
} from "@/types/voucher";

import { apiFetch } from "./api";

export const voucherService = {
  getAll: (query: GetVouchersQuery = {}): Promise<ApiResponse<VoucherPaginatedResult>> => {
    const params = new URLSearchParams();
    if (query.pageNumber) params.append("PageNumber", query.pageNumber.toString());
    if (query.pageSize) params.append("PageSize", query.pageSize.toString());
    if (query.search) params.append("Search", query.search);
    if (query.orderBy) params.append("OrderBy", query.orderBy);
    if (query.filters) {
      query.filters.forEach((f) => params.append("Filters", f));
    }

    return apiFetch<VoucherPaginatedResult>(`/promotions?${params.toString()}`);
  },

  getById: (id: string): Promise<ApiResponse<Voucher>> => {
    return apiFetch<Voucher>(`/promotions/${id}`);
  },

  create: (data: CreateVoucherPayload): Promise<ApiResponse<Voucher>> => {
    return apiFetch<Voucher>("/promotions", {
      method: "POST",
      body: data,
    });
  },

  update: (id: string, data: UpdateVoucherPayload): Promise<ApiResponse<Voucher>> => {
    return apiFetch<Voucher>(`/promotions/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  delete: (id: string): Promise<ApiResponse<Voucher>> => {
    return apiFetch<Voucher>(`/promotions/${id}`, {
      method: "DELETE",
    });
  },

  toggleStatus: (id: string, isActive: boolean): Promise<ApiResponse<Voucher>> => {
    return apiFetch<Voucher>(`/promotions/${id}/status?isActive=${isActive}`, {
      method: "PATCH",
    });
  },

  apply: (data: ApplyVoucherPayload): Promise<ApiResponse<ApplyVoucherResult>> => {
    return apiFetch<ApplyVoucherResult>("/promotions/apply", {
      method: "POST",
      body: data,
    });
  },

  unapply: (data: UnapplyVoucherPayload): Promise<ApiResponse<UnapplyVoucherResult>> => {
    return apiFetch<UnapplyVoucherResult>("/promotions/unapply", {
      method: "POST",
      body: data,
    });
  },
};
