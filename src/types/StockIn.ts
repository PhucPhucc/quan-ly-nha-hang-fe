import { InventoryUnit } from "./Inventory";

export interface StockInReceiptItem {
  id?: string;
  ingredientId: string;
  ingredientName?: string;
  quantity: number;
  unit?: InventoryUnit;
  unitPrice?: number;
  totalAmount: number;
  expirationDate?: string;
  batchCode?: string;
}

export interface StockInReceipt {
  id: string;
  receiptCode: string;
  receivedDate: string;
  totalItems: number;
  totalAmount: number;
  createdBy: string;
  note?: string;
  items: StockInReceiptItem[];
}

export interface CreateStockInRequest {
  receivedDate: string;
  note?: string;
  items: {
    ingredientId: string;
    quantity: number;
    unitPrice?: number;
    expirationDate?: string;
    batchCode?: string;
  }[];
}
