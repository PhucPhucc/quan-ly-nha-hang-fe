import { apiFetch } from "@/services/api";
import { ApiResponse, PaginationResult } from "@/types/Api";
import { CreateStockInRequest, StockInReceipt } from "@/types/StockIn";

interface StockInReceiptListDto {
  stockInReceiptId: string;
  receiptCode: string;
  receivedAt: string;
  totalLines: number;
  totalAmount: number;
  createdByName?: string | null;
  note?: string | null;
}

interface StockInReceiptItemDto {
  stockInReceiptItemId: string;
  ingredientId: string;
  ingredientCode: string;
  ingredientName: string;
  unit: string;
  quantity: number;
  unitCost?: number | null;
  lineAmount: number;
  expiryDate?: string | null;
  batchCode?: string | null;
}

interface StockInReceiptDetailDto extends StockInReceiptListDto {
  items: StockInReceiptItemDto[];
}

interface CreateStockInReceiptResponseDto {
  stockInReceiptId: string;
  receiptCode: string;
  receivedAt: string;
  totalLines: number;
  totalAmount: number;
}

export interface ReverseStockInReceiptResponseDto {
  stockInReceiptId: string;
  receiptCode: string;
  reversedAt: string;
}

function mapReceipt(
  dto: StockInReceiptListDto | StockInReceiptDetailDto | CreateStockInReceiptResponseDto
): StockInReceipt {
  const detailDto = dto as StockInReceiptDetailDto;

  return {
    id: dto.stockInReceiptId,
    receiptCode: dto.receiptCode,
    receivedDate: dto.receivedAt,
    totalItems: dto.totalLines,
    totalAmount: dto.totalAmount,
    createdBy: "createdByName" in dto ? (dto.createdByName ?? "-") : "-",
    note: "note" in dto ? (dto.note ?? null) : null,
    items:
      detailDto.items?.map((item) => ({
        id: item.stockInReceiptItemId,
        ingredientId: item.ingredientId,
        ingredientCode: item.ingredientCode,
        ingredientName: item.ingredientName,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitCost ?? undefined,
        totalAmount: item.lineAmount,
        expirationDate: item.expiryDate ?? null,
        batchCode: item.batchCode ?? null,
      })) ?? [],
  };
}

function mapCreateRequest(data: CreateStockInRequest) {
  return {
    receivedAt: data.receivedDate,
    note: data.note,
    items: data.items.map((item) => ({
      ingredientId: item.ingredientId,
      quantity: item.quantity,
      unitCost: item.unitPrice,
      expiryDate: item.expirationDate,
      batchCode: item.batchCode,
    })),
  };
}

export const stockInService = {
  getReceipts: async (
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<PaginationResult<StockInReceipt>>> => {
    const params = new URLSearchParams();
    params.set("pageNumber", page.toString());
    params.set("pageSize", pageSize.toString());
    if (search) params.set("search", search);
    if (startDate) params.set("fromDate", startDate);
    if (endDate) params.set("toDate", endDate);

    const response = await apiFetch<PaginationResult<StockInReceiptListDto>>(
      `/inventory/stock-in?${params.toString()}`
    );

    return {
      ...response,
      data: {
        ...response.data,
        items: response.data.items.map(mapReceipt),
      },
    };
  },

  getReceiptById: async (id: string): Promise<ApiResponse<StockInReceipt>> => {
    const response = await apiFetch<StockInReceiptDetailDto>(`/inventory/stock-in/${id}`);

    return {
      ...response,
      data: mapReceipt(response.data),
    };
  },

  createReceipt: async (data: CreateStockInRequest): Promise<ApiResponse<StockInReceipt>> => {
    const response = await apiFetch<CreateStockInReceiptResponseDto>("/inventory/stock-in", {
      method: "POST",
      body: mapCreateRequest(data),
    });

    return {
      ...response,
      data: mapReceipt(response.data),
    };
  },

  deleteReceipt: async (id: string): Promise<ApiResponse<ReverseStockInReceiptResponseDto>> => {
    return apiFetch<ReverseStockInReceiptResponseDto>(`/inventory/stock-in/${id}`, {
      method: "DELETE",
    });
  },
};
