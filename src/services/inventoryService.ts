import { ApiResponse, PaginationResult } from "@/types/Api";
import {
  AlertThresholdStatus,
  Ingredient,
  InventoryStats,
  InventoryUnit,
  StockHistory,
} from "@/types/Inventory";

// Mock data generator for development without backend
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
    pageSize: number = 10
  ): Promise<ApiResponse<PaginationResult<Ingredient>>> => {
    // TODO: Bỏ comment khi có backend
    // return apiFetch<PaginationResult<Ingredient>>("/inventory/ingredients");

    // Mock response with slicing for pagination
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = mockIngredients.slice(startIndex, startIndex + pageSize);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isSuccess: true,
          data: {
            items: paginatedItems,
            totalCount: mockIngredients.length,
            currentPage: page,
            pageSize: pageSize,
            totalPages: Math.ceil(mockIngredients.length / pageSize) || 1,
          },
        });
      }, 500);
    });
  },

  // Thêm nguyên liệu mới
  addIngredient: async (data: Partial<Ingredient>): Promise<ApiResponse<Ingredient>> => {
    // return apiFetch<Ingredient>("/inventory/ingredients", {
    //   method: "POST",
    //   body: data,
    // });
    return new Promise((resolve) =>
      setTimeout(
        () => resolve({ isSuccess: true, data: { ...data, id: "new-id" } as Ingredient }),
        500
      )
    );
  },

  // Cập nhật nguyên liệu
  updateIngredient: async (
    id: string,
    data: Partial<Ingredient>
  ): Promise<ApiResponse<Ingredient>> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ isSuccess: true, data: { ...data, id } as Ingredient }), 500)
    );
  },

  // Xóa nguyên liệu
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteIngredient: async (_id: string): Promise<ApiResponse<boolean>> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ isSuccess: true, data: true }), 500)
    );
  },

  // Lấy lịch sử nhập kho
  getStockHistory: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginationResult<StockHistory>>> => {
    // return apiFetch<PaginationResult<StockHistory>>("/inventory/history");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isSuccess: true,
          data: {
            items: [],
            totalCount: 0,
            currentPage: page,
            pageSize: pageSize,
            totalPages: 1,
          },
        });
      }, 500);
    });
  },

  // Lấy thống kê tổng quan (Dashboard)
  getStats: async (): Promise<ApiResponse<InventoryStats>> => {
    // return apiFetch<InventoryStats>("/inventory/stats");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isSuccess: true,
          data: {
            totalItems: 124,
            lowStockItems: 12,
            totalValue: 4250.0,
          },
        });
      }, 500);
    });
  },
};
