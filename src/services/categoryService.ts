import { Category } from "@/types/Menu";

import { apiFetch } from "./api";
import { ApiResponse } from "./menuService";

export const categoryService = {
  // Lấy tất cả danh mục
  getAll: (): Promise<ApiResponse<Category[]>> => apiFetch<Category[]>("/v1/categories"),

  // Thêm danh mục mới
  create: (data: Partial<Category>): Promise<ApiResponse<Category>> =>
    apiFetch<Category>("/v1/categories", {
      method: "POST",
      body: data,
    }),

  // Cập nhật danh mục
  update: (id: string, data: Partial<Category>): Promise<ApiResponse<Category>> =>
    apiFetch<Category>(`/v1/categories/${id}`, {
      method: "PUT",
      body: data,
    }),

  // Xóa danh mục
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiFetch<void>(`/v1/categories/${id}`, {
      method: "DELETE",
    }),
};
