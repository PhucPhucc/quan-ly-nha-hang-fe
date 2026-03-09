import { ApiResponse, PaginationResult } from "@/types/Api";
import { MenuItem, SetMenu } from "@/types/Menu";

import { apiFetch } from "./api";

export const menuService = {
  // Lấy danh sách món lẻ
  getAll: (
    page: number = 1,
    pageSize: number = 100
  ): Promise<ApiResponse<PaginationResult<MenuItem>>> => {
    return apiFetch<PaginationResult<MenuItem>>(`/menuitems?page=${page}&pageSize=${pageSize}`);
  },

  // Thêm món mới
  create: (data: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> =>
    apiFetch<MenuItem>("/menuitems", {
      method: "POST",
      body: data,
    }),

  // Cập nhật món
  update: (id: string, data: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> =>
    apiFetch<MenuItem>(`/menuitems/${id}`, {
      method: "PUT",
      body: data,
    }),

  // Cập nhật trạng thái hết hàng
  toggleStock: (id: string, isOutOfStock: boolean): Promise<ApiResponse<void>> =>
    apiFetch<void>(`/menuitems/${id}/stock`, {
      method: "PUT",
      body: { isOutOfStock },
    }),

  // Xóa món (Soft Delete)
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiFetch<void>(`/menuitems/${id}`, {
      method: "DELETE",
    }),

  // Lấy chi tiết món theo ID
  getById: (id: string): Promise<ApiResponse<MenuItem>> => apiFetch<MenuItem>(`/menuitems/${id}`),

  // --- SET MENU (COMBO) METHODS ---

  // Lấy danh sách combo
  getAllSetMenu: (
    page: number = 1,
    pageSize: number = 100
  ): Promise<ApiResponse<PaginationResult<SetMenu>>> => {
    return apiFetch<PaginationResult<SetMenu>>(`/setmenus?page=${page}&pageSize=${pageSize}`);
  },

  // Lấy chi tiết combo theo ID
  getSetMenuById: (id: string): Promise<ApiResponse<SetMenu>> =>
    apiFetch<SetMenu>(`/setmenus/${id}`),

  // Thêm combo mới
  createSetMenu: (data: Partial<SetMenu>): Promise<ApiResponse<SetMenu>> =>
    apiFetch<SetMenu>("/setmenus", {
      method: "POST",
      body: data,
    }),

  // Cập nhật combo
  updateSetMenu: (id: string, data: Partial<SetMenu>): Promise<ApiResponse<SetMenu>> =>
    apiFetch<SetMenu>(`/setmenus/${id}`, {
      method: "PUT",
      body: data,
    }),

  // Xóa combo
  deleteSetMenu: (id: string): Promise<ApiResponse<void>> =>
    apiFetch<void>(`/setmenus/${id}`, {
      method: "DELETE",
    }),

  // Cập nhật trạng thái hết hàng cho combo
  updateSetMenuStock: (id: string, isOutOfStock: boolean): Promise<ApiResponse<void>> =>
    apiFetch<void>(`/setmenus/${id}/stock`, {
      method: "PUT",
      body: { setMenuId: id, isOutOfStock },
    }),
};
