import { apiFetch } from "@/services/api";
import { ApiResponse, PaginationResult, QueryParams } from "@/types/Api";
import {
  ImportOpeningStockRequest,
  ImportOpeningStockResponse,
  Ingredient,
  InventorySettings,
  InventoryStats,
  InventoryTransaction,
} from "@/types/Inventory";

function buildFallbackIngredientCode(name: string): string {
  return name.trim().replace(/\s+/g, "").toUpperCase();
}

function extractGeneratedIngredientCode(payload: unknown): string | null {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;
  const possibleKeys = ["code", "generatedCode", "ingredientCode", "value"];

  for (const key of possibleKeys) {
    const value = candidate[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

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

  generateIngredientCode: async (name: string): Promise<ApiResponse<string>> => {
    const normalizedName = name.trim();
    if (!normalizedName) {
      return {
        isSuccess: true,
        data: "",
      };
    }

    const params = new URLSearchParams({ name });
    try {
      const response = await apiFetch<string | Record<string, unknown>>(
        `/ingredients/generate-code?${params.toString()}`
      );
      const generatedCode = extractGeneratedIngredientCode(response.data);

      return {
        ...response,
        data: generatedCode ?? buildFallbackIngredientCode(normalizedName),
      };
    } catch {
      return {
        isSuccess: true,
        data: buildFallbackIngredientCode(normalizedName),
      };
    }
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

  // Kích hoạt lại nguyên liệu
  activateIngredient: async (id: string): Promise<ApiResponse<boolean>> => {
    return apiFetch<boolean>(`/ingredients/${id}/activate`, {
      method: "PATCH",
    });
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
  updateInventorySettings: async (
    data: InventorySettings
  ): Promise<ApiResponse<InventorySettings>> => {
    return apiFetch<InventorySettings>("/inventory/settings", {
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

  // Lịch sử giao dịch kho
  getInventoryTransactions: async (
    page: number = 1,
    pageSize: number = 10,
    options?: { search?: string; filters?: string[]; orderBy?: string }
  ): Promise<ApiResponse<PaginationResult<InventoryTransaction>>> => {
    const params = new URLSearchParams();
    params.set("pageNumber", page.toString());
    params.set("pageSize", pageSize.toString());
    if (options?.search) params.set("search", options.search);
    if (options?.orderBy) params.set("orderBy", options.orderBy);
    if (options?.filters) {
      options.filters.forEach((f) => params.append("filters", f));
    }

    return apiFetch<PaginationResult<InventoryTransaction>>(
      `/inventory/transactions?${params.toString()}`
    );
  },
};
