import { InventoryUnit } from "./Inventory";

export type StockOutReason = "Hủy NVL" | "Xuất nội bộ" | "Kiểm kê" | "Khác";

export interface StockOutReceiptItem {
  id: string;
  ingredientId: string;
  ingredientCode?: string;
  ingredientName?: string;
  unit: InventoryUnit | string;
  quantity: number;
  unitPrice?: number | null;
  totalAmount: number;
}

export interface StockOutReceipt {
  id: string;
  receiptCode: string;
  stockOutDate: string;
  reason?: StockOutReason | string;
  totalItems: number;
  totalAmount: number;
  createdBy: string;
  note?: string | null;
  items: StockOutReceiptItem[];
}

export interface CreateStockOutRequest {
  stockOutDate: string;
  reason: StockOutReason | string;
  items: {
    ingredientId: string;
    quantity: number;
    unitPrice?: number | null;
  }[];
}
