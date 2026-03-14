import { apiFetch } from "@/services/api";
import { ApiResponse, PaginationResult } from "@/types/Api";
import { CreateStockInRequest, StockInReceipt } from "@/types/StockIn";

export const stockInService = {
  // Lấy danh sách phiếu nhập kho
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
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    return apiFetch<PaginationResult<StockInReceipt>>(`/inventory/stock-in?${params.toString()}`);
  },

  // Lấy chi tiết phiếu nhập
  getReceiptById: async (id: string): Promise<ApiResponse<StockInReceipt>> => {
    return apiFetch<StockInReceipt>(`/inventory/stock-in/${id}`);
  },

  // Tạo phiếu nhập kho mới
  createReceipt: async (data: CreateStockInRequest): Promise<ApiResponse<StockInReceipt>> => {
    return apiFetch<StockInReceipt>("/inventory/stock-in", {
      method: "POST",
      body: data,
    });
  },

  // Xóa (Hủy) phiếu nhập kho
  deleteReceipt: async (id: string): Promise<ApiResponse<boolean>> => {
    return apiFetch<boolean>(`/inventory/stock-in/${id}`, {
      method: "DELETE",
    });
  },
};
