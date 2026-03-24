import { normalizeInventoryQuantity } from "@/lib/inventory-number";
import { apiFetch } from "@/services/api";
import { ApiResponse, PaginationResult, QueryParams } from "@/types/Api";
import {
  CreateInventoryCheckRequest,
  DisposeLotRequest,
  DisposeLotResponse,
  ImportOpeningStockRequest,
  ImportOpeningStockResponse,
  Ingredient,
  InventoryAlertBadge,
  InventoryAlertsResponse,
  InventoryCheck,
  InventoryCheckDetail,
  InventoryCheckItem,
  InventoryCheckStatus,
  InventoryDashboardOverview,
  InventoryExpiryAlertItem,
  InventoryLedgerItem,
  InventoryReportItem,
  InventorySettings,
  InventoryStats,
  InventoryTransaction,
  InventoryTransactionType,
  InventoryUnit,
  RecalculateCogsResponse,
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

function formatDateOnly(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface InventoryCheckListDto {
  inventoryCheckId: string;
  checkDate: string;
  status: number | string;
  createdByName?: string | null;
  totalItems: number;
}

interface InventoryCheckDetailItemDto {
  inventoryCheckItemId: string;
  inventoryCheckId: string;
  ingredientId: string;
  ingredientCode: string;
  ingredientName: string;
  unit: string;
  bookQuantity: number;
  physicalQuantity: number;
  differenceQuantity: number;
  reason?: string | null;
}

interface InventoryCheckDetailDto extends InventoryCheckListDto {
  createdAt: string;
  items: InventoryCheckDetailItemDto[];
}

interface InventoryCheckCreateFormDto {
  ingredientId: string;
  ingredientCode: string;
  ingredientName: string;
  baseUnit: string;
  bookQuantity: number;
}

interface InventoryCheckProcessDto {
  inventoryCheckId: string;
  status: number | string;
  processedAt?: string | null;
  stockInReceiptId?: string | null;
  stockInReceiptCode?: string | null;
  stockOutReceiptId?: string | null;
  stockOutReceiptCode?: string | null;
}

export interface ProcessInventoryCheckResult {
  inventoryCheckId: string;
  status: InventoryCheckStatus;
  processedAt?: string | null;
  stockInReceiptId?: string | null;
  stockInReceiptCode?: string | null;
  stockOutReceiptId?: string | null;
  stockOutReceiptCode?: string | null;
}

interface PaginationEnvelope<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage?: number;
  pageNumber?: number;
  totalPages: number;
}

function parseInventoryCheckStatus(status: number | string): InventoryCheckStatus {
  if (typeof status === "number") {
    return status;
  }

  switch (status.toLowerCase()) {
    case "processed":
      return InventoryCheckStatus.Processed;
    case "draft":
    default:
      return InventoryCheckStatus.Draft;
  }
}

function mapInventoryCheck(dto: InventoryCheckListDto): InventoryCheck {
  return {
    inventoryCheckId: dto.inventoryCheckId,
    checkDate: dto.checkDate,
    status: parseInventoryCheckStatus(dto.status),
    createdBy: dto.createdByName ?? undefined,
    totalItems: dto.totalItems,
    createdAt:
      "createdAt" in dto && typeof dto.createdAt === "string" ? dto.createdAt : dto.checkDate,
  };
}

function mapInventoryCheckDetail(dto: InventoryCheckDetailDto): InventoryCheckDetail {
  return {
    ...mapInventoryCheck(dto),
    createdAt: dto.createdAt,
    items: dto.items.map((item) => ({
      inventoryCheckItemId: item.inventoryCheckItemId,
      inventoryCheckId: item.inventoryCheckId,
      ingredientId: item.ingredientId,
      ingredientName: item.ingredientName,
      ingredientCode: item.ingredientCode,
      unit: item.unit,
      bookQuantity: normalizeInventoryQuantity(item.bookQuantity),
      physicalQuantity: normalizeInventoryQuantity(item.physicalQuantity),
      differenceQuantity: normalizeInventoryQuantity(item.differenceQuantity),
      reason: item.reason ?? undefined,
    })),
  };
}

function mapInventoryCheckCreateFormItem(
  dto: InventoryCheckCreateFormDto
): Partial<InventoryCheckItem> {
  return {
    ingredientId: dto.ingredientId,
    ingredientName: dto.ingredientName,
    ingredientCode: dto.ingredientCode,
    unit: dto.baseUnit,
    bookQuantity: normalizeInventoryQuantity(dto.bookQuantity),
    physicalQuantity: normalizeInventoryQuantity(dto.bookQuantity),
    differenceQuantity: 0,
    reason: "",
  };
}

function mapInventoryReportItem(dto: InventoryReportItem): InventoryReportItem {
  return {
    ...dto,
    ingredientCode: dto.ingredientCode || "",
    unit: dto.unit || "",
    openingStock: normalizeInventoryQuantity(dto.openingStock),
    totalStockIn: normalizeInventoryQuantity(dto.totalStockIn),
    totalStockOut: normalizeInventoryQuantity(dto.totalStockOut),
    totalSaleDeduction: normalizeInventoryQuantity(dto.totalSaleDeduction),
    totalOutbound: normalizeInventoryQuantity(dto.totalOutbound),
    closingStock: normalizeInventoryQuantity(dto.closingStock),
    averageUnitCost: normalizeInventoryQuantity(dto.averageUnitCost, 2),
    closingStockValue: normalizeInventoryQuantity(dto.closingStockValue, 2),
  };
}

function parseInventoryTransactionType(type: number | string): InventoryTransactionType {
  if (typeof type === "number") {
    return type;
  }

  switch (type.toLowerCase()) {
    case "openingstock":
      return InventoryTransactionType.OpeningStock;
    case "stockin":
      return InventoryTransactionType.StockIn;
    case "stockinreverse":
      return InventoryTransactionType.StockInReverse;
    case "stockout":
      return InventoryTransactionType.StockOut;
    case "stockoutreverse":
      return InventoryTransactionType.StockOutReverse;
    case "salededuction":
      return InventoryTransactionType.SaleDeduction;
    case "inventorycheck":
      return InventoryTransactionType.InventoryCheck;
    default:
      return InventoryTransactionType.InventoryCheck;
  }
}

function mapInventoryLedgerItem(dto: InventoryLedgerItem): InventoryLedgerItem {
  return {
    ingredientId: dto.ingredientId,
    ingredientName: dto.ingredientName,
    occurredAt: dto.occurredAt,
    transactionType: parseInventoryTransactionType(dto.transactionType as number | string),
    referenceNo: dto.referenceNo,
    quantityDelta: normalizeInventoryQuantity(dto.quantityDelta),
    balanceAfter: normalizeInventoryQuantity(dto.balanceAfter),
    note: dto.note,
  };
}

function mapInventoryTransaction(item: InventoryTransaction): InventoryTransaction {
  return {
    ...item,
    quantity: normalizeInventoryQuantity(item.quantity),
    unitCost: item.unitCost == null ? null : normalizeInventoryQuantity(item.unitCost, 2),
    balanceAfter: normalizeInventoryQuantity(item.balanceAfter),
  };
}

interface IngredientMutationRequest extends Partial<Ingredient> {
  useDefaultLowStockThreshold?: boolean;
}

function normalizePagination<T>(
  data: PaginationEnvelope<T>,
  mapper?: (item: T) => T
): PaginationResult<T> {
  const items = mapper ? data.items.map(mapper) : data.items;
  return {
    items: items as T[],
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    currentPage: data.currentPage ?? data.pageNumber ?? 1,
    totalPages: data.totalPages,
  };
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
          params.append("filters", `${key}:${value}`);
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
        currentStock: normalizeInventoryQuantity(item.currentStock),
        costPrice: normalizeInventoryQuantity(item.costPrice, 2),
        unit: item.unit || (item.baseUnit as unknown as InventoryUnit),
      }));
    }

    return response;
  },

  // Thêm nguyên liệu mới
  addIngredient: async (data: IngredientMutationRequest): Promise<ApiResponse<Ingredient>> => {
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
    data: IngredientMutationRequest
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

  getDashboardOverview: async (): Promise<ApiResponse<InventoryDashboardOverview>> => {
    return apiFetch<InventoryDashboardOverview>("/dashboard/inventory/overview");
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

    const response = await apiFetch<PaginationResult<InventoryTransaction>>(
      `/inventory/transactions?${params.toString()}`
    );

    if (response.isSuccess && response.data) {
      return {
        ...response,
        data: {
          ...response.data,
          items: response.data.items.map(mapInventoryTransaction),
        },
      };
    }

    return response;
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
          params.append(
            key,
            key.toLowerCase().includes("date") ? formatDateOnly(value.toString()) : value.toString()
          );
        }
      });
    }

    const response = await apiFetch<PaginationEnvelope<InventoryCheckListDto>>(
      `/inventory/check?${params.toString()}`
    );

    return {
      ...response,
      data: normalizePagination({
        ...response.data,
        items: response.data.items.map(mapInventoryCheck),
      }),
    };
  },

  getInventoryCheckDetail: async (id: string): Promise<ApiResponse<InventoryCheckDetail>> => {
    const response = await apiFetch<InventoryCheckDetailDto>(`/inventory/check/${id}`);

    return {
      ...response,
      data: mapInventoryCheckDetail(response.data),
    };
  },

  getInventoryCheckCreateForm: async (): Promise<ApiResponse<Partial<InventoryCheckItem>[]>> => {
    const response = await apiFetch<InventoryCheckCreateFormDto[]>("/inventory/check/create-form");

    return {
      ...response,
      data: response.data.map(mapInventoryCheckCreateFormItem),
    };
  },

  createInventoryCheck: async (
    data: CreateInventoryCheckRequest
  ): Promise<ApiResponse<InventoryCheck>> => {
    const response = await apiFetch<InventoryCheckListDto>("/inventory/check", {
      method: "POST",
      body: data,
    });

    return {
      ...response,
      data: mapInventoryCheck(response.data),
    };
  },

  processInventoryCheck: async (id: string): Promise<ApiResponse<ProcessInventoryCheckResult>> => {
    const response = await apiFetch<InventoryCheckProcessDto>(`/inventory/check/${id}/process`, {
      method: "POST",
    });

    return {
      ...response,
      data: {
        inventoryCheckId: response.data.inventoryCheckId,
        status: parseInventoryCheckStatus(response.data.status),
        processedAt: response.data.processedAt ?? null,
        stockInReceiptId: response.data.stockInReceiptId ?? null,
        stockInReceiptCode: response.data.stockInReceiptCode ?? null,
        stockOutReceiptId: response.data.stockOutReceiptId ?? null,
        stockOutReceiptCode: response.data.stockOutReceiptCode ?? null,
      },
    };
  },

  // Inventory Report
  getInventoryReport: async (
    fromDate: string,
    toDate: string,
    ingredientId?: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginationResult<InventoryReportItem>>> => {
    const params = new URLSearchParams({
      fromDate: formatDateOnly(fromDate),
      toDate: formatDateOnly(toDate),
    });
    params.set("pageNumber", page.toString());
    params.set("pageSize", pageSize.toString());
    if (ingredientId) params.set("ingredientId", ingredientId);

    const response = await apiFetch<PaginationEnvelope<InventoryReportItem>>(
      `/inventory/report?${params.toString()}`
    );

    return {
      ...response,
      data: normalizePagination({
        ...response.data,
        items: response.data.items.map(mapInventoryReportItem),
      }),
    };
  },

  getInventoryLedger: async (
    ingredientId: string | undefined,
    fromDate: string,
    toDate: string,
    transactionType?: number
  ): Promise<ApiResponse<PaginationResult<InventoryLedgerItem>>> => {
    const params = new URLSearchParams({
      fromDate: formatDateOnly(fromDate),
      toDate: formatDateOnly(toDate),
    });
    if (ingredientId) params.set("ingredientId", ingredientId);
    if (transactionType !== undefined) {
      params.set("transactionType", transactionType.toString());
    }

    const response = await apiFetch<PaginationResult<InventoryLedgerItem>>(
      `/inventory/ledger?${params.toString()}`
    );

    return {
      ...response,
      data: normalizePagination(response.data, mapInventoryLedgerItem),
    };
  },

  // Tính lại giá vốn
  calculateCogs: async (
    fromDate: string,
    toDate: string,
    ingredientId: string | null = null
  ): Promise<ApiResponse<RecalculateCogsResponse>> => {
    const payload: Record<string, string> = {
      fromDate: formatDateOnly(fromDate),
      toDate: formatDateOnly(toDate),
    };
    if (ingredientId && ingredientId !== "all") {
      payload.ingredientId = ingredientId;
    }

    return apiFetch<RecalculateCogsResponse>("/inventory/cogs/recalculate", {
      method: "POST",
      body: payload,
    });
  },

  // Cảnh báo kho
  getInventoryAlertBadge: async (): Promise<ApiResponse<InventoryAlertBadge>> => {
    return apiFetch<InventoryAlertBadge>("/inventory/alerts/badge");
  },

  getInventoryAlerts: async (): Promise<ApiResponse<InventoryAlertsResponse>> => {
    return apiFetch<InventoryAlertsResponse>("/inventory/alerts");
  },

  // Hủy lô
  disposeLot: async (
    lotId: string,
    data: DisposeLotRequest
  ): Promise<ApiResponse<DisposeLotResponse>> => {
    return apiFetch<DisposeLotResponse>(`/inventory/lots/${lotId}/dispose`, {
      method: "POST",
      body: data,
    });
  },

  getInventoryLots: async (
    params?: QueryParams
  ): Promise<ApiResponse<PaginationResult<InventoryExpiryAlertItem>>> => {
    let url = "/inventory/lots";
    if (params) {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) qs.set(key, String(value));
      });
      url += `?${qs.toString()}`;
    }

    const response = await apiFetch<PaginationResult<InventoryExpiryAlertItem>>(url);

    if (!response.isSuccess || !response.data) {
      return response;
    }

    return {
      ...response,
      data: {
        ...response.data,
        items: response.data.items.map((item) => ({
          ...item,
          remainingQuantity: normalizeInventoryQuantity(item.remainingQuantity),
        })),
      },
    };
  },
};
