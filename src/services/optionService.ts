import { ApiResponse } from "@/types/Api";
import { OptionGroup, OptionItem } from "@/types/Menu";

import { apiFetch } from "./api";

export const optionService = {
  // --- Option Group ---
  getOptionGroupsByMenuItem: (menuItemId: string): Promise<ApiResponse<OptionGroup[]>> =>
    apiFetch<OptionGroup[]>(`/v1/options/menu-item/${menuItemId}`),

  createOptionGroup: (data: Partial<OptionGroup>): Promise<ApiResponse<string>> =>
    apiFetch<string>("/v1/options/group", {
      method: "POST",
      body: data,
    }),

  updateOptionGroup: (id: string, data: Partial<OptionGroup>): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/v1/options/group/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteOptionGroup: (id: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/v1/options/group/${id}`, {
      method: "DELETE",
    }),

  // --- Option Item ---
  createOptionItem: (data: Partial<OptionItem>): Promise<ApiResponse<string>> =>
    apiFetch<string>("/v1/options/item", {
      method: "POST",
      body: data,
    }),

  updateOptionItem: (id: string, data: Partial<OptionItem>): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/v1/options/item/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteOptionItem: (id: string): Promise<ApiResponse<string>> =>
    apiFetch<string>(`/v1/options/item/${id}`, {
      method: "DELETE",
    }),
};
