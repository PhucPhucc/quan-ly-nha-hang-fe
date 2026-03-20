import { normalizeInventoryQuantity } from "@/lib/inventory-number";
import { apiFetch } from "@/services/api";
import { ApiResponse, PaginationResult } from "@/types/Api";
import { CreateStockOutRequest, StockOutReceipt } from "@/types/StockOut";

interface StockOutReceiptListDto {
  stockOutReceiptId: string;
  receiptCode: string;
  stockOutDate: string;
  reason?: string | null;
  totalAmount: number;
  createdByName?: string | null;
  note?: string | null;
  totalItems: number;
}

interface StockOutReceiptItemDto {
  stockOutReceiptItemId: string;
  ingredientId: string;
  ingredientCode: string;
  ingredientName: string;
  unit: string;
  quantity: number;
  unitPrice?: number | null;
  lineAmount: number;
}

interface StockOutReceiptDetailDto extends StockOutReceiptListDto {
  items: StockOutReceiptItemDto[];
}

interface CreateStockOutReceiptResponseDto {
  stockOutReceiptId: string;
  receiptCode: string;
  stockOutDate: string;
  totalAmount: number;
  totalItems: number;
}

export interface ReverseStockOutReceiptResponseDto {
  stockOutReceiptId: string;
  receiptCode: string;
  reversedAt: string;
}

function mapReceipt(
  dto: StockOutReceiptListDto | StockOutReceiptDetailDto | CreateStockOutReceiptResponseDto
): StockOutReceipt {
  const detailDto = dto as StockOutReceiptDetailDto;

  return {
    id: dto.stockOutReceiptId,
    receiptCode: dto.receiptCode,
    stockOutDate: dto.stockOutDate,
    reason: ("reason" in dto ? dto.reason : "note" in dto ? dto.note : undefined) ?? undefined,
    totalItems: dto.totalItems || 0,
    totalAmount: normalizeInventoryQuantity(dto.totalAmount, 2),
    createdBy: "createdByName" in dto ? (dto.createdByName ?? "-") : "-",
    note: "note" in dto ? (dto.note ?? null) : null,
    items:
      detailDto.items?.map((item) => ({
        id: item.stockOutReceiptItemId,
        ingredientId: item.ingredientId,
        ingredientCode: item.ingredientCode,
        ingredientName: item.ingredientName,
        unit: item.unit,
        quantity: normalizeInventoryQuantity(item.quantity),
        unitPrice: item.unitPrice != null ? normalizeInventoryQuantity(item.unitPrice, 2) : null,
        totalAmount: normalizeInventoryQuantity(item.lineAmount, 2),
      })) ?? [],
  };
}

function mapCreateRequest(data: CreateStockOutRequest) {
  return {
    stockOutDate: data.stockOutDate,
    reason: data.reason,
    items: data.items.map((item) => ({
      ingredientId: item.ingredientId,
      quantity: normalizeInventoryQuantity(item.quantity),
      unitPrice: item.unitPrice == null ? null : normalizeInventoryQuantity(item.unitPrice, 2),
    })),
  };
}

export const stockOutService = {
  getReceipts: async (
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<PaginationResult<StockOutReceipt>>> => {
    const params = new URLSearchParams();
    params.set("pageNumber", page.toString());
    params.set("pageSize", pageSize.toString());
    if (search) params.set("search", search);
    if (startDate) params.set("fromDate", startDate);
    if (endDate) params.set("toDate", endDate);

    const response = await apiFetch<PaginationResult<StockOutReceiptListDto>>(
      `/inventory/stock-out?${params.toString()}`
    );

    return {
      ...response,
      data: {
        ...response.data,
        items: response.data.items.map(mapReceipt),
      },
    };
  },

  getReceiptById: async (id: string): Promise<ApiResponse<StockOutReceipt>> => {
    const response = await apiFetch<StockOutReceiptDetailDto>(`/inventory/stock-out/${id}`);

    return {
      ...response,
      data: mapReceipt(response.data),
    };
  },

  createReceipt: async (data: CreateStockOutRequest): Promise<ApiResponse<StockOutReceipt>> => {
    const response = await apiFetch<CreateStockOutReceiptResponseDto>("/inventory/stock-out", {
      method: "POST",
      body: mapCreateRequest(data),
    });

    return {
      ...response,
      data: mapReceipt(response.data),
    };
  },

  deleteReceipt: async (id: string): Promise<ApiResponse<ReverseStockOutReceiptResponseDto>> => {
    return apiFetch<ReverseStockOutReceiptResponseDto>(`/inventory/stock-out/${id}`, {
      method: "DELETE",
    });
  },
};
