import { InventoryUnit } from "./Inventory";

export interface StockInReceiptItem {
  id: string;
  ingredientId: string;
  ingredientCode?: string;
  ingredientName?: string;
  quantity: number;
  unit?: InventoryUnit | string;
  unitPrice?: number;
  totalAmount: number;
  expirationDate?: string | null;
  batchCode?: string | null;
}

export interface StockInReceipt {
  id: string;
  receiptCode: string;
  receivedDate: string;
  totalItems: number;
  totalAmount: number;
  createdBy: string;
  note?: string | null;
  items: StockInReceiptItem[];
}

export interface CreateStockInRequest {
  receivedDate: string;
  note?: string;
  items: {
    ingredientId: string;
    quantity: number;
    unitPrice?: number;
    expirationDate?: string | null;
    batchCode?: string | null;
  }[];
}
