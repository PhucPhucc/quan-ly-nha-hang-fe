import { OrderType } from "./enums";

export interface PreCheckBillItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  optionsSummary?: string;
  lineTotal: number;
}

export interface PreCheckBillResponse {
  orderId: string;
  orderCode: string;
  tableNumber?: number;
  reservationId?: string;
  employeeName: string;
  customerName?: string;
  customerPhone?: string;
  printedAt: string;
  items: PreCheckBillItem[];
  subTotal: number;
  discount: number;
  voucherCode?: string;
  preTaxAmount: number;
  vatRate: number;
  vat: number;
  totalAmount: number;
  paymentMethod?: string;
  amountReceived?: number;
  changeAmount?: number;
}

// Alias để tương thích với các component cũ
export type PreCheckBill = PreCheckBillResponse;

export interface BillingHistoryRecord {
  orderId: string;
  orderCode: string;
  orderType: OrderType;
  tableId?: string | null;
  paymentMethod?: string;
  paidAt?: string;
  createdAt: string;
  subTotal: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  amountPaid?: number;
  status: string;
}
