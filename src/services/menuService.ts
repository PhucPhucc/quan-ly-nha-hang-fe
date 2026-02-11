import { ApiResponse, PaginationResult } from "@/types/Api";
import { MenuItem } from "@/types/Menu";

import { apiFetch } from "./api";

export const menuService = {
  // Lấy danh sách món lẻ
  getAll: (
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ApiResponse<PaginationResult<MenuItem>>> => {
    const filteredParams = params
      ? Object.entries(params)
          .filter(([_, v]) => v !== undefined)
          .reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {} as Record<string, string>)
      : undefined;
    const query = filteredParams ? new URLSearchParams(filteredParams).toString() : "";
    return apiFetch<PaginationResult<MenuItem>>(`/v1/menuitems${query ? `?${query}` : ""}`);
  },

  // Thêm món mới
  create: (data: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> =>
    apiFetch<MenuItem>("/v1/menuitems", {
      method: "POST",
      body: data,
    }),

  // Cập nhật món
  update: (id: string, data: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> =>
    apiFetch<MenuItem>(`/v1/menuitems/${id}`, {
      method: "PUT",
      body: data,
    }),

  // Cập nhật trạng thái hết hàng
  updateStock: (id: string, isOutOfStock: boolean): Promise<ApiResponse<void>> =>
    apiFetch<void>(`/v1/menuitems/${id}/stock`, {
      method: "PUT",
      body: { isOutOfStock },
    }),

  // Xóa món (Soft Delete)
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiFetch<void>(`/v1/menuitems/${id}`, {
      method: "DELETE",
    }),
};
