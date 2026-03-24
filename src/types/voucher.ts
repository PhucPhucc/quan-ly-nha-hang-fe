// ===== Voucher Types =====

export enum VoucherType {
  Percent = "Percent",
  Fixed = "Fixed",
  FreeItem = "FreeItem",
}

export interface Voucher {
  voucherId: string;
  voucherCode: string;
  voucherType: VoucherType;
  voucherTypeName: string;
  discountValue: number;
  maxDiscount: number;
  minOrderValue: number;
  itemtId?: string;
  itemName?: string;
  freeQuantity: number;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
}

export interface CreateVoucherPayload {
  voucherCode: string;
  voucherType: VoucherType;
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  itemtId?: string;
  freeQuantity?: number;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  usageLimit: number;
  isActive: boolean;
}

export interface UpdateVoucherPayload extends CreateVoucherPayload {
  voucherId: string;
}

export interface ApplyVoucherPayload {
  orderId: string;
  voucherId: string;
}

export interface UnapplyVoucherPayload {
  orderId: string;
}

export interface ApplyVoucherResult {
  orderId: string;
  orderCode: string;
  oldVoucherId?: string;
  oldVoucherCode?: string;
  newVoucherId: string;
  newVoucherCode: string;
  discountAmount: number;
  totalAmount: number;
}

export interface UnapplyVoucherResult {
  orderId: string;
  orderCode: string;
  oldVoucherId?: string;
  oldVoucherCode?: string;
  totalAmount: number;
}

// Paginated response from the API
export interface VoucherPaginatedResult {
  items: Voucher[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GetVouchersQuery {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  orderBy?: string;
  filters?: string[];
}

// Helper to get display info for voucher type
export const VOUCHER_TYPE_OPTIONS = [
  { value: VoucherType.Percent, label: "Phần trăm", color: "bg-blue-500/15 text-blue-600" },
  { value: VoucherType.Fixed, label: "Cố định", color: "bg-emerald-500/15 text-emerald-600" },
  { value: VoucherType.FreeItem, label: "Tặng món", color: "bg-rose-500/15 text-rose-600" },
];
