import { ApiResponse, PaginationResult } from "@/types/Api";
import { Category } from "@/types/Menu";

import { apiFetch } from "./api";

export const categoryService = {
  // Lấy tất cả danh mục
  getAll: (): Promise<ApiResponse<PaginationResult<Category>>> =>
    apiFetch<PaginationResult<Category>>("/categories"),

  // Thêm danh mục mới
  create: (data: Partial<Category>): Promise<ApiResponse<Category>> =>
    apiFetch<Category>("/categories", {
      method: "POST",
      body: data,
    }),

  // Cập nhật danh mục
  update: (id: string, data: Partial<Category>): Promise<ApiResponse<Category>> =>
    apiFetch<Category>(`/categories/${id}`, {
      method: "PUT",
      body: data,
    }),

  // Xóa danh mục
  delete: (id: string): Promise<ApiResponse<void>> =>
    apiFetch<void>(`/categories/${id}`, {
      method: "DELETE",
    }),

  // Lấy danh mục theo ID
  getById: (id: string): Promise<ApiResponse<Category>> => apiFetch<Category>(`/categories/${id}`),
};
