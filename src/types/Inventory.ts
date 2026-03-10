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
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: InventoryUnit;
  currentStock: number;
  lowStockThreshold: number;
  costPerUnit: number;
  supplierId?: string;
  supplierName?: string;
  expirationDate?: string; // ISO Date required?
  status: AlertThresholdStatus;
  updatedAt: string;
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
