import { ApiResponse, PaginationResult } from "@/types/Api";
import { MenuItem, SetMenu } from "@/types/Menu";

import { apiFetch } from "./api";

export const menuService = {
  getAll: (
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ApiResponse<PaginationResult<MenuItem>>> => {
    const query = buildQuery(params);
    return apiFetch<PaginationResult<MenuItem>>(`/menuitems${query ? `?${query}` : ""}`);
  },

  getById: (id: string): Promise<ApiResponse<MenuItem>> => apiFetch<MenuItem>(`/menuitems/${id}`),

  create: (data: FormData | Partial<MenuItem>): Promise<ApiResponse<MenuItem>> =>
    apiFetch<MenuItem>("/menuitems", {
      method: "POST",
      body: data, // apiFetch sẽ tự hiểu nếu đây là FormData
    }),
  update: (id: string, data: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> =>
    apiFetch<MenuItem>(`/menuitems/${id}`, {
      method: "PUT",
      body: data, // JSON
    }),

  updateStock: (id: string, isOutOfStock: boolean): Promise<ApiResponse<void>> =>
    apiFetch<void>(`/menuitems/${id}/stock`, {
      method: "PUT",
      body: { isOutOfStock },
    }),

  delete: (id: string): Promise<ApiResponse<void>> =>
    apiFetch<void>(`/menuitems/${id}`, {
      method: "DELETE",
    }),
};

type SetMenuItemInput = { menuItemId: string; quantity: number };

type SetMenuUpsert = {
  code: string;
  name: string;
  imageUrl: string;
  categoryId: string;
  description?: string;
  expectedTime: number;
  station: number;
  price: number;
  costPrice: number;
  setMenuItems: SetMenuItemInput[];
  setType?: "COMBO" | "SET_MORNING" | "SET_LUNCH" | number;
};

export const setMenuService = {
  getAll: (
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ApiResponse<PaginationResult<SetMenu>>> => {
    const query = buildQuery(params);
    return apiFetch<PaginationResult<SetMenu>>(`/setmenus${query ? `?${query}` : ""}`);
  },

  getById: (id: string): Promise<ApiResponse<SetMenu>> => apiFetch<SetMenu>(`/setmenus/${id}`),

  /** 🔸 Tạo combo (JSON) – CHẤP NHẬN CẢ Partial<SetMenu> LẪN SetMenuUpsert */
  create: (data: Partial<SetMenu> | SetMenuUpsert): Promise<ApiResponse<SetMenu>> =>
    apiFetch<SetMenu>("/setmenus", {
      method: "POST",
      body: data,
    }),

  /** 🔸 Cập nhật combo (JSON) – CHẤP NHẬN CẢ Partial<SetMenu> LẪN SetMenuUpsert */
  update: (id: string, data: Partial<SetMenu> | SetMenuUpsert): Promise<ApiResponse<SetMenu>> =>
    apiFetch<SetMenu>(`/setmenus/${id}`, {
      method: "PUT",
      body: data,
    }),

  updateStock: (id: string, isOutOfStock: boolean): Promise<ApiResponse<void>> =>
    apiFetch<void>(`/setmenus/${id}/stock`, {
      method: "PUT",
      body: { setMenuId: id, isOutOfStock },
    }),

  delete: (id: string): Promise<ApiResponse<void>> =>
    apiFetch<void>(`/setmenus/${id}`, {
      method: "DELETE",
    }),
};

/* ===== HELPER ===== */
function buildQuery(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return "";

  const filtered = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .reduce(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>
    );

  return new URLSearchParams(filtered).toString();
}
