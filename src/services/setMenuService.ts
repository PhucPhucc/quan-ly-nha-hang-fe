import { ApiResponse, PaginationResult } from "@/types/Api";
import { SetMenu } from "@/types/Menu";

import { apiFetch } from "./api";

export const setMenuService = {
  getSetMenus: (
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ApiResponse<PaginationResult<SetMenu>>> => {
    const filteredParams = params
      ? Object.entries(params)
          .filter(([, v]) => v !== undefined)
          .reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {} as Record<string, string>)
      : undefined;
    const query = filteredParams ? new URLSearchParams(filteredParams).toString() : "";
    return apiFetch<PaginationResult<SetMenu>>(`/setmenus${query ? `?${query}` : ""}`);
  },

  getSetMenuById: (id: string): Promise<ApiResponse<SetMenu>> =>
    apiFetch<SetMenu>(`/setmenus/${id}`),

  createSetMenu: (data: Partial<SetMenu>): Promise<ApiResponse<SetMenu>> =>
    apiFetch<SetMenu>("/setmenus", {
      method: "POST",
      body: data,
    }),

  updateSetMenu: (id: string, data: Partial<SetMenu>): Promise<ApiResponse<SetMenu>> =>
    apiFetch<SetMenu>(`/setmenus/${id}`, {
      method: "PUT",
      body: data,
    }),

  updateSetMenuStock: (id: string, isOutOfStock: boolean): Promise<ApiResponse<void>> =>
    apiFetch<void>(`/setmenus/${id}/stock`, {
      method: "PUT",
      body: { setMenuId: id, isOutOfStock },
    }),

  deleteSetMenu: (id: string): Promise<ApiResponse<void>> =>
    apiFetch<void>(`/setmenus/${id}`, {
      method: "DELETE",
    }),
};
