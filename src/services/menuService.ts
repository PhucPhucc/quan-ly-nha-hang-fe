import { MenuItem } from "@/types/Menu";

import { apiFetch } from "./api";

export const menuService = {
  // Lấy danh sách món lẻ
  getAll: () => apiFetch("/menu-items"),

  // Thêm món mới
  create: (data: Partial<MenuItem>) =>
    apiFetch("/menu-items", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Cập nhật món
  update: (id: string, data: Partial<MenuItem>) =>
    apiFetch(`/menu-items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Xóa món (Soft Delete)
  delete: (id: string) =>
    apiFetch(`/menu-items/${id}`, {
      method: "DELETE",
    }),
};
