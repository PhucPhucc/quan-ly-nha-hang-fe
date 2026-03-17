export enum InventoryUnit {
  KG = "kg",
  GRAM = "g",
  LITER = "l",
  ML = "ml",
  PIECE = "pcs",
  PACK = "pack",
  BOX = "box",
}

export enum AlertThresholdStatus {
  NORMAL = "NORMAL",
  LOW_STOCK = "LOW_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export interface Ingredient {
  ingredientId: string;
  name: string;
  code: string;
  unit: InventoryUnit;
  baseUnit?: string;
  currentStock: number;
  lowStockThreshold: number;
  costPrice: number;
  status?: AlertThresholdStatus;
  description?: string;
  isActive: boolean;
  updatedAt: string;
  stockStatus?: string;
  category?: string;
  expirationDate?: string;
}

// Stats for dashboard
export interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  totalValue: number;
}

export interface InventorySettings {
  expiryWarningDays: number;
  defaultLowStockThreshold: number;
  autoDeductOnCompleted: boolean;
  costMethod: string;
  maxCostRecalcDays: number;
  openingStockStatus?: number | string;
  lockedAt?: string | null;
}

export enum InventoryTransactionType {
  OpeningStock = 1,
  StockIn = 2,
  StockInReverse = 3,
}

export interface InventoryTransaction {
  inventoryTransactionId: string;
  ingredientId: string;
  ingredientName: string;
  ingredientCode: string;
  transactionCode?: number;
  transactionType: InventoryTransactionType;
  quantity: number;
  unitCost?: number | null;
  balanceAfter: number;
  reference?: string | null;
  occurredAt: string;
}

export interface OpeningStockItem {
  ingredientId: string;
  initialQuantity: number;
  costPrice?: number;
}

export interface ImportOpeningStockRequest {
  items: OpeningStockItem[];
  confirmOverwrite: boolean;
}

export interface ImportOpeningStockResponse {
  updatedCount: number;
  transactionCount: number;
  updatedAt: string;
}
