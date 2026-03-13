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
  currentStock: number;
  lowStockThreshold: number;
  costPrice: number;
  status?: AlertThresholdStatus;
  description?: string;
  isActive: boolean;
  updatedAt: string;
  stockStatus?: string;
}

export interface StockHistory {
  id: string;
  ingredientId: string;
  ingredientName: string;
  batchNumber: string;
  quantityAdded: number;
  costPerUnit: number;
  totalCost: number;
  supplierName: string;
  receivedDate: string;
  expirationDate?: string;
  receivedBy: string; // Employee Name
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

export interface OpeningStockItem {
  ingredientId: string;
  initialQuantity: number;
  costPrice?: number;
}

export interface ImportOpeningStockRequest {
  items: OpeningStockItem[];
}

export interface ImportOpeningStockResponse {
  updatedCount: number;
  transactionCount: number;
  updatedAt: string;
}
