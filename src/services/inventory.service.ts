import { apiFetch } from "@/services/api";
import { ApiResponse, PaginationResult, QueryParams } from "@/types/Api";
import {
  CreateInventoryCheckRequest,
  ImportOpeningStockRequest,
  ImportOpeningStockResponse,
  Ingredient,
  InventoryCheck,
  InventoryCheckDetail,
  InventoryLedgerItem,
  InventoryReportItem,
  InventorySettings,
  InventoryStats,
  InventoryTransaction,
  InventoryUnit,
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

    const response = await apiFetch<PaginationResult<Ingredient>>(
      `/ingredients?${params.toString()}`
    );

    // Map baseUnit from backend to unit for frontend
    if (response.isSuccess && response.data) {
      response.data.items = response.data.items.map((item: Ingredient) => ({
        ...item,
        unit: item.unit || (item.baseUnit as unknown as InventoryUnit),
      }));
    }

    return response;
  },

  // Thêm nguyên liệu mới
  addIngredient: async (data: Partial<Ingredient>): Promise<ApiResponse<Ingredient>> => {
    const response = await apiFetch<Ingredient>("/ingredients", {
      method: "POST",
      body: data,
    });

    if (response.isSuccess && response.data) {
      response.data.unit =
        response.data.unit || (response.data.baseUnit as unknown as InventoryUnit);
    }

    return response;
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
    const response = await apiFetch<Ingredient>(`/ingredients/${id}`, {
      method: "PUT",
      body: data,
    });

    if (response.isSuccess && response.data) {
      response.data.unit =
        response.data.unit || (response.data.baseUnit as unknown as InventoryUnit);
    }

    return response;
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

  // Inventory Check
  getInventoryChecks: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: QueryParams
  ): Promise<ApiResponse<PaginationResult<InventoryCheck>>> => {
    const params = new URLSearchParams();
    params.set("pageNumber", page.toString());
    params.set("pageSize", pageSize.toString());
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }

    return apiFetch<PaginationResult<InventoryCheck>>(`/inventory/checks?${params.toString()}`);
  },

  getInventoryCheckDetail: async (id: string): Promise<ApiResponse<InventoryCheckDetail>> => {
    return apiFetch<InventoryCheckDetail>(`/inventory/checks/${id}`);
  },

  createInventoryCheck: async (
    data: CreateInventoryCheckRequest
  ): Promise<ApiResponse<InventoryCheck>> => {
    return apiFetch<InventoryCheck>("/inventory/checks", {
      method: "POST",
      body: data,
    });
  },

  processInventoryCheck: async (id: string): Promise<ApiResponse<boolean>> => {
    return apiFetch<boolean>(`/inventory/checks/${id}/process`, {
      method: "POST",
    });
  },

  // Inventory Report
  getInventoryReport: async (
    fromDate: string,
    toDate: string,
    ingredientId?: string
  ): Promise<ApiResponse<InventoryReportItem[]>> => {
    const params = new URLSearchParams({ fromDate, toDate });
    if (ingredientId) params.set("ingredientId", ingredientId);

    return apiFetch<InventoryReportItem[]>(`/inventory/reports?${params.toString()}`);
  },

  getInventoryLedger: async (
    ingredientId: string,
    fromDate: string,
    toDate: string,
    transactionType?: number
  ): Promise<ApiResponse<InventoryLedgerItem[]>> => {
    const params = new URLSearchParams({ fromDate, toDate });
    if (transactionType) params.set("transactionType", transactionType.toString());

    return apiFetch<InventoryLedgerItem[]>(
      `/ingredients/${ingredientId}/ledger?${params.toString()}`
    );
  },
};
