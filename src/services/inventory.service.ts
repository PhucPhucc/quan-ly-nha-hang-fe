import { apiFetch } from "@/services/api";
import { ApiResponse, PaginationResult, QueryParams } from "@/types/Api";
import {
  ImportOpeningStockRequest,
  ImportOpeningStockResponse,
  Ingredient,
  InventorySettings,
  InventoryStats,
  StockHistory,
} from "@/types/Inventory";

export const inventoryService = {
  // Lấy danh sách nguyên liệu
  getIngredients: async (
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    filters?: QueryParams,
    orderBy?: string
  ): Promise<ApiResponse<PaginationResult<Ingredient>>> => {
    const params = new URLSearchParams();
    params.set("pageNumber", page.toString());
    params.set("pageSize", pageSize.toString());
    if (search) params.set("search", search);
    if (orderBy) params.set("orderBy", orderBy);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append("filters", `${key}=${value}`);
        }
      });
    }

    return apiFetch<PaginationResult<Ingredient>>(`/ingredients?${params.toString()}`);
  },

  // Thêm nguyên liệu mới
  addIngredient: async (data: Partial<Ingredient>): Promise<ApiResponse<Ingredient>> => {
    return apiFetch<Ingredient>("/ingredients", {
      method: "POST",
      body: data,
    });
  },

  // Cập nhật nguyên liệu
  updateIngredient: async (
    id: string,
    data: Partial<Ingredient>
  ): Promise<ApiResponse<Ingredient>> => {
    return apiFetch<Ingredient>(`/ingredients/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  // Ngừng sử dụng nguyên liệu
  deleteIngredient: async (id: string): Promise<ApiResponse<boolean>> => {
    return apiFetch<boolean>(`/ingredients/${id}/deactivate`, {
      method: "PATCH",
    });
  },

  // Lấy lịch sử nhập kho
  getStockHistory: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginationResult<StockHistory>>> => {
    const params = new URLSearchParams();
    params.set("pageNumber", page.toString());
    params.set("pageSize", pageSize.toString());
    return apiFetch<PaginationResult<StockHistory>>(`/inventory/history?${params.toString()}`);
  },

  // Lấy thống kê tổng quan (Dashboard)
  getStats: async (): Promise<ApiResponse<InventoryStats>> => {
    return apiFetch<InventoryStats>("/inventory/stats");
  },

  // Lấy cấu hình kho
  getInventorySettings: async (): Promise<ApiResponse<InventorySettings>> => {
    return apiFetch<InventorySettings>("/inventory/settings");
  },

  // Cập nhật cấu hình kho
  updateInventorySettings: async (data: InventorySettings): Promise<ApiResponse<boolean>> => {
    return apiFetch<boolean>("/inventory/settings", {
      method: "PUT",
      body: data,
    });
  },

  // Nhập số dư đầu kỳ
  importOpeningStock: async (
    data: ImportOpeningStockRequest
  ): Promise<ApiResponse<ImportOpeningStockResponse>> => {
    return apiFetch<ImportOpeningStockResponse>("/inventory/opening-stock", {
      method: "POST",
      body: data,
    });
  },
};
