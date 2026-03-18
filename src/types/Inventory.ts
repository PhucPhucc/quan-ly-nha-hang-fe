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

export enum InventoryCheckStatus {
  Draft = 1,
  Processed = 2,
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
  StockOut = 4,
  StockOutReverse = 5,
  SaleDeduction = 6,
  InventoryCheck = 7,
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

// Inventory Check
export interface InventoryCheck {
  inventoryCheckId: string;
  checkDate: string;
  status: InventoryCheckStatus;
  createdBy?: string;
  totalItems: number;
  note?: string;
  createdAt: string;
}

export interface InventoryCheckItem {
  inventoryCheckItemId: string;
  inventoryCheckId: string;
  ingredientId: string;
  ingredientName?: string;
  ingredientCode?: string;
  unit?: string;
  bookQuantity: number;
  physicalQuantity: number;
  differenceQuantity: number;
  reason?: string;
}

export interface InventoryCheckDetail extends InventoryCheck {
  items: InventoryCheckItem[];
}

export interface CreateInventoryCheckRequest {
  checkDate: string;
  note?: string;
  items: {
    ingredientId: string;
    physicalQuantity: number;
    reason?: string;
  }[];
}

// Inventory Report
export interface InventoryReportItem {
  ingredientId: string;
  ingredientName: string;
  ingredientCode: string;
  unit: string;
  openingStock: number;
  totalStockIn: number;
  totalStockOut: number;
  totalSaleDeduction: number;
  totalOutbound: number;
  closingStock: number;
  averageUnitCost: number;
  closingStockValue: number;
}

export interface InventoryLedgerItem {
  occurredAt: string;
  transactionType: InventoryTransactionType;
  referenceNo: string;
  quantityDelta: number;
  balanceAfter: number;
  note?: string;
}
