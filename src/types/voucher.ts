// ===== Voucher Types =====

export enum VoucherType {
  Percent = 1,
  Fixed = 2,
  FreeItem = 3,
}

export interface Voucher {
  promotionId: string;
  code: string;
  type: VoucherType;
  value: number;
  maxDiscount?: number;
  minOrderValue?: number;
  itemId?: string;
  itemName?: string;
  freeQuantity?: number;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount: number;
}

export interface CreateVoucherPayload {
  code: string;
  type: VoucherType;
  value: number;
  maxDiscount?: number;
  minOrderValue?: number;
  itemId?: string;
  freeQuantity?: number;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  usageLimit?: number;
  isActive: boolean;
}

export interface UpdateVoucherPayload extends CreateVoucherPayload {
  promotionId: string;
}

export interface ApplyVoucherPayload {
  orderId: string;
  code: string;
}

export interface UnapplyVoucherPayload {
  orderId: string;
}

export interface ApplyVoucherResult {
  orderId: string;
  orderCode: string;
  oldPromotionId?: string;
  oldPromotionCode?: string;
  newPromotionId?: string;
  newPromotionCode?: string;
  subTotal?: number;
  vatAmount?: number;
  discountAmount: number;
  totalAmount: number;
}

export interface UnapplyVoucherResult {
  orderId: string;
  orderCode: string;
  oldPromotionId?: string;
  oldPromotionCode?: string;
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
  {
    value: VoucherType.Percent,
    label: "Phần trăm",
    color: "bg-blue-500/15 text-blue-600",
  },
  {
    value: VoucherType.Fixed,
    label: "Cố định",
    color: "bg-emerald-500/15 text-emerald-600",
  },
  {
    value: VoucherType.FreeItem,
    label: "Tặng món",
    color: "bg-rose-500/15 text-rose-600",
  },
];
