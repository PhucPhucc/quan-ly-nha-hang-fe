import { apiFetch } from "@/services/api";
import { ApiResponse, PaginationResult, QueryParams } from "@/types/Api";
import {
  AlertThresholdStatus,
  Ingredient,
  InventoryStats,
  InventoryUnit,
  StockHistory,
} from "@/types/Inventory";

// TODO: Remove if backend always available. Left for fallback during local mock runs.
const mockIngredients: Ingredient[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `ing-${i + 1}`,
  name: `Ingredient ${i + 1}`,
  sku: `SKU-${1000 + i}`,
  category: i % 3 === 0 ? "Meat" : i % 2 === 0 ? "Vegetable" : "Dairy",
  unit: InventoryUnit.KG,
  currentStock: Math.floor(Math.random() * 100),
  lowStockThreshold: 20,
  costPerUnit: Math.floor(Math.random() * 50) + 10,
  status: Math.random() > 0.8 ? AlertThresholdStatus.LOW_STOCK : AlertThresholdStatus.NORMAL,
  isActive: true,
  updatedAt: new Date().toISOString(),
}));

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
};
